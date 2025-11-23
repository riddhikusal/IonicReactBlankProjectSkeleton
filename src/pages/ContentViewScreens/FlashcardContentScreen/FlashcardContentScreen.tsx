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
import { useChatsStore } from "../../../services/store/chats.store";


const PadAIFlashcardContentScreen = () => {
    const { dangerToaster, successToaster } = useToaster();
    const navigate = useIonRouter();
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const selectedChapterResources = useChapterStore((state) => state.selectedChapterResources);
    const [loading, setLoading] = useState<boolean>(false);
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const setSelectedText = useChatsStore((state: any) => state.setSelectedText);;
    const setIsChatOpen = useChatsStore((state: any) => state.setIsChatOpen);
    const onSelectedTextClick = (selectedText: string) => {
        setSelectedText(selectedText,true);
        setIsChatOpen?.(true);
    }
    useEffect(() => {
        let isMounted = true;

        const getChapterFlashcards = async () => {
            try {
                if (!isMounted) return;
                setLoading(true);
                console.log("chapterInfo",chapterInfo);
                console.log("selectedChapterResources",selectedChapterResources);

                if (chapterInfo.chapterId) {
                    let data: IGetChapterFlashcardsRequest = {
                        chapterId: Number(chapterInfo.chapterId),
                        language: selectedChapterResources && selectedChapterResources.language?.toLowerCase() == 'hindi' ? 'hi' : 'en'
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
                <IonRow style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) =>
                    (<IonCol size="6" key={index} style={{ display: 'flex', alignItems: 'stretch' }}>
                        <IonText className="ion-text-wrap padAIHomeScreenUserBooks-text-container" style={{ textOverflow: 'ellipsis', width: '100%', display: 'flex' }}>
                            <IonSkeletonText animated={true} style={{ width: '120px', height: '180px' }}></IonSkeletonText>
                        </IonText>
                    </IonCol>)
                    )}
                    {!loading && flashcards && flashcards.length > 0 && flashcards.map((flashcard) => (
                        <IonCol size="12" key={flashcard.id} style={{ display: 'flex', alignItems: 'stretch' }}>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <FlashViewer
                                    key={flashcard.id}
                                    question={flashcard.question}
                                    answer={flashcard.answer}
                                    image={flashcard.imageUrl}
                                    onSelectedTextClick={onSelectedTextClick}
                                />
                            </div>
                        </IonCol>
                    ))}
                </IonRow>
                <div className="mb-10" style={{ height: '100px' }}></div>
            </IonContent>
            <IonFooter>
                <PadAIContentAIPanel showActionsButton={false} />
            </IonFooter>
        </IonPage>)
}

export default PadAIFlashcardContentScreen;