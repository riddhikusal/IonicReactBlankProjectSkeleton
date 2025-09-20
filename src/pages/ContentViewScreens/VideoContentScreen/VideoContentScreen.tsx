import { IonContent, IonHeader, IonToolbar, IonTitle, IonFooter } from "@ionic/react";

import { IonPage } from "@ionic/react";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import PadAIVideoPlayer from "../../../components/ContentView/VideoPlayer/VideoPlayer";
import { VideoContentDummy } from "../dummyData";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";

const PadAIVideoContentScreen: React.FC = () => {
    return (
        <IonPage className='padAIvideoContentScreen-page'>
            <PadAIBackheader />
            <IonContent>
                <PadAIChapterHeader />
                <PadAIVideoPlayer
                    video={VideoContentDummy}
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