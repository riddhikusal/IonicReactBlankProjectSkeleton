import { IonContent, IonHeader, IonToolbar, IonTitle, IonFooter } from "@ionic/react";

import { IonPage } from "@ionic/react";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import PadAIVideoPlayer from "../../../components/ContentView/VideoPlayer/VideoPlayer";
import { VideoContentDummy } from "../dummyData";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";
import PadAIHtmlContentViwer from "../../../components/ContentView/HtmlViewer/HtmlViewer";
import { useChapterStore } from "../../../services/store/chapter.store";

const PadAIVideoContentScreen: React.FC = () => {
    const chapterInfo = useChapterStore((state)=>state.chapterInfo);
    const selectedChapterResources = useChapterStore((state)=>state.selectedChapterResources);
    return (
        <IonPage className='padAIvideoContentScreen-page'>
            <PadAIBackheader />
            <IonContent>
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