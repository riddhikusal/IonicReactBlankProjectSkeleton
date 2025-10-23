import { IonButton, IonButtons, IonIcon, IonImg, useIonRouter } from "@ionic/react"

import { IonHeader, IonToolbar } from "@ionic/react"
import './Backheader.css';
import { arrowBackOutline, homeOutline } from "ionicons/icons";
import logoImage from '/assets/logo/padai_logo.png';

const PadAIBackheader = () => {
    const navigate = useIonRouter();
    return (
        <IonHeader mode="ios">
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton className="padAI-commonheader-button" fill="clear" onClick={() => {
                        navigate.back();
                    }}>
                        <IonIcon icon={arrowBackOutline} color={'dark'}></IonIcon>
                    </IonButton>
                </IonButtons>
                <IonImg src={logoImage} alt="logo" className='padAIlogoInnerScreen'>
                </IonImg>
                <IonButtons slot="end">
                    <IonButton className="padAI-commonheader-button" fill="clear" onClick={() => {
                        navigate.push('/home', 'forward');
                    }}>
                        <IonIcon icon={homeOutline} color={'dark'}></IonIcon>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    )
}

export default PadAIBackheader;