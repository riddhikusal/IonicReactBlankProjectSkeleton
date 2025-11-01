import  { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { FlashcardData } from '../media';
import './FlashViewer.css';

const PadAIFlashViewer = ({ question, answer, image }: FlashcardData) => {
    const [flipped, setFlipped] = useState<boolean>(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // prevent scrolling when space is pressed
            setFlipped(prev => !prev);
        }
    };

    return (
        <div
            className={`flashcard break-inside-avoid ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(prev => !prev)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
        >
            <div className="card-content">
                {!flipped ? (
                    <div className="front">
                        {/* Question Icon */}
                        <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                        </svg>
                        {image && (
                            <img
                                src={image}
                                alt="illustration"
                                className="card-img"
                            />
                        )}
                        <div
                            className="card-text"
                            dangerouslySetInnerHTML={{ __html: question }}
                        />
                    </div>
                ) : (
                    <div className="back">
                        {/* Answer Icon */}
                        <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <div
                            className="card-answer"
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PadAIFlashViewer;
