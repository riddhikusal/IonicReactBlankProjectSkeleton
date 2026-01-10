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
import NewPadAIVideoPlayer from "../../../components/ContentView/VideoPlayer/NewPadAIVideo";
import { useRef } from "react";

const PadAIVideoContentScreen: React.FC = () => {
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const videoRef = useRef<any>(null);
    const selectedChapterResources = useChapterStore((state) => state.selectedChapterResources);
    return (
        <IonPage className='padAIvideoContentScreen-page'>
            <IonImg src={vectoreBgImage} alt="headerBanner" className='padAIvectorTwoBg' />
            <PadAIBackheader />
            <IonContent className='padAIContentScreen-content'>
                <PadAIChapterHeader />
                {/* <PadAIVideoPlayer
                    video={{...VideoContentDummy, url: selectedChapterResources?.url || '', thumbnail: selectedChapterResources?.image || ''}}
                /> */}
                { selectedChapterResources?.url  && <div style={{ width: '100%', backgroundColor: 'red' }}>
                    <NewPadAIVideoPlayer videoUrl={selectedChapterResources?.url || ''} />
                </div>}

                {/* <video
                    ref={videoRef}
                    className="video-js"
                    playsInline
                    style={{ width: "100%", borderRadius: "12px" }}
                >
                    <source
                        src="https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/AI-Video-Eng/Magnetic_Effects_of_Electric_Current_English.mp4"
                        // src={videoUrl}
                        type="video/mp4"
                    />
                </video> */}

                <PadAIHtmlContentViwer
                    url={selectedChapterResources?.htmlView || ''}
                />
                {/* <PadAIContentAIPanel /> */}
            </IonContent>
            <IonFooter>
                <PadAIContentAIPanel
                showActionsButton={true}
                showAskAiButton={true}
                showAudioButtons={true}
                showSearchButton={false}
                showTranslateButton={false}
                showMicButton={false}
                showDocumentButton={false}
                showColorPaletteButton={false}
                showGlobeButton={false}
                showEllipsisButton={false}
                />
            </IonFooter>
        </IonPage>
    );
};

export default PadAIVideoContentScreen;