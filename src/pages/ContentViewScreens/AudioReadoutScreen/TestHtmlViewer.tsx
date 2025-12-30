import React, { useEffect, useRef, useState } from 'react';
import rawHtml from './data/content.html?raw';
import sentencesData from './data/sentences.json';
import audioUrlSrc from './data/speech.mp3';

type SentenceTiming = {
  start: number; // in ms
  end: number;   // in ms
  text: string;
};

const TestHtmlViewer: React.FC = () => {
  const [sentences, setSentences] = useState<SentenceTiming[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Utility: normalize spaces/quotes
  const normalize = (str: string) =>
    str.replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();

  // Wrap text in spans
  const wrapSentences = (container: HTMLElement, sentenceList: SentenceTiming[]) => {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }

    sentenceList.forEach((sentence, idx) => {
      const normalizedSentence = normalize(sentence.text);
      for (const node of textNodes) {
        if (!node.parentElement || node.parentElement.closest('[data-sentence]')) continue;

        const nodeText = normalize(node.textContent || '');
        const matchIndex = nodeText.indexOf(normalizedSentence);
        if (matchIndex !== -1) {
          const span = document.createElement('span');
          span.setAttribute('data-sentence', idx.toString());
          span.dataset.start = sentence.start.toString();
          span.dataset.end = sentence.end.toString();
          span.textContent = sentence.text;

          span.addEventListener('click', () => {
            if (audioRef.current) {
              audioRef.current.currentTime = sentence.start / 1000;
              audioRef.current.play();
              setCurrentIndex(idx);
              highlightSentence(idx);
            }
          });

          const newNode = node.splitText(matchIndex);
          newNode.splitText(sentence.text.length);
          newNode.parentNode?.replaceChild(span, newNode);
          break;
        }
      }
    });
  };

  // Highlight + scroll
  const highlightSentence = (idx: number) => {
    const spans = contentRef.current?.querySelectorAll('[data-sentence]') || [];
    spans.forEach((span, i) => {
      (span as HTMLElement).classList.toggle('highlighted', i === idx);
      if (i === idx) {
        span.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  // Load JSON + MP3 on mount
  useEffect(() => {
    const loadData = async () => {
      // 🎯 Load data from imported files
      // Sentences data is already imported, extract the array
      const sentenceList = Array.isArray(sentencesData) 
        ? sentencesData 
        : (sentencesData as any).sentences || [];

      setSentences(sentenceList);

      // Inject HTML and wrap sentences
      if (contentRef.current) {
        contentRef.current.innerHTML = rawHtml;
        wrapSentences(contentRef.current, sentenceList);
      }
    };

    loadData();
  }, []);

  // Sync highlight with audio
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || !sentences.length) return;

      const currentTime = audio.currentTime * 1000;
      const idx = sentences.findIndex(
        (s) => currentTime >= s.start && currentTime < s.end
      );

      if (idx !== -1 && idx !== currentIndex) {
        setCurrentIndex(idx);
        highlightSentence(idx);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [sentences, currentIndex]);

  // Handle button click
  const handleShowSelected = () => {
    if (currentIndex !== null && sentences[currentIndex]) {
      alert(sentences[currentIndex].text);
    } else {
      alert("No sentence is currently being read.");
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Segoe UI' , width: '100%'}}>
      <h3>Text-to-Speech Viewer</h3>

      <div className="audio-controls">
        <audio ref={audioRef} controls className="audio-player">
          <source src={audioUrlSrc} type="audio/mpeg" />
        </audio>
        <button className="show-selected" onClick={handleShowSelected}>
          Show Selected Text
        </button>
      </div>
      <div
        ref={contentRef}
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          background: '#f8f8f8',
          maxHeight: '70vh',
          overflowY: 'auto',
          width: '100%',    
          boxSizing: 'border-box', // ✅ include padding/border in width    
        }}
      />

      <style>
        {`
          .highlighted {
            background-color: yellow;
            font-weight: bold;
            transition: background-color 0.3s ease;
            cursor: pointer;
          }
            html, body, #root {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
            .show-selected {
            padding: 0.5rem 1rem;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s ease;
           margin-bottom: 1rem;
           float:right;
          }

          .show-selected:hover {
            background: #005a9e;
          }

        `}
      </style>
    </div>
  );
};

export default TestHtmlViewer;
