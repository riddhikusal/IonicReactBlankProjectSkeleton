import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { FlashcardData } from '../media';
import { IonButton, IonIcon } from '@ionic/react';
import { sparkles } from 'ionicons/icons';
import './FlashViewer.css';

const PadAIFlashViewer = ({ question, answer, image, onSelectedTextClick }: FlashcardData) => {
    const [flipped, setFlipped] = useState<boolean>(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped(prev => !prev);
        }
    };

    const handleAskAIClick = (e: any) => {
        e.stopPropagation(); // Prevent card flip
        onSelectedTextClick(question);
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
                {/* Image Section - Left Side (Always Visible) */}
                {image && (
                    <div className="card-image-section">
                        <IonButton
                                className="ask-ai-button"
                                fill="clear"
                                onClick={handleAskAIClick}
                            >
                                <IonIcon icon={sparkles} />
                                <span>Ask AI</span>
                            </IonButton>
                        <img
                            src={image}
                            alt="illustration"
                            className="card-img"
                        />
                    </div>
                )}
                
                {/* Text Content Section - Right Side (Flips) */}
                <div className="card-text-wrapper">
                    {/* Front Side - Question */}
                    <div className="card-text-section front-text">
                        <div className="question-section-flash" style={{flexDirection:'column !important' as any}}>
                            <div className="question-label">Question</div>
                            <div
                                className="card-question"
                                dangerouslySetInnerHTML={{ __html: question }}
                            />
                            
                        </div>
                    </div>
                    
                    {/* Back Side - Answer */}
                    <div className="card-text-section back-text">
                        <div className="answer-section">
                            <div className="answer-label">Answer</div>
                            <div
                                className="card-answer"
                                dangerouslySetInnerHTML={{ __html: answer }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PadAIFlashViewer;
