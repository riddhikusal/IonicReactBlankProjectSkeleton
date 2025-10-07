import { IonItem, IonLabel, IonText } from "@ionic/react";
import './ChapterHeader.css';

const PadAIChapterHeader = () => {
    return (
        <IonItem className="padAIchapterHeader-item" lines="full">
            <IonLabel>
                <IonText className="padAIchapterHeader-item-subtitle"><p>Chapter 1</p> </IonText>
                <IonText className="padAIchapterHeader-item-title">
                    <p>Magnetic Effects of Electric Current</p>
                </IonText>
            </IonLabel>
        </IonItem>
    )
}

export default PadAIChapterHeader;
