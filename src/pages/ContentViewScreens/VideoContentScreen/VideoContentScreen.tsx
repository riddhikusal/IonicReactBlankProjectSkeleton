import { IonContent, IonHeader, IonToolbar, IonTitle, IonFooter } from "@ionic/react";

import { IonPage } from "@ionic/react";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import PadAIVideoPlayer from "../../../components/ContentView/VideoPlayer/VideoPlayer";
import { VideoContentDummy } from "../dummyData";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";
import PadAIHtmlContentViwer from "../../../components/ContentView/HtmlViewer/HtmlViewer";

const PadAIVideoContentScreen: React.FC = () => {
    return (
        <IonPage className='padAIvideoContentScreen-page'>
            <PadAIBackheader />
            <IonContent>
                <PadAIChapterHeader />
                <PadAIVideoPlayer
                    video={VideoContentDummy}
                />
                <PadAIHtmlContentViwer
                    url="https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Chapter-Summary.html"
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