import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import PadAIStateAndSchoolSelection from '../../components/LoginScreen/StateAndSchoolSelection/StateAndSchoolSelection';

const PadAILoginScreen = () => {
    const [step, setStep] = useState(1);
    return (
        <IonPage>
        <PadaiHeader />
        <IonContent>
          <PadaiHeaderBanner />
          {step === 1 && <PadAIStateAndSchoolSelection setStep={setStep} />}
          <PadaiFooter />
        </IonContent>
      </IonPage>
    );
};

export default PadAILoginScreen;