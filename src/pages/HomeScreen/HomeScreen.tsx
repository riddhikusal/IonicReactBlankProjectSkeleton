import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './HomeScreen.css';
const PadAIHomeScreen: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
        </IonPage>
    );
};

export default PadAIHomeScreen;