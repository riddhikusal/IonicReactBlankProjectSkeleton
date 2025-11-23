import { IonPage, IonContent, useIonRouter, IonProgressBar, IonRadioGroup, IonRadio, IonSpinner, IonCard, IonCardContent } from "@ionic/react";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import { useChapterStore } from "../../../services/store/chapter.store";
import { useEffect, useState } from "react";
import { IGetChapterQuizRequest, IQuizQuestion } from "../../../api/contentApi/contentApi.interface";
import { GetQuiz } from "../../../services/homeService";
import { useToaster } from "../../../hooks/toasterHooks/useToaster";
import PadaiButton from "../../../components/Common/Buttons/Button";
import './QuizContentScreen.css';

const PadAIQuizContentScreen = () => {
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const { dangerToaster, successToaster } = useToaster();
    const navigate = useIonRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<IQuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<IQuizQuestion | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        const getChapterQuiz = async () => {
            try {
                if (!isMounted) return;
                setLoading(true);
                
                if (chapterInfo.chapterId) {
                    let data: IGetChapterQuizRequest = {
                        chapterId: Number(chapterInfo.chapterId),
                        language: 'en'
                    }
                    const res = await GetQuiz(data);
                    
                    if (!isMounted) return;
                    
                    if (res.responseStatus === 'DATA_FOUND') {
                        const quizData = res.data as IQuizQuestion[];
                        setQuiz(quizData);
                        setCurrentQuestion(quizData[0]);
                        setProgress(1 / quizData.length);
                    } else {
                        setQuiz([]);
                        dangerToaster(res.message);
                        setTimeout(() => {
                            if (isMounted) {
                                navigate.push('/home');
                            }
                        }, 1000);
                    }
                } else {
                    if (!isMounted) return;
                    setQuiz([]);
                    dangerToaster('Chapter ID not found. Please try again.');
                    console.error('ChapterId is null or undefined');
                }
            } catch (error) {
                console.error('Error fetching chapter quiz:', error);
                if (!isMounted) return;
                setQuiz([]);
                dangerToaster('Failed to load chapter quiz');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        getChapterQuiz();

        return () => {
            isMounted = false;
        };
    }, [chapterInfo.chapterId]);

    const handleConfirm = () => {
        if (selectedOption === null) {
            dangerToaster('Please select an option');
            return;
        }
        
        if (!currentQuestion) return;
        
        setIsAnswerConfirmed(true);
        
        if (selectedOption === currentQuestion.correctIndex) {
            setScore(prevScore => prevScore + 1);
            // successToaster('Correct Answer!');
        } else {
            // dangerToaster('Wrong Answer!');
        }
    }

    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            
            // Use requestAnimationFrame to defer state updates
            requestAnimationFrame(() => {
                setCurrentQuestionIndex(nextIndex);
                setCurrentQuestion(quiz[nextIndex]);
                setProgress((nextIndex + 1) / quiz.length);
                setSelectedOption(null);
                setIsAnswerConfirmed(false);
            });
        } else {
            // Quiz completed - show celebration UI
            setIsQuizCompleted(true);
        }
    }

    const resetQuizState = () => {
        // Clear all quiz state to start fresh
        setQuiz([]);
        setCurrentQuestion(null);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswerConfirmed(false);
        setScore(0);
        setProgress(0);
        setIsQuizCompleted(false);
    }

    const handleGoBack = () => {
        resetQuizState();
        navigate.goBack();
    }

    if (loading) {
        return (
            <IonPage className='padAIquizContentScreen-page'>
                <PadAIBackheader />
                <IonContent>
                    <PadAIChapterHeader />
                    <div className="quiz-loading">
                        <IonSpinner name="crescent" />
                        <p>Loading Quiz...</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (quiz.length === 0 || !currentQuestion) {
        return (
            <IonPage className='padAIquizContentScreen-page'>
                <PadAIBackheader />
                <IonContent>
                    <PadAIChapterHeader />
                    <div className="quiz-empty">
                        <p>No quiz questions available</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    // Quiz Completion Celebration Screen
    if (isQuizCompleted) {
        const percentage = Math.round((score / quiz.length) * 100);
        const isPerfect = score === quiz.length;
        const isGood = percentage >= 70;
        
        return (
            <IonPage className='padAIquizContentScreen-page'>
                <PadAIBackheader />
                <IonContent>
                    {/* <PadAIChapterHeader /> */}
                    <div className="quiz-completion-container">
                        <div className="celebration-wrapper">
                            {/* Confetti Animation */}
                            <div className="confetti-container">
                                {[...Array(50)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`confetti confetti-${i % 5}`}
                                        style={{
                                            left: `${(i * 2) % 100}%`,
                                            animationDelay: `${(i * 0.1) % 2}s`,
                                            animationDuration: `${3 + (i % 3)}s`
                                        }}
                                    ></div>
                                ))}
                            </div>
                            
                            {/* Celebration Icon */}
                            <div className="celebration-icon">
                                {isPerfect ? '🎉' : isGood ? '🎊' : '✨'}
                            </div>
                            
                            {/* Title */}
                            <h1 className="completion-title">
                                {isPerfect ? 'Perfect Score!' : isGood ? 'Great Job!' : 'Quiz Completed!'}
                            </h1>
                            
                            {/* Score Display */}
                            <div className="score-display">
                                <div className="score-circle">
                                    <div className="score-number">{score}</div>
                                    <div className="score-total">/{quiz.length}</div>
                                </div>
                                <div className="score-percentage">{percentage}%</div>
                            </div>
                            
                            {/* Performance Message */}
                            <p className="performance-message">
                                {isPerfect 
                                    ? 'Outstanding! You got all questions correct!' 
                                    : isGood 
                                    ? 'Well done! You scored above average!' 
                                    : 'Good effort! Keep practicing to improve!'}
                            </p>
                            
                            {/* Go Back Button */}
                            <div className="completion-actions">
                                <PadaiButton
                                    onClick={handleGoBack}
                                    color="primary"
                                    expand="block"
                                    size="large"
                                >
                                    Go Back
                                </PadaiButton>
                            </div>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage className='padAIquizContentScreen-page'>
            <PadAIBackheader />
            <IonContent>
                <PadAIChapterHeader />
                
                {/* Progress Bar Section */}
                <div className="quiz-progress-container">
                    <div className="quiz-progress-info">
                        <span className="quiz-progress-text">
                            Question {currentQuestionIndex + 1} of {quiz.length}
                        </span>
                        <span className="quiz-score">
                            Score: {score}/{quiz.length}
                        </span>
                    </div>
                    <IonProgressBar 
                        value={progress} 
                        className="quiz-progress-bar"
                    />
                </div>

                {/* Question Section */}
                <div className="quiz-content-container" key={`quiz-container-${currentQuestion.questionId}`}>
                    <IonCard className="quiz-question-card">
                        <IonCardContent>
                            {/* <h2 className="quiz-question-number">
                                Question {currentQuestionIndex + 1}
                            </h2> */}
                            <p className="quiz-question-text"> {currentQuestion.question}
                            </p>
                        </IonCardContent>
                    </IonCard>

                      {/* Description Section */}
                      {isAnswerConfirmed && (
                        <IonCard className="quiz-description-card">
                            <IonCardContent>
                                <h3 className="quiz-description-title">Explanation</h3>
                                <p className="quiz-description-text">
                                    {currentQuestion.description}
                                </p>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Options Section */}
                    <div className="quiz-options-container" key={`question-${currentQuestion.questionId}`}>
                        <IonRadioGroup 
                            key={currentQuestion.questionId}
                            value={selectedOption} 
                            onIonChange={(e) => !isAnswerConfirmed && setSelectedOption(e.detail.value)}
                        >
                            {currentQuestion.options.map((option) => (
                                <div 
                                    key={option.optionId}
                                    className={`quiz-option ${
                                        isAnswerConfirmed && option.optionIndex === currentQuestion.correctIndex 
                                            ? 'correct-option' 
                                            : isAnswerConfirmed && selectedOption === option.optionIndex 
                                            ? 'wrong-option' 
                                            : ''
                                    }`}
                                    onClick={() => !isAnswerConfirmed && setSelectedOption(option.optionIndex)}
                                >
                                    <IonRadio 
                                        id={`radio-${option.optionId}`}
                                        value={option.optionIndex}
                                        disabled={isAnswerConfirmed}
                                    />
                                    <label 
                                        htmlFor={`radio-${option.optionId}`}
                                        className="quiz-option-text"
                                    >
                                        {option.optionText}
                                    </label>
                                </div>
                            ))}
                        </IonRadioGroup>
                    </div>

                    {/* Action Buttons */}
                    <div className="quiz-action-buttons">
                        {!isAnswerConfirmed ? (
                            <PadaiButton
                                onClick={handleConfirm}
                                color="primary"
                                expand="block"
                                size="large"
                            >
                                Confirm Answer
                            </PadaiButton>
                        ) : (
                            <PadaiButton
                                onClick={handleNext}
                                color="primary"
                                expand="block"
                                size="large"
                            >
                                {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </PadaiButton>
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default PadAIQuizContentScreen;