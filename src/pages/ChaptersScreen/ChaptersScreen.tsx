import { IonCol, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonSkeletonText, IonText, IonThumbnail, IonTitle, useIonRouter } from "@ionic/react";
import './ChaptersScreen.css';
import { IonPage } from "@ionic/react";
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

import PadAIBackheader from "../../components/Common/Backheader/Backheader";
import PadAIChapterContainer from "../../components/HomeScreen/ChapterContainer/ChapterContainer";
import { GetChapters } from "../../services/homeService";
import { IGetChapterRequest, IGetChapterResponse } from "../../api/contentApi/contentApi.interface";
import { useToaster } from "../../hooks/toasterHooks/useToaster";



const PadAIChaptersScreen: React.FC = () => {
    const { dangerToaster } = useToaster();
    const navigate = useIonRouter();
    const location = useLocation();
    const { bookId } = useParams<{ bookId: string }>();
    const [chapters, setChapters] = useState<IGetChapterResponse[]>([]);
    const [isChaptersLoading, setIsChaptersLoading] = useState(false);

    // Method 1: Get query parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const subjectId = searchParams.get('subjectId');
    const subject = searchParams.get('subject');
    const bookName = searchParams.get('bookName');

    // Method 2: Get route parameters (from /chapters-list/:bookId)
    const routeBookId = bookId;

    // Method 3: Get state data (if passed via navigate.push with state)
    const stateData = location.state as any;



    const getChapters = async () => {
        try {
            if (subjectId) {
                setIsChaptersLoading(true);
                let getData: IGetChapterRequest = {
                    subjectId: Number(subjectId),
                    language: 'en'
                }
                const res = await GetChapters(getData);
                if (res.responseStatus === 'DATA_FOUND') {
                    setChapters(res.data);
                } else {
                    setChapters([]);
                    dangerToaster(res.message);
                    navigate.push('/home');
                }
            }
        } catch (error) {
            console.log(error);
            setChapters([]);
            dangerToaster('Something went wrong');
            navigate.push('/home');
        }
        finally {
            setIsChaptersLoading(false);
        }
    }

    useEffect(() => {
        console.log(subjectId, subject, bookName, routeBookId, stateData);
        getChapters();
    }, [subjectId, subject, bookName, routeBookId, stateData]);

    return (
        <IonPage>
            <PadAIBackheader />
            <IonImg src="/assets/images/dashboardScreen/topVectorOne.png" alt="headerBanner" className='padAIvectorTwoBg' />

            <IonHeader>
                <div className="padAIHomeScreenUserGreeting">
                    <IonText>
                        <p className='padAIHomeScreenUserGreetingText'>{subject || 'SCIENCE (NCERT)'}</p>
                    </IonText>
                    <IonText className='padAIHomeScreenUserGreeting-text-subtitle'>
                        Total Chapters : {chapters.length}
                    </IonText>
                </div>
            </IonHeader>

            <IonContent>
                <IonRow className="padAIHomeScreenUserChapterRow">
                    {isChaptersLoading && [1, 2, 3, 4, 5, 6, 7].map((item) => (<IonCol size='12' key={item}>
                        <IonList style={{ width: '100%' }}>
                            <IonListHeader>
                                <IonSkeletonText animated={true} style={{ width: '80px' }}></IonSkeletonText>
                            </IonListHeader>
                            <IonItem lines="none">
                                <IonThumbnail slot="start">
                                    <IonSkeletonText animated={true}></IonSkeletonText>
                                </IonThumbnail>
                                <IonLabel>
                                    <h3>
                                        <IonSkeletonText animated={true} style={{ width: '80%' }}></IonSkeletonText>
                                    </h3>
                                    <p>
                                        <IonSkeletonText animated={true} style={{ width: '60%' }}></IonSkeletonText>
                                    </p>
                                    <p>
                                        <IonSkeletonText animated={true} style={{ width: '30%' }}></IonSkeletonText>
                                    </p>
                                </IonLabel>
                            </IonItem>
                        </IonList>
                    </IonCol>))}
                    {!isChaptersLoading && chapters.map((chapter, index) => (
                        <PadAIChapterContainer
                            key={index}
                            id={chapter.chapterId}
                            chapterImage={chapter.image}
                            chapterName={chapter.title}
                            lastReadDateTime={new Date().toLocaleDateString()}
                            chapterSubject={''}
                            showStarIcon={true}
                            showArrowIcon={true}
                            index={index}
                        />
                    ))}
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default PadAIChaptersScreen;