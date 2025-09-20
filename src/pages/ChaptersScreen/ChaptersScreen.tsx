import { IonContent, IonHeader, IonImg, IonRow, IonText, IonTitle, useIonRouter } from "@ionic/react";
import './ChaptersScreen.css';
import { IonPage } from "@ionic/react";

import PadAIBackheader from "../../components/Common/Backheader/Backheader";
import PadAIChapterContainer from "../../components/HomeScreen/ChapterContainer/ChapterContainer";

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
    const navigate = useIonRouter();

    return (
        <IonPage>
            <PadAIBackheader />
            <IonImg src="/assets/images/dashboardScreen/topVectorOne.png" alt="headerBanner" className='padAIvectorTwoBg' />

            <IonHeader>
                <div className="padAIHomeScreenUserGreeting">
                    <IonText>
                        <p className='padAIHomeScreenUserGreetingText'>SCIENCE (NCERT) </p>
                    </IonText>
                    <IonText className='padAIHomeScreenUserGreeting-text-subtitle'>
                        Total Chapters : 10
                    </IonText>
                </div>
            </IonHeader>

            <IonContent>
                <IonRow className="padAIHomeScreenUserChapterRow">
                    {chapters.map((chapter, index) => (
                        <PadAIChapterContainer 
                        key={index} 
                        id={index} 
                        chapterImage={chapter.chapterImage} 
                        chapterName={chapter.chapterName} 
                        lastReadDateTime={chapter.lastReadDateTime} 
                        chapterSubject={''} 
                        showStarIcon={true} 
                        showArrowIcon={true} />
                    ))}
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default PadAIChaptersScreen;