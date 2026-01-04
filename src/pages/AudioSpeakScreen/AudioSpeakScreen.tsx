import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);

  const wsRef = useRef(null);
  const chatRef = useRef(null);
  const audioRef = useRef(new Audio());

  const { finalTranscript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  /* ================= INIT ================= */
  useEffect(() => {
    injectCSS();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  /* ================= DICTATION ================= */
  useEffect(() => {
    if (finalTranscript && !playingAudio) {
      setQuery(finalTranscript);
    }
  }, [finalTranscript, playingAudio]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    (chatRef as any).current?.scrollTo({
      top: (chatRef as any).current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, processing]);

  /* ================= ASK ================= */
  const handleAsk = () => {
    if (!query.trim()) return;

    setMessages((m:any) => [...m, { role: "user", text: query }]);
    setQuery("");
    resetTranscript();
    setProcessing(true);

    const ws = new WebSocket("wss://padai.app/services/ws/vectorchat");
    (wsRef as any).current = ws;

    let aiText = "";

    ws.onopen = () => ws.send(JSON.stringify({ text: query }));

    ws.onmessage = (e) => {
      setProcessing(false);
      if (typeof e.data === "string") {
        aiText += e.data.replace("text:", "");
        setMessages((m:any[]) => {
          const last = m[m.length - 1];
          if (last?.role === "ai") {
            return [...m.slice(0, -1), { role: "ai", text: aiText }];
          }
          return [...m, { role: "ai", text: aiText }];
        });
      }
    };

    ws.onclose = () => {
      playTTS();
    };
  };

  /* ================= AUDIO CONTROLS ================= */
  const playTTS = () => {
    audioRef.current.src =
      "https://d1rb72t9cnnyis.cloudfront.net/common/AI+Buddy+Teaching.mp4";
    audioRef.current.play();
    setPlayingAudio(true);
    setAudioPaused(false);

    audioRef.current.onended = () => {
      setPlayingAudio(false);
      setAudioPaused(false);
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    };
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
    setAudioPaused(!audioPaused);
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlayingAudio(false);
    setAudioPaused(false);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  /* ================= EXPLAIN / TRANSLATE / CLEAR ================= */
  const handleExplain = () => {
    if (!query.trim()) return;
    setQuery("Explain: " + query);
  };

  const handleTranslate = () => {
    if (!query.trim()) return;
    setQuery("Translate: " + query);
  };

  const handleClear = () => {
    setQuery("");
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech not supported</p>;
  }

  return (
    <div className="app-shell">
      <div className="chat-card">
        {/* HEADER */}
        <div className="chat-header">PADAI</div>

        {/* SCROLLABLE CONTENT */}
        <div className="chat-body" ref={chatRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${(m as any).role}`}>
              {(m as any).text}
            </div>
          ))}
          {processing && <div className="typing">Thinking…</div>}
        </div>

        {/* EXPLAIN / TRANSLATE / CLEAR BUTTONS */}
        <div className="action-buttons">
          <button className="outline-btn" onClick={handleExplain}>Explain</button>
          <button className="outline-btn" onClick={handleTranslate}>Translate</button>
          <button className="outline-btn" onClick={handleClear}>Clear</button>
        </div>

        {/* FOOTER */}
        <div className="footer">
          {/* MIC */}
          <button
            className={`mic ${listening ? "listening" : ""}`}
            onClick={() =>
              listening
                ? SpeechRecognition.stopListening()
                : SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
            }
          >
            🎤
            {listening && <span className="wave"></span>}
          </button>

          {/* INPUT */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your question..."
            onFocus={() => SpeechRecognition.stopListening()}
          />

          {/* RIGHT BUTTONS */}
          <div className="footer-right">
            <button className="ask" onClick={handleAsk}>➤</button>
            <button className="audio" onClick={toggleAudio}>
              {playingAudio ? (audioPaused ? "▶" : "⏸") : "🔊"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================= CSS ======================= */
function injectCSS() {
  if (document.getElementById("padai-ui")) return;

  const style = document.createElement("style");
  style.id = "padai-ui";
  style.innerHTML = `
    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: #0f172a;
      font-family: system-ui, sans-serif;
    }

    .app-shell {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 12px;
    }

    .chat-card {
      width: 100%;
      max-width: 420px;
      height: 90vh;
      background: #020617;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #1e293b;
    }

    /* HEADER */
    .chat-header {
      height: 56px;
      background: #0ea5e9;
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 1px;
    }

    /* BODY */
    .chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      scrollbar-width: thin;
      scrollbar-color: #0ea5e9 transparent;
    }

    .chat-body::-webkit-scrollbar {
      width: 6px;
    }

    .chat-body::-webkit-scrollbar-thumb {
      background-color: #0ea5e9;
      border-radius: 3px;
    }

    .chat-body::-webkit-scrollbar-track {
      background: transparent;
    }

    .msg {
      max-width: 80%;
      padding: 12px 14px;
      border-radius: 14px;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.4;
    }

    .msg.user {
      margin-left: auto;
      background: #2563eb;
      color: white;
    }

    .msg.ai {
      background: #020617;
      border: 1px solid #1e293b;
      color: #e5e7eb;
    }

    .typing {
      font-size: 13px;
      color: #94a3b8;
    }

    /* ACTION BUTTONS */
    .action-buttons {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      border-top: 1px solid #1e293b;
      gap: 6px;
    }

    .outline-btn {
      flex: 1;
      padding: 8px 0;
      border: 2px solid #22c55e;
      border-radius: 12px;
      background: transparent;
      color: #22c55e;
      font-size: 14px;
      transition: all 0.2s;
    }

    .outline-btn:hover {
      background: #22c55e;
      color: white;
    }

    /* FOOTER */
    .footer {
      display: flex;
      gap: 6px;
      padding: 10px;
      border-top: 1px solid #1e293b;
      align-items: center;
    }

    .footer input {
      flex: 1;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid #1e293b;
      background: #020617;
      color: #e5e7eb;
    }

    /* Group right buttons */
    .footer-right {
      display: flex;
      gap: 6px;
    }

    .mic, .ask, .audio {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: none;
      font-size: 18px;
      position: relative;
    }

    .ask {
      background: transparent;
      color: #22c55e;
      border: 2px solid #22c55e;
      transition: all 0.2s;
    }

    .ask:hover { background: #22c55e; color: white; }
    .ask:active { transform: scale(0.95); }

    .audio { background: #0ea5e9; color: white; }
    .audio.stop { background: #dc2626; }
    .mic.listening { background: #2563eb; }

    /* MIC WAVE */
    .mic .wave {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.4);
      animation: pulse 1.2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 1; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    /* MOBILE RESPONSIVE */
    @media (max-width: 480px) {
      .chat-card { height: 95vh; }
      .msg { font-size: 13px; }
      .footer input { padding: 8px 10px; }
      .mic, .ask, .audio { width: 38px; height: 38px; font-size: 16px; }
      .outline-btn { font-size: 12px; padding: 6px 0; }
    }
  `;
  document.head.appendChild(style);
}
