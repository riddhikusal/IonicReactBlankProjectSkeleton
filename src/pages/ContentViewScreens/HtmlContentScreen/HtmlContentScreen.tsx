import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { megaphone, megaphoneOutline, pauseOutline, playBackOutline, playForwardOutline, playOutline, returnDownBackOutline, returnUpForwardOutline, stop, volumeHighOutline } from 'ionicons/icons';
import { IonCol, IonContent, IonFooter, IonIcon, IonLabel, IonPage, IonRange, IonRow } from '@ionic/react';
import PadAIBackheader from '../../../components/Common/Backheader/Backheader';
import PadAIChapterHeader from '../../../components/ContentView/ChapterHeader/ChapterHeader';
import PadAIContentAIPanel from '../../../components/ContentView/ContentAIPanel/ContentAIPanel';
import PadaiHtmlContentViwer from '../../../components/ContentView/HtmlViewer/HtmlViewer';
import { useChapterStore } from '../../../services/store/chapter.store';
import AudioComponent from '../../../components/ContentView/Audio/Audio';
import PadaiHtmlContentViwerNew from '../../../components/ContentView/HtmlViewerNew/HtmlViewerNew';

  const PadAIHTMLContentScreen: React.FC = () => {
    const chapterInfo = useChapterStore((state)=>state.chapterInfo);
    const selectedChapterResources = useChapterStore((state)=>state.selectedChapterResources);
    return (
      <IonPage className='padAIvideoContentScreen-page'>
      <PadAIBackheader />
      <IonContent>
          <PadAIChapterHeader />
          {/* <PadaiHtmlContentViwer
              url={selectedChapterResources?.url || ''}
          /> */}
          <PadaiHtmlContentViwerNew
              url={selectedChapterResources?.url || ''}
          />
          {/* <PadAIContentAIPanel /> */}
      </IonContent>
      <IonFooter>
          <PadAIContentAIPanel />
      </IonFooter>
  </IonPage>
    );
};
   
export default PadAIHTMLContentScreen;

