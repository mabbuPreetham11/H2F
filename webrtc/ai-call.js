const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const FormData = require('form-data');
const fetch = require('node-fetch');
const multer = require('multer');
const { generateFinanceReport } = require('./report-generator');

const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const sessions = {};

function setupAICall(server, app) {

  // ── WebSocket for AI call ───────────────────────────────────
  const { WebSocketServer } = require('ws');
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/ai-call') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws, req) => {
    const sessionId = new URL(req.url, 'http://localhost')
      .searchParams.get('session');

    if (!sessionId || !sessions[sessionId]) {
      ws.close(1008, 'Invalid session');
      return;
    }

    console.log(`[AI Call] Customer connected: ${sessionId}`);
    sessions[sessionId].customerWs = ws;
    sessions[sessionId].status = 'connected';

    startAIConversation(sessionId);

    ws.on('message', async (data) => {
      const msg = JSON.parse(data);

      // Stop processing if call already ended
      if (sessions[sessionId]?.status === 'ended' ||
        sessions[sessionId]?.status === 'completing') {
        return;
      }

      if (msg.type === 'customer-speech') {
        console.log(`[AI Call] Customer said: ${msg.transcript}`);
        sessions[sessionId].lastLanguage = msg.languageCode || 'en-IN';
        await continueConversation(sessionId, msg.transcript);
      }

      if (msg.type === 'call-ended') {
        console.log(`[AI Call] Customer ended call: ${sessionId}`);
        sessions[sessionId].status = 'ended';
        // Clear any pending processing
        sessions[sessionId].customerWs = null;
      }
    });

    ws.on('close', () => {
      console.log(`[AI Call] Customer disconnected: ${sessionId}`);
      if (sessions[sessionId]) sessions[sessionId].status = 'disconnected';
    });
  });

  // ── AI conversation logic ───────────────────────────────────
  async function startAIConversation(sessionId) {
    const s = sessions[sessionId];
    s.startTime = Date.now();
    s.createdAt = new Date().toISOString();
    const greeting = `Hello, this is an automated call from ${s.bankName}. Am I speaking with ${s.customerName}? I am calling regarding your loan account ending in ${s.loanAccount}. Do you have a moment to speak?`;
    s.conversationHistory = [{ role: 'model', content: greeting }];
    await speakToCustomer(sessionId, greeting);
  }

  async function continueConversation(sessionId, customerResponse) {
    const s = sessions[sessionId];
    s.conversationHistory.push({ role: 'user', content: customerResponse });

    try {
      const systemPrompt = `You are a professional loan recovery agent for ${s.bankName}.
    Call purpose: Collect overdue loan of ₹${s.loanAmount} from ${s.customerName} (account: ${s.loanAccount}).
    You already greeted them with: "${s.conversationHistory[0].content}"

    LANGUAGE: Always reply in the same language the customer uses.

    STRICT [CALL_COMPLETE] RULE:
    - [CALL_COMPLETE] can ONLY be output after ALL of these are done:
      a) Customer identity confirmed
      b) Loan account discussed
      c) Payment plan OR refusal after 3 attempts OR valid reason to end
      d) You asked "Is there anything else I can help you with?"
      e) Customer responded negatively to that question
    - NEVER output [CALL_COMPLETE] in the first 3 exchanges
    - NEVER output [CALL_COMPLETE] just because customer said yes or acknowledged

    CONVERSATION FLOW (follow strictly in order):
    Step 1 → Confirm identity: "Am I speaking with ${s.customerName}?"
    Step 2 → Discuss loan: remind of ₹${s.loanAmount} overdue
    Step 3 → Ask about payment status
    Step 4 → If not paid → understand reason → negotiate plan
    Step 5 → Confirm agreed plan with specific date and amount
    Step 6 → Ask "Is there anything else I can help you with?"
    Step 7 → On negative response → [CALL_COMPLETE]

    PRIORITY HANDLING:
    - Wrong person → apologize and [CALL_COMPLETE]
    - Already paid → note details and [CALL_COMPLETE]
    - Busy → get callback time and [CALL_COMPLETE]
    - Legal/bankruptcy → escalate and [CALL_COMPLETE]
    - Refusing payment → try 3 times before [CALL_COMPLETE]
    - Aggressive → warn once, then [CALL_COMPLETE]

    LANGUAGE: Reply in same language as customer.
    STYLE: 2-3 short complete sentences. Never cut off mid sentence.

    When ending output exactly on its own line:
    [CALL_COMPLETE]
    Do not add any JSON after it.`;


      // Build messages for Groq
      const messages = [
        { role: 'system', content: systemPrompt },
        // Add conversation history (skip first greeting, already in system prompt)
        ...s.conversationHistory.slice(1).map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.content
        }))
      ];

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',  // best free model on Groq
        messages,
        max_tokens: 500,
        temperature: 0.7
      });

      const aiReply = response.choices[0].message.content;
      console.log(`[AI Call] AI: ${aiReply}`);

      if (aiReply.includes('[CALL_COMPLETE]')) {
        console.log('[AI Call] Call complete — generating report...');

        s.durationSeconds = Math.floor((Date.now() - s.startTime) / 1000);
        s.status = 'completing';

        generateFinanceReport(s).then(report => {
          if (report) {
            s.summary = report.current_status;
            s.fullReport = report;
            console.log('[Report] Generated successfully');
          }
        });

        const goodbyeMsg = s.lastLanguage === 'kn-IN'
          ? 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ದಿನ ಶುಭವಾಗಿರಲಿ.'
          : s.lastLanguage === 'hi-IN'
            ? 'धन्यवाद। आपका दिन शुभ हो।'
            : 'Thank you for your time. We will follow up as discussed. Have a good day.';

        await speakToCustomer(sessionId, goodbyeMsg, s.lastLanguage || 'en-IN');

        setTimeout(() => {
          if (s.customerWs?.readyState === WebSocket.OPEN) {
            s.customerWs.send(JSON.stringify({ type: 'call-ended' }));
            s.customerWs.close();
          }
          s.status = 'ended';
        }, 4000);
        return;
      }

      s.conversationHistory.push({ role: 'assistant', content: aiReply });
      await speakToCustomer(sessionId, aiReply, s.lastLanguage || 'en-IN');

    } catch (err) {
      console.error('[AI Call] Groq error:', err.message);
    }
  }

  // ── Sarvam TTS ──────────────────────────────────────────────
  async function speakToCustomer(sessionId, text, languageCode = 'en-IN') {
    const s = sessions[sessionId];
    try {
      const response = await axios.post(
        'https://api.sarvam.ai/text-to-speech',
        {
          inputs: [text],
          target_language_code: languageCode,
          speaker: 'anushka',
          pace: 1.0,
          loudness: 1.5,
          model: 'bulbul:v2'
        },
        {
          headers: {
            'api-subscription-key': process.env.SARVAM_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const audioBase64 = response.data.audios[0];
      if (s.customerWs?.readyState === WebSocket.OPEN) {
        s.customerWs.send(JSON.stringify({
          type: 'ai-speech',
          audio: audioBase64,
          text
        }));
      }
    } catch (err) {
      console.error('[AI Call] TTS error:', err.response?.data || err.message);
    }
  }

  // ── Sarvam STT ──────────────────────────────────────────────
  const upload = multer({ storage: multer.memoryStorage() });

  app.post('/transcribe-ai', upload.single('audio'), async (req, res) => {
    try {
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: req.file.originalname.endsWith('.wav') ? 'audio.wav' : 'audio.webm',
        contentType: req.file.originalname.endsWith('.wav') ? 'audio/wav' : 'audio/webm'
      });
      form.append('model', 'saaras:v3');
      form.append('language_code', 'unknown'); // auto detect

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': process.env.SARVAM_API_KEY,
          ...form.getHeaders()
        },
        body: form
      });

      const result = await response.json();
      console.log('STT result:', result);
      res.json({
        transcript: result.transcript || '',
        language_code: result.language_code || 'en-IN' // return detected language
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Dashboard routes ─────────────────────────────────────────
  app.post('/create-ai-session', (req, res) => {
    const sessionId = uuidv4();
    sessions[sessionId] = {
      customerName: req.body.customerName || 'Customer',
      bankName: req.body.bankName || 'ABC Bank',
      loanAccount: req.body.loanAccount || 'XXXX1234',
      loanAmount: req.body.loanAmount || '50,000',
      conversationHistory: [],
      status: 'waiting',
      summary: null,
      customerWs: null
    };

    const customerLink =
      `http://localhost:3000/customer-ai.html?session=${sessionId}`;
    console.log(`[AI Call] Session created: ${sessionId}`);
    res.json({ sessionId, customerLink });
  });

  app.get('/ai-session/:id', (req, res) => {
    const s = sessions[req.params.id];
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json({
      status: s.status,
      summary: s.summary,
      conversationHistory: s.conversationHistory
    });
  });
}

module.exports = { setupAICall };