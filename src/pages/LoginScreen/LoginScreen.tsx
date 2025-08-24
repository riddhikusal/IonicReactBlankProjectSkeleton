import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import PadAIStateAndSchoolSelection from '../../components/LoginScreen/StateAndSchoolSelection/StateAndSchoolSelection';
import PadAIPhoneNoValidation from '../../components/LoginScreen/PhoneNoValidation/PhoneNoValidation';
import { LoginForm, defaultLoginForm } from './LoginScreen.interface';

const PadAILoginScreen = () => {
    const [step, setStep] = useState(1);
    const [loginForm, setLoginForm] = useState<LoginForm>(JSON.parse(JSON.stringify(defaultLoginForm)));
    return (
        <IonPage>
        <PadaiHeader />
        <IonContent>
          <PadaiHeaderBanner />
          {step === 1 && <PadAIStateAndSchoolSelection setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />}
          {step === 2 && <PadAIPhoneNoValidation setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />}
          <PadaiFooter />
        </IonContent>
      </IonPage>
    );
};

export default PadAILoginScreen;  