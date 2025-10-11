import { IonItem, IonLabel, IonText } from "@ionic/react";
import './ChapterHeader.css';
import { useChapterStore } from "../../../services/store/chapter.store";

const PadAIChapterHeader = () => {
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const selectedChapterResources = useChapterStore((state) => state.selectedChapterResources);
    return (
        <IonItem className="padAIchapterHeader-item" lines="full">
            <IonLabel>
                <IonText className="padAIchapterHeader-item-subtitle"><p>Chapter {chapterInfo.chapterNo}</p> </IonText>
                <IonText className="padAIchapterHeader-item-title">
                    <p>{chapterInfo.title}</p>

                </IonText>
                <IonText className="padAIchapterHeader-item-title" color="primary">
                    <p>{selectedChapterResources?.name}</p>
                </IonText>
            </IonLabel>
        </IonItem>
    )
}

export default PadAIChapterHeader;
