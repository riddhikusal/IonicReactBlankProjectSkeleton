import { IonButton, IonButtons, IonChip, IonCol, IonIcon, IonImg, IonRow, IonText, IonTextarea } from '@ionic/react';
import './ContentAIPanel.css';
import { mic, play, playForward, searchOutline } from 'ionicons/icons';
const PadAIContentAIPanel = () => {
    return (
        <div className="padAIcontentAIPanel-container">
            <IonRow>
                <IonCol size='3'>
                    <IonButton className="btnGradient" fill='clear'>
                        <IonImg src={'/assets/images/contentScreens/aiAsk.png'} alt='ask' />
                        <IonText>Ask</IonText>
                    </IonButton>
                </IonCol>
                <IonCol size='6'>
                    <IonTextarea 
                        placeholder='Ask anything about the video'
                    ></IonTextarea>
                </IonCol>
                <IonCol size='3'>
                    <IonButtons>
                        {/* <IonButton fill='clear' > <IonIcon icon={searchOutline} className='footericons'></IonIcon></IonButton> */}
                        <IonButton fill='clear' > <IonIcon icon={play} className='footericons' ></IonIcon></IonButton>
                        <IonButton fill='clear' > <IonIcon icon={mic} className='footericons'></IonIcon></IonButton>
                    </IonButtons>
                </IonCol>
            </IonRow>
        </div>
    )
}

export default PadAIContentAIPanel;