import { IonFooter, IonPage } from "@ionic/react";

import { IonContent } from "@ionic/react";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";
import { useChapterStore } from "../../../services/store/chapter.store";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import PadaiHtmlContentViwer from "../../../components/ContentView/HtmlViewer/HtmlViewer";

 const PadAIQuestionAnswerContentScreen = () => {
    const chapterInfo = useChapterStore((state)=>state.chapterInfo);
    const selectedChapterResources = useChapterStore((state)=>state.selectedChapterResources);
    return (
      <IonPage className='padAIvideoContentScreen-page'>
      <PadAIBackheader />
      <IonContent>
          <PadAIChapterHeader />
          <PadaiHtmlContentViwer
              url={selectedChapterResources?.url || ''}
          />
          {/* <PadAIContentAIPanel /> */}
      </IonContent>
      <IonFooter>
          <PadAIContentAIPanel />
      </IonFooter>
  </IonPage>
    );  
}

export default PadAIQuestionAnswerContentScreen;