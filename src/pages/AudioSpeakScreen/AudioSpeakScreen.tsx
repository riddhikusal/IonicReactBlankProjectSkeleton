// import React, { useEffect, useRef, useState } from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// export default function Home() {
//   const [query, setQuery] = useState("");
//   const [messages, setMessages] = useState<any[]>([]);
//   const [processing, setProcessing] = useState(false);
//   const [playingAudio, setPlayingAudio] = useState(false);
//   const [audioPaused, setAudioPaused] = useState(false);

//   const wsRef = useRef(null);
//   const chatRef = useRef(null);
//   const audioRef = useRef(new Audio());

//   const { finalTranscript, listening, resetTranscript, browserSupportsSpeechRecognition } =
//     useSpeechRecognition();

//   /* ================= INIT ================= */
//   useEffect(() => {
//     injectCSS();
//     SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
//     return () => {
//       SpeechRecognition.stopListening();
//     };
//   }, []);

//   /* ================= DICTATION ================= */
//   useEffect(() => {
//     if (finalTranscript && !playingAudio) {
//       setQuery(finalTranscript);
//     }
//   }, [finalTranscript, playingAudio]);

//   /* ================= AUTO SCROLL ================= */
//   useEffect(() => {
//     (chatRef as any).current?.scrollTo({
//       top: (chatRef as any).current.scrollHeight,
//       behavior: "smooth"
//     });
//   }, [messages, processing]);

//   /* ================= ASK ================= */
//   const handleAsk = () => {
//     if (!query.trim()) return;

//     setMessages((m:any) => [...m, { role: "user", text: query }]);
//     setQuery("");
//     resetTranscript();
//     setProcessing(true);

//     const ws = new WebSocket("wss://padai.app/services/ws/vectorchat");
//     (wsRef as any).current = ws;

//     let aiText = "";

//     ws.onopen = () => ws.send(JSON.stringify({ text: query }));

//     ws.onmessage = (e) => {
//       setProcessing(false);
//       if (typeof e.data === "string") {
//         aiText += e.data.replace("text:", "");
//         setMessages((m:any[]) => {
//           const last = m[m.length - 1];
//           if (last?.role === "ai") {
//             return [...m.slice(0, -1), { role: "ai", text: aiText }];
//           }
//           return [...m, { role: "ai", text: aiText }];
//         });
//       }
//     };

//     ws.onclose = () => {
//     //  playTTS();
//     };
//   };

//   /* ================= AUDIO CONTROLS ================= */
//   const playTTS = () => {
//     audioRef.current.src =
//       "https://d1rb72t9cnnyis.cloudfront.net/common/AI+Buddy+Teaching.mp4";
//     audioRef.current.play();
//     setPlayingAudio(true);
//     setAudioPaused(false);

//     audioRef.current.onended = () => {
//       setPlayingAudio(false);
//       setAudioPaused(false);
//       SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
//     };
//   };

//   const toggleAudio = () => {
//     if (!audioRef.current) return;
//     audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
//     setAudioPaused(!audioPaused);
//   };

//   const stopAudio = () => {
//     audioRef.current.pause();
//     audioRef.current.currentTime = 0;
//     setPlayingAudio(false);
//     setAudioPaused(false);
//     SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
//   };

//   /* ================= EXPLAIN / TRANSLATE / CLEAR ================= */
//   const handleExplain = () => {
//     if (!query.trim()) return;
//     setQuery("Explain: " + query);
//   };

//   const handleTranslate = () => {
//     if (!query.trim()) return;
//     setQuery("Translate: " + query);
//   };

//   const handleClear = () => {
//     setQuery("");
//     resetTranscript();
//   };

//   if (!browserSupportsSpeechRecognition) {
//     return <p>Speech not supported</p>;
//   }

//   return (
//     <div className="app-shell">
//       <div className="chat-card">
//         {/* HEADER */}
//         <div className="chat-header">PADAI</div>

//         {/* SCROLLABLE CONTENT */}
//         <div className="chat-body" ref={chatRef}>
//           {messages.map((m, i) => (
//             <div key={i} className={`msg ${(m as any).role}`}>
//               {(m as any).text}
//             </div>
//           ))}
//           {processing && <div className="typing">Thinking…</div>}
//         </div>

//         {/* EXPLAIN / TRANSLATE / CLEAR BUTTONS */}
//         <div className="action-buttons">
//           <button className="outline-btn" onClick={handleExplain}>Explain</button>
//           <button className="outline-btn" onClick={handleTranslate}>Translate</button>
//           <button className="outline-btn" onClick={handleClear}>Clear</button>
//         </div>

//         {/* FOOTER */}
//         <div className="footer">
//           {/* MIC */}
//           <button
//             className={`mic ${listening ? "listening" : ""}`}
//             onClick={() =>
//               listening
//                 ? SpeechRecognition.stopListening()
//                 : SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
//             }
//           >
//             🎤
//             {listening && <span className="wave"></span>}
//           </button>

//           {/* INPUT */}
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Ask your question..."
//             onFocus={() => SpeechRecognition.stopListening()}
//           />

//           {/* RIGHT BUTTONS */}
//           <div className="footer-right">
//             <button className="ask" onClick={handleAsk}>➤</button>
//             <button className="audio" onClick={toggleAudio}>
//               {playingAudio ? (audioPaused ? "▶" : "⏸") : "🔊"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ======================= CSS ======================= */
// function injectCSS() {
//   if (document.getElementById("padai-ui")) return;

//   const style = document.createElement("style");
//   style.id = "padai-ui";
//   style.innerHTML = `
//     * { box-sizing: border-box; }

//     body {
//       margin: 0;
//       background: #0f172a;
//       font-family: system-ui, sans-serif;
//     }

//     .app-shell {
//       min-height: 100vh;
//       display: flex;
//       justify-content: center;
//       padding: 12px;
//     }

//     .chat-card {
//       width: 100%;
//       max-width: 420px;
//       height: 90vh;
//       background: #020617;
//       border-radius: 20px;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//       border: 1px solid #1e293b;
//     }

//     /* HEADER */
//     .chat-header {
//       height: 56px;
//       background: #0ea5e9;
//       color: white;
//       font-weight: 700;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       letter-spacing: 1px;
//     }

//     /* BODY */
//     .chat-body {
//       flex: 1;
//       overflow-y: auto;
//       padding: 14px;
//       scrollbar-width: thin;
//       scrollbar-color: #0ea5e9 transparent;
//     }

//     .chat-body::-webkit-scrollbar {
//       width: 6px;
//     }

//     .chat-body::-webkit-scrollbar-thumb {
//       background-color: #0ea5e9;
//       border-radius: 3px;
//     }

//     .chat-body::-webkit-scrollbar-track {
//       background: transparent;
//     }

//     .msg {
//       max-width: 80%;
//       padding: 12px 14px;
//       border-radius: 14px;
//       margin-bottom: 10px;
//       font-size: 14px;
//       line-height: 1.4;
//     }

//     .msg.user {
//       margin-left: auto;
//       background: #2563eb;
//       color: white;
//     }

//     .msg.ai {
//       background: #020617;
//       border: 1px solid #1e293b;
//       color: #e5e7eb;
//     }

//     .typing {
//       font-size: 13px;
//       color: #94a3b8;
//     }

//     /* ACTION BUTTONS */
//     .action-buttons {
//       display: flex;
//       justify-content: space-between;
//       padding: 6px 10px;
//       border-top: 1px solid #1e293b;
//       gap: 6px;
//     }

//     .outline-btn {
//       flex: 1;
//       padding: 8px 0;
//       border: 2px solid #22c55e;
//       border-radius: 12px;
//       background: transparent;
//       color: #22c55e;
//       font-size: 14px;
//       transition: all 0.2s;
//     }

//     .outline-btn:hover {
//       background: #22c55e;
//       color: white;
//     }

//     /* FOOTER */
//     .footer {
//       display: flex;
//       gap: 6px;
//       padding: 10px;
//       border-top: 1px solid #1e293b;
//       align-items: center;
//     }

//     .footer input {
//       flex: 1;
//       padding: 10px 12px;
//       border-radius: 12px;
//       border: 1px solid #1e293b;
//       background: #020617;
//       color: #e5e7eb;
//     }

//     /* Group right buttons */
//     .footer-right {
//       display: flex;
//       gap: 6px;
//     }

//     .mic, .ask, .audio {
//       width: 42px;
//       height: 42px;
//       border-radius: 50%;
//       border: none;
//       font-size: 18px;
//       position: relative;
//     }

//     .ask {
//       background: transparent;
//       color: #22c55e;
//       border: 2px solid #22c55e;
//       transition: all 0.2s;
//     }

//     .ask:hover { background: #22c55e; color: white; }
//     .ask:active { transform: scale(0.95); }

//     .audio { background: #0ea5e9; color: white; }
//     .audio.stop { background: #dc2626; }
//     .mic.listening { background: #2563eb; }

//     /* MIC WAVE */
//     .mic .wave {
//       position: absolute;
//       inset: -6px;
//       border-radius: 50%;
//       border: 2px solid rgba(255,255,255,0.4);
//       animation: pulse 1.2s infinite;
//     }

//     @keyframes pulse {
//       0% { transform: scale(0.9); opacity: 1; }
//       100% { transform: scale(1.4); opacity: 0; }
//     }

//     /* MOBILE RESPONSIVE */
//     @media (max-width: 480px) {
//       .chat-card { height: 95vh; }
//       .msg { font-size: 13px; }
//       .footer input { padding: 8px 10px; }
//       .mic, .ask, .audio { width: 38px; height: 38px; font-size: 16px; }
//       .outline-btn { font-size: 12px; padding: 6px 0; }
//     }
//   `;
//   document.head.appendChild(style);
// }



import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";


export default function Home() {
  /* ---------------- STATE ---------------- */
  const [query, setQuery] = useState("");
  const [transcript, setTranscript] = useState("");
  const [memoryTranscript, setMemoryTranscript] = useState("");
  const [listeningUI, setListeningUI] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [voice, setVoice] = useState("female");
  const [showLoader, setShowLoader] = useState(false);

  /* ---------------- REFS ---------------- */
  const wsRef = useRef(null);
  const audioRef = useRef(new Audio());
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const transcriptRef = useRef(null);
  const lastFinalRef = useRef("");
  const micEnabledRef = useRef(true);

  /* ---------------- SPEECH ---------------- */
  const {
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    injectCSS();
    startMic();
    return () => stopEverything();
  }, []);

  /* ---------------- AUTO RESTART MIC ---------------- */
  useEffect(() => {
    setListeningUI(listening);

    if (!listening && micEnabledRef.current && !playingAudio) {
      SpeechRecognition.startListening({ continuous: true, language });
      setShowLoader(true);
    }
  }, [listening, playingAudio, language]);

  /* ---------------- APPEND FINAL SPEECH ---------------- */
  useEffect(() => {
    if (!finalTranscript || playingAudio) return;

    const delta = finalTranscript.replace(lastFinalRef.current, "").trim();
    if (!delta) return;

    lastFinalRef.current = finalTranscript;

    setQuery(prev =>
      (prev + " " + delta).replace(/\s+/g, " ").trim()
    );
    setShowLoader(false)
  }, [finalTranscript, playingAudio]);

  /* ---------------- MIC CONTROLS ---------------- */
  const startMic = () => {
    micEnabledRef.current = true;
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const stopMic = () => {
    micEnabledRef.current = false;
    SpeechRecognition.stopListening();
  };

  /* ---------------- ASK ---------------- */
  const handleAsk = () => {
    if (!query.trim()) return;

    stopMic();
    setProcessing(true);
    setTranscript("");
    setMemoryTranscript("");
    setShowLoader(true);  
    lastFinalRef.current = "";

    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    audioRef.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", () => {
      sourceBufferRef.current =
        mediaSource.addSourceBuffer("audio/mpeg");
    });

    const ws = new WebSocket("wss://padai.app/services/ws/vectorchat");
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ text: query + "" + memoryTranscript, language, voice }));
    };

    ws.onmessage = (event) => {
      setProcessing(false);

      if (typeof event.data === "string") {
        const textChunk = event.data.replace("text:", "");

        setTranscript(prev => prev + textChunk);

        // ✅ persistent transcript (never cleared)
        setMemoryTranscript(prev => prev + textChunk);

      } else {
        appendAudio(event.data);
      }
    };

    ws.onclose = () => {
      audioRef.current.play().catch(() => { });
      setPlayingAudio(true);
      setShowLoader(false); 

      audioRef.current.onended = () => {
        setPlayingAudio(false);
        resetTranscript();
        startMic();
      };
    };
  };

  /* ---------------- AUDIO ---------------- */
  const appendAudio = (data) => {
    if (!sourceBufferRef.current) return;

    const append = () => {
      if (sourceBufferRef.current.updating) {
        setTimeout(append, 25);
      } else {
        sourceBufferRef.current.appendBuffer(new Uint8Array(data));
      }
    };
    append();
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.paused
      ? audioRef.current.play()
      : audioRef.current.pause();

    setAudioPaused(!audioPaused);
  };

  /* ---------------- CLEAR ---------------- */
  const handleClear = () => {
    setQuery("");
    setTranscript("");
    resetTranscript();
    lastFinalRef.current = "";
    wsRef.current?.close();
    audioRef.current.pause();
    setPlayingAudio(false);
    setProcessing(false);

    // ✅ AUTO-RESUME MIC AFTER CLEAR
    startMic();
  };

  const stopEverything = () => {
    stopMic();
    wsRef.current?.close();
    audioRef.current.pause();
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech recognition not supported.</p>;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="ai-dark-wrapper">
    <div className="ai-chat-root">
      <h2 className="ai-title">AI Voice Assistant</h2>

      <div className="ai-selects">
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en-IN">English (India)</option>
          <option value="hi-IN">Hindi</option>
          <option value="ta-IN">Tamil</option>
          <option value="te-IN">Telugu</option>
          <option value="bn-IN">Bengali</option>
        </select>

        <select value={voice} onChange={e => setVoice(e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
 {(processing) && <div className="loader"></div>}
      <textarea
        className="ai-textarea"
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Speak or type your question…"
      />

      <div className="ai-controls">
        <button className="btn primary">
          🎤 {listeningUI ? "Listening…" : "Mic Paused"}
        </button>

        <button className="btn success" onClick={handleAsk}>
          ▶ Ask
        </button>

        <button className="btn ghost" onClick={toggleAudio}>
          {audioPaused ? "▶ Resume" : "⏸ Pause"}
        </button>

        <button className="btn danger" onClick={handleClear}>
          🧹 Clear
        </button>
      </div>

     

      {playingAudio && (
        <video
         src='https://d1rb72t9cnnyis.cloudfront.net/common/AI+Buddy+Teaching.mp4'
          autoPlay
          muted
          loop
          className="ai-video"
        />
      )}

      <div className="ai-transcript" ref={transcriptRef}>
        {transcript || "Response will appear here…"}
      </div>
    </div>
    </div>
  );
}

/* ---------------- CSS ---------------- */
function injectCSS() {
  if (document.getElementById("ai-css")) return;

  const style = document.createElement("style");
  style.id = "ai-css";
  style.innerHTML = `

  /* FULL PAGE BLOCK BACKGROUND */
.ai-dark-wrapper {
  background: #ffffff;                 /* PURE white */
  min-height: 80vh;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* MAIN 3D CONTAINER */
.ai-chat-root {
  background: linear-gradient(
    180deg,
    #020617 0%,
    #000000 100%
  );
  border-radius: 18px;
  padding: 24px;
  max-width: 1000px;
  width: 100%;
  color: #e5e7eb;

  /* 3D EFFECT */
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);

  border: 1px solid #0f172a;
  backdrop-filter: blur(8px);
}

/* TITLE */
.ai-title {
  text-align: center;
  margin-bottom: 18px;
  font-size: 1.4rem;
  font-weight: 700;
}

/* SELECTS */
.ai-selects {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.ai-selects select {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  background: #020617;
  color: #e5e7eb;
  border: 1px solid #1e293b;
}

/* TEXTAREA */
.ai-textarea {
  width: 100%;
  padding: 14px;
  background: #020617;
  border-radius: 14px;
  border: 1px solid #1e293b;
  color: white;
  resize: none;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
}

/* CONTROLS */
.ai-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 18px 0;
}

/* BUTTON BASE */
.btn {
  padding: 12px 18px;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  transform-style: preserve-3d;
}

.btn:hover {
  transform: translateY(-2px);
}

/* BUTTON VARIANTS */
.primary {
  background: #0284c7;
  color: white;
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.4);
}

.success {
  background: #22c55e;
  color: #022c22;
  box-shadow: 0 6px 18px rgba(34, 197, 94, 0.4);
}

.ghost {
  background: #020617;
  border: 1px solid #1e293b;
  color: white;
}

.danger {
  background: #dc2626;
  color: white;
  box-shadow: 0 6px 18px rgba(220, 38, 38, 0.4);
}

/* TRANSCRIPT BOX */
.ai-transcript {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 16px;
  min-height: 220px;
  white-space: pre-wrap;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
}

/* RESPONSIVE */
@media (max-width: 640px) {
  .ai-controls {
    flex-direction: column;
  }
}
.ai-video {
  width: 180px;
  height: 180px;
/* IMPORTANT */
  background: radial-gradient(
    circle,
    rgba(0,153,255,0.45),
    rgba(0,0,0,0.95)
  );

  border-radius: 50%;
  object-fit: cover;

  margin: 16px auto;
  display: block;

  box-shadow:
    0 0 30px rgba(0, 153, 255, 0.35),
    inset 0 0 20px rgba(255, 255, 255, 0.05);

  animation: pulseGlow 2.5s ease-in-out infinite;
}

/* Glow animation */
@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 18px rgba(0, 153, 255, 0.25);
  }
  50% {
    box-shadow: 0 0 42px rgba(0, 153, 255, 0.55);
  }
  100% {
    box-shadow: 0 0 18px rgba(0, 153, 255, 0.25);
  }
}

`;
  document.head.appendChild(style);
}
