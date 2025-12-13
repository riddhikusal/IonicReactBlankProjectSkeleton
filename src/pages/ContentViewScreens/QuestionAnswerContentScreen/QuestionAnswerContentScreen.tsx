import { IonFooter, IonPage, IonCard, IonCardContent, IonText, IonSkeletonText, IonRow, IonCol, IonButton, IonIcon, useIonRouter } from "@ionic/react";
import { IonContent } from "@ionic/react";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";
import { useChapterStore } from "../../../services/store/chapter.store";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import './QuestionAnswerContentScreen.css';
import { arrowForwardSharp } from "ionicons/icons";

export interface QuestionAnswer {
    // id?: string | number;
    // questionId?: number;
    // question: string;
    AnswerExplanation?:string;
    CorrectAnswer?:string;
    ExplainerVideo?:string;
    ImagePrompt?:string;
    Question?:string;
    QuestionNo?:number;
    TeacherNarration?:string;
    // answer?: string;
    // description?: string;
    // content?: string;
    [key: string]: any; // Allow for additional properties
}

const PadAIQuestionAnswerContentScreen = () => {
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const selectedChapterResources = useChapterStore((state) => state.selectedChapterResources);
    const setSelectedQuestionAnsList = useChapterStore((state) => state.setSelectedQuestionAnsList);
    const setSelectedQuestionIndex = useChapterStore((state) => state.setSelectedQuestionIndex);
    const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedId, setExpandedId] = useState<string | number | null>(null);
    const navigate = useIonRouter();
    const history = useHistory();

    const navigateToDetailsScreen = (index: number) => {
        setSelectedQuestionAnsList?.(questionAnswers);
        setSelectedQuestionIndex?.(index);
        navigate.push(`/question-answer-details`, 'forward');

        // history.push(`/question-answer-details`, {
        //     allQuestions: questionAnswers,
        //     selectedQuestion: questionAnswers[index],
        // });
}

useEffect(() => {
    if (selectedChapterResources?.url) {
        setLoading(true);
        fetch(selectedChapterResources?.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch question answer content');
                }
                return response.json();
            })
            .then(data => {
                console.log('Question Answer JSON data:', data);
                // Handle different JSON structures
                let questions: QuestionAnswer[] = [];

                if (Array.isArray(data)) {
                    // If data is directly an array
                    questions = data;
                } else if (data.questions && Array.isArray(data.questions)) {
                    // If data has a 'questions' property
                    questions = data.questions;
                } else if (data.data && Array.isArray(data.data)) {
                    // If data has a 'data' property
                    questions = data.data;
                } else {
                    // Try to convert object to array if it's a single object
                    questions = [data];
                }

                setQuestionAnswers(questions);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching question answer content:', error);
                setLoading(false);
            });
    } else {
        setLoading(false);
    }
}, [selectedChapterResources]);

const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
};

return (
    <IonPage className='padAIvideoContentScreen-page'>
        <PadAIBackheader />
        <IonContent>
            <PadAIChapterHeader />

            {loading ? (
                <div className="question-answer-loading">
                    {[1, 2, 3].map((index) => (
                        <IonCard key={index} className="question-answer-card">
                            <IonCardContent>
                                <IonSkeletonText animated={true} style={{ width: '100%', height: '20px', marginBottom: '10px' }} />
                                <IonSkeletonText animated={true} style={{ width: '80%', height: '20px' }} />
                            </IonCardContent>
                        </IonCard>
                    ))}
                </div>
            ) : questionAnswers.length > 0 ? (
                <div className="question-answer-container">
                    {questionAnswers.map((qa, index) => {
                        const qaId = qa.id || qa.questionId || index;
                        const isExpanded = expandedId === qaId;
                        //   const answerText = qa.answer || qa.description || qa.content || '';

                        return (
                            <IonCard
                                key={qaId}

                                className={`question-answer-card ${isExpanded ? 'expanded' : ''} ${index %2 ==0?'greyBg':'whiteBg'}`}
                                onClick={() => navigateToDetailsScreen(index)}
                            >
                                <IonCardContent>
                                    <div className="question-section">
                                        <IonText className="question-number">Q{index + 1}</IonText>
                                        <div className="question-text-wrapper">
                                            <IonText className="question-text">
                                                {qa.Question}
                                            </IonText>
                                            <IonText className="question-answer-read-more">Read more</IonText>
                                        </div>
                                    </div>



                                </IonCardContent>
                            </IonCard>
                        );
                    })}
                </div>
            ) : (
                <div className="question-answer-empty">
                    <IonText>No question answers available</IonText>
                </div>
            )}

            <div className="mb-10" style={{ height: '100px' }}></div>
        </IonContent>
        {/* <IonFooter>
          <PadAIContentAIPanel />
      </IonFooter> */}
    </IonPage>
);
}

export default PadAIQuestionAnswerContentScreen;