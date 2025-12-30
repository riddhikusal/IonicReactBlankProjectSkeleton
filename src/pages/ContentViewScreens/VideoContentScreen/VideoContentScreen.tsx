import { IonContent, IonHeader, IonToolbar, IonTitle, IonFooter, IonImg } from "@ionic/react";
import vectoreBgImage from '/assets/images/dashboardScreen/topVectorOne.png';
import { IonPage } from "@ionic/react";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
// import PadAIVideoPlayer from "../../../components/ContentView/VideoPlayer/VideoPlayer";
import { VideoContentDummy } from "../dummyData";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";
import PadAIHtmlContentViwer from "../../../components/ContentView/HtmlViewer/HtmlViewer";
import { useChapterStore } from "../../../services/store/chapter.store";
import PadAIVideoPlayer from "../../../components/ContentView/VideoPlayer/VideoPlayerNew";

const PadAIVideoContentScreen: React.FC = () => {
    const chapterInfo = useChapterStore((state)=>state.chapterInfo);
    const selectedChapterResources = useChapterStore((state)=>state.selectedChapterResources);
    return (
        <IonPage className='padAIvideoContentScreen-page'>
             <IonImg src={vectoreBgImage} alt="headerBanner" className='padAIvectorTwoBg' />
            <PadAIBackheader />
            <IonContent className='padAIContentScreen-content'>
                <PadAIChapterHeader />
                <PadAIVideoPlayer
                    video={{...VideoContentDummy, url: selectedChapterResources?.url || '', thumbnail: selectedChapterResources?.image || ''}}
                />
                <PadAIHtmlContentViwer
                    url={selectedChapterResources?.htmlView || ''}
                />
                {/* <PadAIContentAIPanel /> */}
            </IonContent>
            <IonFooter>
                <PadAIContentAIPanel />
            </IonFooter>
        </IonPage>
    );
};

export default PadAIVideoContentScreen;