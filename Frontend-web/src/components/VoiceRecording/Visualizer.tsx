import { useEffect, useRef, useState } from 'react';

const MIN_DECIBELS = -60;
const MAX_DECIBELS = -10;

const Visualizer = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const socketRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState('');

    // Setup Socket.IO connection
    useEffect(() => {
        // For environments where socket.io-client is available globally
        const ioFn = (window as any).io;
        if (ioFn) {
            socketRef.current = ioFn('http://localhost:3001');
            socketRef.current.on('connect', () => {
                console.log('Connected to WebSocket server');
            });
        }

        return () => {
            if (socketRef.current && typeof socketRef.current.disconnect === 'function') {
                socketRef.current.disconnect();
            }
            stopRecording();
        };
    }, []);

    const drawVisualizer = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            // Background (#070807)
            ctx.fillStyle = '#070807';
            ctx.fillRect(0, 0, width, height);

            const barWidth = 6;
            const barSpacing = 4;
            const numBars = Math.floor(width / (barWidth + barSpacing));

            const step = Math.max(1, Math.floor((bufferLength * 0.75) / numBars)); // skip very high freqs
            const centerX = width / 2;
            const centerY = height / 2;

            // Color amber-500
            ctx.fillStyle = '#10b981';

            for (let i = 0; i < numBars; i++) {
                const displayOffset = i - Math.floor(numBars / 2);
                const x = centerX + displayOffset * (barWidth + barSpacing);

                const freqIndex = Math.min(bufferLength - 1, Math.abs(displayOffset) * step);
                let sum = 0;
                let count = 0;
                for (let j = 0; j < step; j++) {
                    const val = dataArray[freqIndex + j];
                    if (val !== undefined) {
                        sum += val;
                        count++;
                    }
                }

                const amplitude = count > 0 ? sum / count : 0;
                let percentage = Math.pow(amplitude / 255, 1.5);

                const maxSegments = 24;
                const activeSegments = Math.max(1, Math.floor(percentage * maxSegments));

                const segmentHeight = 3;
                const segmentSpacing = 4;

                for (let s = 0; s < activeSegments; s++) {
                    const offset = s * (segmentHeight + segmentSpacing);
                    // Top segment
                    ctx.fillRect(x, centerY - offset - segmentHeight, barWidth, segmentHeight);
                    // Bottom segment
                    ctx.fillRect(x, centerY + offset, barWidth, segmentHeight);
                }
            }
        };

        draw();
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            streamRef.current = stream;

            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();
            analyserRef.current = audioContextRef.current!.createAnalyser();

            analyserRef.current.minDecibels = MIN_DECIBELS;
            analyserRef.current.maxDecibels = MAX_DECIBELS;
            analyserRef.current.smoothingTimeConstant = 0.8;
            analyserRef.current.fftSize = 512;

            sourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);

            drawVisualizer();

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data && event.data.size > 0 && socketRef.current) {
                    socketRef.current.emit('audio-chunk', event.data);
                }
            };
            // Emits an 'audio-chunk' every 500ms
            mediaRecorderRef.current.start(500);

            setIsRecording(true);
            setError('');
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#070807';
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }

        setIsRecording(false);
    };

    return (<>
        <div className="flex flex-col items-center justify-center p-4 gap-4">
            <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className="w-full h-auto rounded-lg bg-[#070807]"
            />
            {!isRecording && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-gray-600 font-mono tracking-widest text-sm uppercase">Standing By</span>
                </div>
            )}
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className="h-fit w-fit p-4 m-4 bg-white text-2xl font-semibold rounded-2xl"
                style={{ fontFamily: "Syne" }}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}

            </button>
        </div>

    </>
    );
};
export default Visualizer;
