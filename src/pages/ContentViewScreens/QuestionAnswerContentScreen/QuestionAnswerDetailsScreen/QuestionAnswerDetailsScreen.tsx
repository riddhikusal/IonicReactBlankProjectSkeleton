import { IonContent, IonPage, IonText, IonButton, IonIcon, IonCard, IonCardContent, IonFooter } from "@ionic/react"
import PadAIBackheader from "../../../../components/Common/Backheader/Backheader"
import PadAIChapterHeader from "../../../../components/ContentView/ChapterHeader/ChapterHeader"
import { useChapterStore } from "../../../../services/store/chapter.store"
import { useState, useEffect } from "react"
import { playCircle, close, chevronBack, chevronForward } from "ionicons/icons"
import { QuestionAnswer } from "../QuestionAnswerContentScreen"
import PadAIVideoPlayer from "../../../../components/ContentView/VideoPlayer/VideoPlayerNew"
import './QuestionAnswerDetailsScreen.css'
import PadAIContentAIPanel from "../../../../components/ContentView/ContentAIPanel/ContentAIPanel"
import { useChatsStore } from "../../../../services/store/chats.store";

const PadAIQuestionAnswerDetailsScreen = () => {
    const setSelectedText = useChatsStore((state: any) => state.setSelectedText);;
    const selectedQuestionAnsList = useChapterStore((state) => state.selectedQuestionAnsList);
    const selectedQuestionIndex = useChapterStore((state) => state.selectedQuestionIndex);
    const setSelectedQuestionIndex = useChapterStore((state) => state.setSelectedQuestionIndex);
    const [showVideo, setShowVideo] = useState(false);

    const currentIndex = selectedQuestionIndex ?? 0;
    const questions = selectedQuestionAnsList || [];
    const currentQuestion: QuestionAnswer | null = questions[currentIndex] || null;

    const handleQuestionSelect = (index: number) => {
        setSelectedQuestionIndex?.(index);
        setShowVideo(false); // Hide video when switching questions
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            handleQuestionSelect(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            handleQuestionSelect(currentIndex + 1);
        }
    };

    // Get question number range for pagination (showing 3 questions before and after)
    const getPaginationRange = () => {
        const total = questions.length;
        const current = currentIndex;
        const rangeSize = 6; // Show 6 tabs as in the screenshot
        const halfRange = Math.floor(rangeSize / 2);

        let start = Math.max(0, current - halfRange);
        let end = Math.min(total - 1, start + rangeSize - 1);

        // Adjust start if we're near the end
        if (end - start < rangeSize - 1) {
            start = Math.max(0, end - rangeSize + 1);
        }

        return { start, end };
    };

    const { start, end } = getPaginationRange();
    const paginationNumbers = [];
    for (let i = start; i <= end && i < questions.length; i++) {
        paginationNumbers.push(i);
    }

    // Extract options if available (assuming they might be in options array or as separate fields)
    const getOptions = (question: QuestionAnswer) => {
        if (question.options && Array.isArray(question.options)) {
            return question.options;
        }
        // Try to extract from question object
        const options: string[] = [];
        if (question.optionA) options.push(`(a) ${question.optionA}`);
        if (question.optionB) options.push(`(b) ${question.optionB}`);
        if (question.optionC) options.push(`(c) ${question.optionC}`);
        if (question.optionD) options.push(`(d) ${question.optionD}`);
        return options;
    };

    // Get correct answer
    const getCorrectAnswer = (question: QuestionAnswer) => {
        if (question.CorrectAnswer) return question.CorrectAnswer;
        return null;
    };

    // Get explanation
    const getExplanation = (question: QuestionAnswer) => {
        if (question.AnswerExplanation) return question.AnswerExplanation;
        return null;
    };

    if (!currentQuestion) {
        return (
            <IonPage>
                <PadAIBackheader />
                <IonContent>
                    <PadAIChapterHeader />
                    <div className="question-details-empty">
                        <IonText>No question selected</IonText>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const options = getOptions(currentQuestion);
    const correctAnswer = getCorrectAnswer(currentQuestion);
    const explanation = getExplanation(currentQuestion);
    const questionText = currentQuestion.question || currentQuestion.Question || '';

    return (
        <IonPage className="question-answer-details-page">
            <PadAIBackheader />
            <IonContent>
                <PadAIChapterHeader />

                {/* Video Player - appears on top when showVideo is true */}
                {showVideo && (currentQuestion.ExplainerVideo) && (
                    <div className="question-video-container">
                        <div className="video-header">
                            <IonText className="video-title">Explainer Video</IonText>
                            <IonButton
                                fill="clear"
                                onClick={() => setShowVideo(false)}
                                className="close-video-btn"
                            >
                                <IonIcon icon={close} />
                            </IonButton>
                        </div>
                        <PadAIVideoPlayer
                            video={{
                                id: currentQuestion.id?.toString() || String(currentIndex),
                                title: questionText,
                                url: currentQuestion.ExplainerVideo || '',
                                thumbnail: currentQuestion.videoThumbnail || currentQuestion.image || '',
                                duration: '',
                                description: questionText,
                                contentType: 'video'
                            }}
                        />
                    </div>
                )}

                {/* Pagination/Quick Jump Tabs */}
                <div className="question-pagination-container">
                    <div className="question-pagination-wrapper">
                        <IonButton
                            fill="clear"
                            className="pagination-nav-button"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            <IonIcon icon={chevronBack} />
                        </IonButton>
                        <div className="question-pagination-tabs">
                            {paginationNumbers.map((num) => (
                                <button
                                    key={num}
                                    className={`pagination-tab ${num === currentIndex ? 'active' : ''}`}
                                    onClick={() => handleQuestionSelect(num)}
                                >
                                    {num + 1}
                                </button>
                            ))}
                        </div>
                        <IonButton
                            fill="clear"
                            className="pagination-nav-button"
                            onClick={handleNext}
                            disabled={currentIndex === questions.length - 1}
                        >
                            <IonIcon icon={chevronForward} />
                        </IonButton>
                    </div>
                </div>

                {/* Question Card */}
                <IonCard className="question-details-card">
                    <IonCardContent>
                        {/* Question Number and Text */}
                        <div className="question-header">
                            <IonText className="question-number-badge">Q{currentIndex + 1}</IonText>
                            <IonText className="question-title">{questionText}</IonText>
                        </div>

                        {/* Options */}
                        {options.length > 0 && (
                            <div className="question-options">
                                {options.map((option, idx) => {
                                    const isCorrect = correctAnswer && option.toLowerCase().includes(correctAnswer.toLowerCase());
                                    return (
                                        <div
                                            key={idx}
                                            className={`option-item ${isCorrect ? 'correct-answer' : ''}`}
                                        >
                                            <IonText>{option}</IonText>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Correct Answer */}
                        {correctAnswer && (
                            <div className="correct-answer-section">
                                <IonText className="correct-answer-label">Correct Answer:</IonText>
                                <IonText className="correct-answer-text">{correctAnswer}</IonText>
                            </div>
                        )}

                        {/* Explanation */}
                        {explanation && (
                            <div className="explanation-section">
                                <div className="explanation-header">
                                    <IonText className="explanation-label">Explanation:</IonText>
                                    {(currentQuestion.ExplainerVideo || currentQuestion.video) && !showVideo && (
                                        <IonButton
                                            fill="outline"
                                            className="explainer-video-button"
                                            onClick={() => setShowVideo(true)}
                                        >
                                            <IonIcon icon={playCircle} slot="start" />
                                            Explainer Video
                                        </IonButton>
                                    )}
                                </div>
                                <IonText className="explanation-text">{explanation}</IonText>
                            </div>
                        )}
                    </IonCardContent>
                </IonCard>

                {/* Interactive Buttons */}
                {/* <div className="interactive-buttons-container">
                    <IonButton fill="outline" className="interactive-button">
                        Explain
                    </IonButton>
                    <IonButton fill="outline" className="interactive-button">
                        Translate
                    </IonButton>
                    <IonButton fill="outline" className="interactive-button">
                        Related
                    </IonButton>
                </div> */}

                <div className="mb-10" style={{ height: '100px' }}></div>
            </IonContent>
            <IonFooter>
                <PadAIContentAIPanel
                showActionsButton={true}
                showAskAiButton={true}
                showAudioButtons={false}
                showSearchButton={false}
                showTranslateButton={false}
                showMicButton={false}
                showDocumentButton={false}
                showColorPaletteButton={false}
                showGlobeButton={false}
                showEllipsisButton={false}
                onpressAskAIButton={() => {
                    setSelectedText(questionText,true);
                }}
                />
            </IonFooter>
        </IonPage>
    )
}

export default PadAIQuestionAnswerDetailsScreen;