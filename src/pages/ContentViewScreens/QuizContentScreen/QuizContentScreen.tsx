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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

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
                        setQuiz(res.data as IQuizQuestion[]);
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
        
        setIsAnswerConfirmed(true);
        const currentQuestion = quiz[currentQuestionIndex];
        
        if (selectedOption === currentQuestion.correctIndex) {
            setScore(score + 1);
            successToaster('Correct Answer!');
        } else {
            dangerToaster('Wrong Answer!');
        }
    }

    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswerConfirmed(false);
        } else {
            // Quiz completed
            const finalScore = score + (selectedOption === quiz[currentQuestionIndex].correctIndex ? 1 : 0);
            successToaster(`Quiz Completed! Your Score: ${finalScore}/${quiz.length}`);
            
            // Delay navigation slightly to allow toast to show
            setTimeout(() => {
                navigate.push('/home');
            }, 500);
        }
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

    if (quiz.length === 0) {
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

    const currentQuestion = quiz[currentQuestionIndex];
    const progress = (currentQuestionIndex + 1) / quiz.length;

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
                <div className="quiz-content-container">
                    <IonCard className="quiz-question-card">
                        <IonCardContent>
                            {/* <h2 className="quiz-question-number">
                                Question {currentQuestionIndex + 1}
                            </h2> */}
                            <p className="quiz-question-text">
                            Question {currentQuestionIndex + 1} : {currentQuestion.question}
                            </p>
                        </IonCardContent>
                    </IonCard>

                    {/* Options Section */}
                    <div className="quiz-options-container">
                        <IonRadioGroup 
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
                                >
                                    <IonRadio 
                                        value={option.optionIndex}
                                        disabled={isAnswerConfirmed}
                                    />
                                    <label className="quiz-option-text">
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
                                color="success"
                                expand="block"
                                size="large"
                            >
                                {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </PadaiButton>
                        )}
                    </div>

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
                </div>
            </IonContent>
        </IonPage>
    )
}

export default PadAIQuizContentScreen;