import { IonContent, IonHeader, IonToolbar,IonTitle } from "@ionic/react";

import { IonPage } from "@ionic/react";
import PadAIBackheader from "../../../components/Common/Backheader/Backheader";

const PadAIVideoContentScreen: React.FC = () => {
    return (
        <IonPage className='padAIvideoContentScreen-page'>
            <PadAIBackheader />
            
        </IonPage>
    );
};
   
export default PadAIVideoContentScreen;