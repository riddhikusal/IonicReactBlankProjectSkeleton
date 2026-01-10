import { IonContent, IonHeader, IonToolbar, IonTitle, IonFooter } from "@ionic/react";

import { IonPage } from "@ionic/react";
import PadaiYouTubePlayer from "../../../components/ContentView/YoutubePlayer/YoutubePlayer";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import PadAIHtmlContentViwer from "../../../components/ContentView/HtmlViewer/HtmlViewer";

import { useChapterStore } from "../../../services/store/chapter.store";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";

const PadAIYoutubeContentScreen: React.FC = () => {
  const chapterInfo = useChapterStore((state)=>state.chapterInfo);
  const selectedChapterResources = useChapterStore((state)=>state.selectedChapterResources);
  return (
    <IonPage className='padAIYoutubeContentScreen-page'>
      <PadAIBackheader />
      <IonContent>
        <PadAIChapterHeader />
        <PadaiYouTubePlayer
          video={{
            id:  selectedChapterResources?.id || '',
            title: selectedChapterResources?.name || '',
            url: selectedChapterResources?.url || '', 
            thumbnail: selectedChapterResources?.image || '',
            duration: "",
            description: selectedChapterResources?.name || '',
          }}
        />
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

export default PadAIYoutubeContentScreen;

// const YoutubeContent = () => {
//     return (
//       <div
//         className="!border-0 !pb-0"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           padding: "12px",
//           flexShrink: 0,
//         }}
//       >
//             <PadaiYouTubePlayer
//             video={{
//                 id: 'test',
//                 title: 'test',
//                 url: 'https://www.youtube.com/embed/rtjGH0B-vVA',
//                 thumbnail: "",
//                 duration: "",
//                 description: 'test',
//             }}
//             />
//       </div>
//     )
//   }