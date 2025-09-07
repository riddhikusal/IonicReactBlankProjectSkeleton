import { IonButton, IonButtons, IonIcon, IonImg, IonMenuButton, IonTitle, useIonRouter } from "@ionic/react"

import { IonHeader, IonToolbar } from "@ionic/react"
import './Commonheader.css';
import { notificationsOutline } from "ionicons/icons";

const Commonheader = () => {
    const navigate = useIonRouter();
    return (
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton className="menuBtn" color={'dark'}></IonMenuButton>
            </IonButtons>
            <IonImg src={'/assets/logo/padai_logo.png'} alt="logo" className='padAIlogo'>
            </IonImg>
            <IonButtons slot="end">
              <IonButton className="padAI-commonheader-button" fill="clear" onClick={() => {
                navigate.push('/home','forward');
              }}>
                <IonIcon icon={notificationsOutline} color={'dark'}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
    )
}

export default Commonheader;