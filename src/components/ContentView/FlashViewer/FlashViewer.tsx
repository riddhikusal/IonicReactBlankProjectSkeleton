import  { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { FlashcardData } from '../media';

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
                        {image && (
                            <img
                                src={image}
                                alt="illustration"
                                className="card-img"
                                width={100}
                                height={100}
                            />
                        )}
                        <div
                            className="card-text line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: question }}
                        />
                    </div>
                ) : (
                    <div className="back">
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
