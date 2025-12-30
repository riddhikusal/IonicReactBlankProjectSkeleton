import { IonButton, IonButtons, IonIcon, IonImg, useIonRouter } from "@ionic/react"

import { IonHeader, IonToolbar } from "@ionic/react"
import './Backheader.css';
import { arrowBackOutline, homeOutline } from "ionicons/icons";
import logoImage from '/assets/logo/padai_logo.png';
export interface IBackheaderProps {
    forReelScreen?: boolean;
}
const PadAIBackheader: React.FC<IBackheaderProps> = ({ forReelScreen = false }) => {
    const navigate = useIonRouter();
    return (
        <IonHeader mode="ios">
            <IonToolbar className={forReelScreen ? "reelScreen-header" : ""}>
                <IonButtons slot="start">
                    <IonButton className="padAI-commonheader-button" fill={forReelScreen ? "clear" : "clear"} onClick={() => {
                        // navigate.back();
                        navigate.goBack();
                    }}>
                        <IonIcon icon={arrowBackOutline} color={forReelScreen ? "light" : "dark"}></IonIcon>
                    </IonButton>
                </IonButtons>
                {!forReelScreen && (
                    <>
                        <IonImg src={logoImage} alt="logo" className='padAIlogoInnerScreen'>
                        </IonImg>
                        <IonButtons slot="end">
                            <IonButton className="padAI-commonheader-button" fill="clear" onClick={() => {
                                navigate.push('/home', 'forward');
                            }}>
                                <IonIcon icon={homeOutline} color={'dark'}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </>)}
            </IonToolbar>
        </IonHeader>
    )
}

export default PadAIBackheader;