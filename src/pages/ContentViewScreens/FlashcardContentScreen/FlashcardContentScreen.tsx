import { IonCol, IonContent, IonFooter, useIonRouter, IonRow, IonText, IonSkeletonText, IonPage } from "@ionic/react";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import { useChapterStore } from "../../../services/store/chapter.store";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";
import { useEffect, useState } from "react";
import { IGetChapterFlashcardsRequest } from "../../../api/contentApi/contentApi.interface";
import { GetFlashcards } from "../../../services/homeService";
import { useToaster } from "../../../hooks/toasterHooks/useToaster";
import FlashViewer from "../../../components/ContentView/FlashViewer/FlashViewer";

const PadAIFlashcardContentScreen = () => {
    const { dangerToaster, successToaster } = useToaster();
    const navigate = useIonRouter();
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const selectedChapterResources = useChapterStore((state) => state.selectedChapterResources);
    const [loading, setLoading] = useState<boolean>(false);
    const [flashcards, setFlashcards] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;

        const getChapterFlashcards = async () => {
            try {
                if (!isMounted) return;
                setLoading(true);

                if (chapterInfo.chapterId) {
                    let data: IGetChapterFlashcardsRequest = {
                        chapterId: Number(chapterInfo.chapterId),
                        language: 'en'
                    }
                    const res = await GetFlashcards(data);

                    if (!isMounted) return;

                    if (res.responseStatus === 'DATA_FOUND') {
                        setFlashcards(res.data);
                    } else {
                        setFlashcards([]);
                        dangerToaster(res.message);
                        setTimeout(() => {
                            if (isMounted) {
                                navigate.push('/home');
                            }
                        }, 1000);
                    }
                } else {
                    if (!isMounted) return;
                    setFlashcards([]);
                    dangerToaster('Chapter ID not found. Please try again.');
                    console.error('ChapterId is null or undefined');
                }
            } catch (error) {
                console.error('Error fetching chapter quiz:', error);
                if (!isMounted) return;
                setFlashcards([]);
                dangerToaster('Failed to load chapter quiz');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        getChapterFlashcards();

        return () => {
            isMounted = false;
        };
    }, [chapterInfo.chapterId]);

    return (
        <IonPage className='padAIvideoContentScreen-page'>
            <PadAIBackheader />
            <IonContent>
                <PadAIChapterHeader />
                <IonRow>
                    {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) =>
                    (<IonCol size="6">
                        <IonText className="ion-text-wrap padAIHomeScreenUserBooks-text-container" style={{ textOverflow: 'ellipsis' }}>
                            <IonSkeletonText animated={true} style={{ width: '120px', height: '180px' }}></IonSkeletonText>
                        </IonText>
                    </IonCol>)
                    )}
                    {!loading && flashcards && flashcards.length > 0 && flashcards.map((flashcard) => (
                        <IonCol size="6">
                            <FlashViewer
                                key={flashcard.id}
                                question={flashcard.question}
                                answer={flashcard.answer}
                                image={flashcard.image}
                            />
                        </IonCol>
                    ))}
                </IonRow>
            </IonContent>
            <IonFooter>
                <PadAIContentAIPanel />
            </IonFooter>
        </IonPage>)
}

export default PadAIFlashcardContentScreen;