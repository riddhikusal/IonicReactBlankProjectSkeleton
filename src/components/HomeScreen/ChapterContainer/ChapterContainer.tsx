import { IonButton, IonButtons, IonCol, IonIcon, IonImg, IonRow, IonText, useIonRouter } from "@ionic/react";
import './ChapterContainer.css';
import { arrowForward, starOutline } from "ionicons/icons";
export interface IChapterContainerProps {
    id: number;
    chapterImage: string;
    chapterName: string;
    lastReadDateTime: string;
}

const PadAIChapterContainer: React.FC<IChapterContainerProps> = ({ id, chapterImage, chapterName, lastReadDateTime }) => {
    const navigate = useIonRouter();

    const goToContentView = () => {
        navigate.push('/chapter', 'forward');
    }

    return (
        <IonCol size="12" className="padAIHomeScreenUserChapterContainer" onClick={goToContentView}>
            <IonRow className="padAIHomeScreenUserChapterCardRow">
                <IonCol size="3" className="colBorderClass">
                    <IonImg src={chapterImage} alt={chapterName} className='padAIHomeScreenUserChapterImage' />
                </IonCol>
                <IonCol size="9" className="padAIHomeScreenUserChapterTextContainer colBorderClass">
                    <div className="padAIHomeScreenUserChapterTextContainerHeader">
                        <p className='padAIHomeScreenUserChapter-text chapter-text'>Chapter {id + 1}</p>
                        <IonButtons>
                            <IonButton fill="clear">
                                <IonIcon icon={starOutline} />
                            </IonButton>
                            <IonButton fill="clear">
                                <IonIcon icon={arrowForward} />
                            </IonButton>
                        </IonButtons>
                    </div>
                    <IonText className="ion-text-wrap padAIHomeScreenUserChapter-text-container" style={{ textOverflow: 'ellipsis' }}>
                        {/* <p className='padAIHomeScreenUserChapter-text chapter-text'>Chapter {id + 1}</p> */}
                        <p className='padAIHomeScreenUserChapter-text chapter-name'>{chapterName}</p>
                        <p className='padAIHomeScreenUserChapter-text author-text'>{lastReadDateTime}</p>
                    </IonText>
                </IonCol>
            </IonRow>
        </IonCol>
    )
}

export default PadAIChapterContainer;