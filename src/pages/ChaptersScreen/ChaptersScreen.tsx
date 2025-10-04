import { IonContent, IonHeader, IonImg, IonRow, IonText, IonTitle, useIonRouter } from "@ionic/react";
import './ChaptersScreen.css';
import { IonPage } from "@ionic/react";
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

import PadAIBackheader from "../../components/Common/Backheader/Backheader";
import PadAIChapterContainer from "../../components/HomeScreen/ChapterContainer/ChapterContainer";
import { GetChapters } from "../../services/homeService";
import { IGetChapterRequest, IGetChapterResponse } from "../../api/contentApi/contentApi.interface";
import { useToaster } from "../../hooks/toasterHooks/useToaster";

const chapters = [
    {
        chapterImage: '/assets/images/chapters/Ch01.jpeg',
        chapterName: 'Chemical Reactions and Equations',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch02.jpeg',
        chapterName: 'Atoms and Molecules',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch03.jpeg',
        chapterName: 'Molecules and Ions',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch04.jpeg',
        chapterName: 'Atomic Structure',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch05.jpeg',
        chapterName: 'Periodic Classification of Elements',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch06.jpeg',
        chapterName: 'Life Processes',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch07.jpeg',
        chapterName: 'The S-Block Elements',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch08.jpeg',
        chapterName: 'The P-Block Elements',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch09.jpeg',
        chapterName: 'The D-Block Elements',
        lastReadDateTime: 'Last Read: 10/09/2025'
    },
    {
        chapterImage: '/assets/images/chapters/Ch10.jpeg',
        chapterName: 'The f-Block Elements',
        lastReadDateTime: 'Last Read: 10/09/2025'
    }
]


const PadAIChaptersScreen: React.FC = () => {
    const { dangerToaster } = useToaster();
    const navigate = useIonRouter();
    const location = useLocation();
    const { bookId } = useParams<{ bookId: string }>();
    const [chapters, setChapters] = useState<IGetChapterResponse[]>([]);

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
        if (subjectId) {
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
                        Total Chapters : 10
                        {bookName && <span> | Book: {bookName}</span>}
                    </IonText>
                </div>
            </IonHeader>

            <IonContent>
                <IonRow className="padAIHomeScreenUserChapterRow">
                    {chapters.map((chapter, index) => (
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