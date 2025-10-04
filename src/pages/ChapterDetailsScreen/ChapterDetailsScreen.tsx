import { IonContent, IonHeader, IonImg, IonPage } from "@ionic/react";
import PadAIBackheader from "../../components/Common/Backheader/Backheader";
import PadAIChapterContainer from "../../components/HomeScreen/ChapterContainer/ChapterContainer";


const chapter = {
    chapterImage: '/assets/images/chapters/Ch01.jpeg',
    chapterName: 'Chemical Reactions and Equations',
    lastReadDateTime: 'Last Read: 10/09/2025',
}



const PadAIChapterDetailsScreen: React.FC = () => {
    return (
        <IonPage>
            <PadAIBackheader />
            <IonImg src="/assets/images/dashboardScreen/topVectorOne.png" alt="headerBanner" className='padAIvectorTwoBg' />

            <IonHeader>
                <PadAIChapterContainer
                    key={'ChapterDetails'}
                    id={1}
                    chapterImage={chapter.chapterImage}
                    chapterName={chapter.chapterName}
                    lastReadDateTime={chapter.lastReadDateTime}
                    chapterSubject={'Science'}
                    showStarIcon={true}
                    showArrowIcon={false} />
            </IonHeader>
            <IonContent>

            </IonContent>
        </IonPage>
    )
}

export default PadAIChapterDetailsScreen;