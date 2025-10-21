import { IonChip, IonItem, IonLabel, IonText, IonToggle } from "@ionic/react";
import './ChapterHeader.css';
import { useChapterStore } from "../../../services/store/chapter.store";
export interface IChapterHeaderProps {
    readModeToggleSwitch?: boolean;
    currentActiveMode?:'PDF'|'HTML';
    backToModeChange?: 'PDF'|'HTML';
    readModeToggleSwitchChange?: (value: boolean) => void;
}
const PadAIChapterHeader: React.FC<IChapterHeaderProps> = ({ readModeToggleSwitch, readModeToggleSwitchChange, currentActiveMode, backToModeChange }) => {
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

           {readModeToggleSwitch && <IonChip onClick={() => readModeToggleSwitchChange?.(true)} >Back to {backToModeChange || 'PDF'}</IonChip>}
        </IonItem>
    )
}

export default PadAIChapterHeader;
