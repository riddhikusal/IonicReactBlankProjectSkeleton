import { useChapterStore } from "../../../services/store/chapter.store";
import { IonPage, IonContent, IonFooter } from "@ionic/react";
import PadAIPdfViewer from "../../../components/ContentView/PdfViewer/PdfViewer";
import PadAIChapterHeader from "../../../components/ContentView/ChapterHeader/ChapterHeader";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";
import PadAIContentAIPanel from "../../../components/ContentView/ContentAIPanel/ContentAIPanel";
import PadaiHtmlContentViwer from "../../../components/ContentView/HtmlViewer/HtmlViewer";
import { useState } from "react";
const PadAIPDFViewerContentScreen: React.FC = () => {
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const selectedChapterResources = useChapterStore((state) => state.selectedChapterResources);
    const chapterResources = useChapterStore((state) => state.chapterResources);
    const [currentActiveMode, setCurrentActiveMode] = useState<'PDF' | 'HTML'>('PDF');


    return (
        <IonPage className='padAIvideoContentScreen-page'>
            <PadAIBackheader />
            <IonContent>
                <PadAIChapterHeader
                    currentActiveMode="PDF"
                    backToModeChange="HTML"
                    readModeToggleSwitch={true}
                    readModeToggleSwitchChange={() => {
                        console.log('readModeToggleSwitchChange',currentActiveMode);
                        setCurrentActiveMode(currentActiveMode === 'PDF' ? 'HTML' : 'PDF');
                    }}
                />
               { currentActiveMode === 'PDF' ? <PadAIPdfViewer fileUrl={selectedChapterResources?.url || ''} /> : <PadaiHtmlContentViwer url={selectedChapterResources?.script || ''} /> }
            </IonContent>
            <IonFooter>
                <PadAIContentAIPanel />
            </IonFooter>
        </IonPage>
    )
}

export default PadAIPDFViewerContentScreen;