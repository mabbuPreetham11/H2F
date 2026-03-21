const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
const fetch = require('node-fetch');
const multer = require('multer');

const rooms = {};

function setupWebRTCSignaling(server, app) {

  const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ noServer: true });

// Manually handle upgrade so it doesn't conflict with ai-call ws
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/webrtc-signal') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const roomId = url.searchParams.get('room');
    const role = url.searchParams.get('role');

    if (!roomId || !rooms[roomId]) {
      console.log(`[WebRTC] Invalid room: ${roomId}`);
      ws.close(1008, 'Invalid room');
      return;
    }

    console.log(`[WebRTC] ${role} joined room: ${roomId}`);
    rooms[roomId][`${role}Ws`] = ws;
    ws.roomId = roomId;
    ws.role = role;

    // If both peers are now in the room, notify agent to create offer
    const room = rooms[roomId];
    if (room.agentWs && room.customerWs) {
      console.log(`[WebRTC] Both peers in room — telling agent to create offer`);
      setTimeout(() => {
        room.agentWs.send(JSON.stringify({ type: 'peer-joined', role: 'customer' }));
      }, 500);
    }

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      const otherRole = ws.role === 'agent' ? 'customer' : 'agent';
      const otherWs = rooms[roomId]?.[`${otherRole}Ws`];

      // Forward SDP and ICE to the other peer
      if (['offer', 'answer', 'ice-candidate'].includes(msg.type)) {
        if (otherWs?.readyState === WebSocket.OPEN) {
          otherWs.send(JSON.stringify(msg));
        } else {
          console.log(`[WebRTC] Other peer not ready yet — buffering ${msg.type}`);
        }
      }

      if (msg.type === 'transcript-chunk') {
        if (!rooms[roomId].transcript) rooms[roomId].transcript = [];
        rooms[roomId].transcript.push({
          role: msg.role,
          text: msg.text,
          time: new Date().toISOString()
        });
        console.log(`[Transcript] ${msg.role}: ${msg.text}`);
      }
    });

    ws.on('close', () => {
      console.log(`[WebRTC] ${role} disconnected from room: ${roomId}`);
      if (rooms[roomId]) {
        rooms[roomId][`${role}Ws`] = null;
        rooms[roomId].status = 'disconnected';
      }
    });
  });

  // ── STT endpoint ────────────────────────────────────────────
  const upload = multer({ storage: multer.memoryStorage() });

  app.post('/transcribe-manual', upload.single('audio'), async (req, res) => {
    try {
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: 'audio.webm',
        contentType: 'audio/webm'
      });
      form.append('model', 'saaras:v3');
      form.append('language_code', 'en-IN');

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': process.env.SARVAM_API_KEY,
          ...form.getHeaders()
        },
        body: form
      });

      const result = await response.json();
      res.json({ transcript: result.transcript || '' });
    } catch (err) {
      console.error('STT error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Routes ───────────────────────────────────────────────────
  app.post('/create-manual-room', (req, res) => {
    const roomId = uuidv4();
    rooms[roomId] = {
      customerName: req.body.customerName || 'Customer',
      agentName: req.body.agentName || 'Agent',
      loanAccount: req.body.loanAccount || 'XXXX1234',
      loanAmount: req.body.loanAmount || '50,000',
      agentWs: null,
      customerWs: null,
      status: 'waiting',
      transcript: []
    };

    // For cross-machine testing, use your local IP instead of localhost
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const agentLink = `${baseUrl}/manual-call.html?room=${roomId}&role=agent`;
    const customerLink = `${baseUrl}/customer-manual.html?room=${roomId}&role=customer`;

    console.log(`[WebRTC] Room created: ${roomId}`);
    console.log(`Agent link: ${agentLink}`);
    console.log(`Customer link: ${customerLink}`);

    res.json({ roomId, agentLink, customerLink });
  });

  app.get('/room/:id', (req, res) => {
    const room = rooms[req.params.id];
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({
      status: room.status,
      transcript: room.transcript,
      customerName: room.customerName
    });
  });
}

module.exports = { setupWebRTCSignaling };