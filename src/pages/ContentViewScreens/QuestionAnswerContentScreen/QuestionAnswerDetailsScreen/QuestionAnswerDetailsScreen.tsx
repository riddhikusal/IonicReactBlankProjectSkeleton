import { IonContent, IonPage, IonText, IonButton, IonIcon, IonCard, IonCardContent, IonFooter, useIonRouter, IonToggle, IonHeader, IonModal } from "@ionic/react"
import PadAIBackheader from "../../../../components/Common/Backheader/Backheader"
import PadAIChapterHeader from "../../../../components/ContentView/ChapterHeader/ChapterHeader"
import { useChapterStore } from "../../../../services/store/chapter.store"
import { useState, useEffect, useRef } from "react"
import { playCircle, close, listOutline, arrowBack, arrowForward, arrowUp, arrowDown, chevronDown, chevronUp } from "ionicons/icons"
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
    const [toggleValue, setToggleValue] = useState(false);
    const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigate = useIonRouter();
    const paginationScrollRef = useRef<HTMLDivElement>(null);

    const currentIndex = selectedQuestionIndex ?? 0;
    const questions = selectedQuestionAnsList || [];
    const currentQuestion: QuestionAnswer | null = questions[currentIndex] || null;

    const handleQuestionSelect = (index: number) => {
        setSelectedQuestionIndex?.(index);
        setShowVideo(false); // Hide video when switching questions
        setIsExplanationExpanded(false); // Reset explanation to collapsed state
    };

    const handleBackToList = () => {
        navigate.goBack();
    };

    // Scroll to active question in pagination and center it
    useEffect(() => {
        const scrollToActiveTab = () => {
            if (paginationScrollRef.current) {
                const activeTab = paginationScrollRef.current.querySelector(`.pagination-tab.active`) as HTMLElement;
                if (activeTab && paginationScrollRef.current) {
                    const container = paginationScrollRef.current;
                    const containerWidth = container.offsetWidth;
                    const tabLeft = activeTab.offsetLeft;
                    const tabWidth = activeTab.offsetWidth;
                    
                    // Calculate the scroll position to center the tab
                    const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
                    
                    container.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            }
        };

        // Use requestAnimationFrame and setTimeout to ensure DOM is ready
        requestAnimationFrame(() => {
            setTimeout(scrollToActiveTab, 100);
        });
    }, [currentIndex]);

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

    // get image
    const getImageUrl = (contentFor:'question' | 'shortAnswer' | 'longAnswer'):string=>{
        const baseUrl = "https://d1rb72t9cnnyis.cloudfront.net/";
        if(contentFor === 'question'){
            return currentQuestion?.QuestionImage ? `${baseUrl}${currentQuestion.QuestionImage}` : '';
        }else if(contentFor === 'shortAnswer'){
            return currentQuestion?.ShortAnswerImage ? `${baseUrl}${currentQuestion.ShortAnswerImage}` : '';
        }else if(contentFor === 'longAnswer'){
            return currentQuestion?.LongAnswerImage ? `${baseUrl}${currentQuestion.LongAnswerImage}` : '';
        }
        return '';
    }
    // get Video Url
    const getVideoUrl = (url:string | undefined):string=>{
        const baseUrl = "https://d1rb72t9cnnyis.cloudfront.net/";
        if(!url) return '';
        return `${baseUrl}${url}`;
    }

    // Check if image exists
    const hasImage = (contentFor:'question' | 'shortAnswer' | 'longAnswer'):boolean=>{
        if (!currentQuestion) return false;
        if(contentFor === 'question'){
            return !!(currentQuestion.QuestionImage && currentQuestion.QuestionImage.trim() !== '');
        }else if(contentFor === 'shortAnswer'){
            return !!(currentQuestion.ShortAnswerImage && currentQuestion.ShortAnswerImage.trim() !== '');
        }else if(contentFor === 'longAnswer'){
            return !!(currentQuestion.LongAnswerImage && currentQuestion.LongAnswerImage.trim() !== '');
        }
        return false;
    }

    // Handle image click to open modal
    const handleImageClick = (contentFor:'question' | 'shortAnswer' | 'longAnswer') => {
        const imageUrl = getImageUrl(contentFor);
        if (imageUrl) {
            setSelectedImage(imageUrl);
        }
    }
    // Get correct answer
    const getCorrectAnswer = (question: QuestionAnswer) => {
        if (question.ShortAnswer) return question.ShortAnswer;
        return null;
    };

    // Get explanation
    const getExplanation = (question: QuestionAnswer) => {
        if (question.LongAnswer) return question.LongAnswer;
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
            {/* <PadAIBackheader /> */}
            <IonHeader>
                    {toggleValue && (
                        <div className="question-details-header">
                            <PadAIChapterHeader />
                        </div>
                    )}



                    {/* Navigation and Pagination Section */}
                    <div className="question-navigation-pagination-wrapper">
                        {/* Navigation and Toggle Section */}
                        <div className="question-navigation-container">
                            <IonButton
                                fill="clear"
                                className="pagination-list-button"
                                onClick={handleBackToList}
                            >
                                <IonIcon icon={listOutline} />
                            </IonButton>
                            {/* <IonButton
                            fill="clear"
                            className="pagination-list-button"
                            onClick={() => setToggleValue(!toggleValue)}
                        >
                            <IonIcon icon={toggleValue ? arrowUp : arrowDown} />
                        </IonButton> */}
                        </div>

                        {/* Pagination/Quick Jump Tabs - Ribbon Style */}
                        <div className="question-pagination-container">
                            <div className="question-pagination-tabs" ref={paginationScrollRef}>
                                {questions.map((_, num) => (
                                    <button
                                        key={num}
                                        className={`pagination-tab ${num === currentIndex ? 'active' : ''}`}
                                        onClick={() => handleQuestionSelect(num)}
                                    >
                                        {num + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Video Player - appears on top when showVideo is true */}
                    {showVideo && (currentQuestion.ExplainerVideo) && (
                        <div className="question-video-container">
                            <div className="video-header">
                                <IonText className="video-title">Explainer Video</IonText>
                                <IonButton
                                    fill="clear"
                                    onClick={() => setShowVideo(false)}
                                    className="close-video-btn"
                                    color={'light'}
                                >
                                    <IonIcon icon={close} />
                                </IonButton>
                            </div>
                            <PadAIVideoPlayer
                                video={{
                                    id: currentQuestion.id?.toString() || String(currentIndex),
                                    title: questionText,
                                    url: getVideoUrl(currentQuestion.ExplainerVideo) || '',
                                    thumbnail: currentQuestion.videoThumbnail || currentQuestion.image || '',
                                    duration: '',
                                    description: questionText,
                                    contentType: 'video'
                                }}
                            />
                        </div>
                    )}

                </IonHeader>
            <IonContent>
             

                {/* Question Card */}
                <IonCard className="question-details-card">
                    <IonCardContent>
                        {/* Question Number and Text */}
                        <div className="question-header">
                            <IonText className="question-number-badge">Q{currentIndex + 1}</IonText>
                            <IonText className="question-title">{questionText}</IonText>
                        </div>

                        {/* Question Image */}
                        {hasImage('question') && (
                            <div className="question-image-container">
                                <img 
                                    src={getImageUrl('question')} 
                                    alt="Question" 
                                    className="question-image"
                                    onClick={() => handleImageClick('question')}
                                />
                            </div>
                        )}

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
                                {/* Short Answer Image */}
                                {hasImage('shortAnswer') && (
                                    <div className="answer-image-container">
                                        <img 
                                            src={getImageUrl('shortAnswer')} 
                                            alt="Correct Answer" 
                                            className="answer-image"
                                            onClick={() => handleImageClick('shortAnswer')}
                                        />
                                    </div>
                                )}
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
                                <div className="explanation-content-wrapper">
                                    <IonText
                                        className={`explanation-text ${!isExplanationExpanded ? 'explanation-text-collapsed' : ''}`}
                                    >
                                        {explanation}
                                    </IonText>
                                    {/* Long Answer Image - Only show when expanded */}
                                    {isExplanationExpanded && hasImage('longAnswer') && (
                                        <div className="explanation-image-container">
                                            <img 
                                                src={getImageUrl('longAnswer')} 
                                                alt="Explanation" 
                                                className="explanation-image"
                                                onClick={() => handleImageClick('longAnswer')}
                                            />
                                        </div>
                                    )}
                                    <IonButton
                                        fill="clear"
                                        className="read-more-button"
                                        onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
                                    >
                                        <IonText className="read-more-text">
                                            {isExplanationExpanded ? 'View Less' : 'Read More'}
                                        </IonText>
                                        <IonIcon icon={isExplanationExpanded ? chevronUp : chevronDown} />
                                    </IonButton>
                                </div>
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

            {/* Full Screen Image Modal */}
            <IonModal 
                isOpen={!!selectedImage} 
                onDidDismiss={() => setSelectedImage(null)}
                className="image-modal"
            >
                <div className="image-modal-container">
                    <div className="image-modal-header">
                        <IonButton
                            fill="clear"
                            onClick={() => setSelectedImage(null)}
                            className="close-image-btn"
                        >
                            <IonIcon icon={close} />
                        </IonButton>
                    </div>
                    {selectedImage && (
                        <div className="image-modal-content">
                            <img 
                                src={selectedImage} 
                                alt="Full screen" 
                                className="full-screen-image"
                            />
                        </div>
                    )}
                </div>
            </IonModal>

            <div className="footer-gradient-wrapper">
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
                        setSelectedText(questionText, true);
                    }}
                />
            </div>
        </IonPage>
    )
}

export default PadAIQuestionAnswerDetailsScreen;