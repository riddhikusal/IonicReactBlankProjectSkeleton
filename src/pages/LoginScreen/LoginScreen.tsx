import React, { useState } from 'react';
import { IonPage, IonContent, IonImg } from '@ionic/react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import PadAIStateAndSchoolSelection from '../../components/LoginScreen/StateAndSchoolSelection/StateAndSchoolSelection';
import PadAIPhoneNoValidation from '../../components/LoginScreen/PhoneNoValidation/PhoneNoValidation';
import { LoginForm, defaultLoginForm } from './LoginScreen.interface';
import PadAISignUpForm from '../../components/LoginScreen/SignUpForm/SignUpForm';

const PadAILoginScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loginForm, setLoginForm] = useState<LoginForm>(JSON.parse(JSON.stringify(defaultLoginForm)));
  return (
    <IonPage className='padAIlandingScreen-page'>
      {step !== 3 && <IonImg src="/assets/images/landingScreens/vectorTwoBg.png" alt="headerBanner" className='padAIvectorTwoBg' />}
      <PadaiHeader />
      <IonContent className='padAIlandingScreen-content'>
        {step !== 3 && <PadaiHeaderBanner />}
        {step === 1 && <PadAIStateAndSchoolSelection setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />}
        {step === 2 && <PadAIPhoneNoValidation setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />}
        {step === 3 && <PadAISignUpForm setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />}
        <PadaiFooter />
      </IonContent>
    </IonPage>
  );
};

export default PadAILoginScreen;  