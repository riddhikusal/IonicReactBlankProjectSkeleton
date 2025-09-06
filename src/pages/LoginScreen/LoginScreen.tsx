import React, { useState } from 'react';
import { IonPage, IonContent, IonImg } from '@ionic/react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import PadAIStateAndSchoolSelection from '../../components/LoginScreen/StateAndSchoolSelection/StateAndSchoolSelection';
import PadAIPhoneNoValidation from '../../components/LoginScreen/PhoneNoValidation/PhoneNoValidation';
import { LoginForm, defaultLoginForm } from './LoginScreen.interface';
import PadAISignUpForm from '../../components/LoginScreen/SignUpForm/SignUpForm';

type Step = 'phone' | 'login' | 'signup';

const PadAILoginScreen = () => {
  const [step, setStep] = useState('phone');
  const [loginForm, setLoginForm] = useState<LoginForm>(JSON.parse(JSON.stringify(defaultLoginForm)));
  return (
    <IonPage className='padAIlandingScreen-page'>
      {step !== 'signup' && <IonImg src="/assets/images/landingScreens/vectorTwoBg.png" alt="headerBanner" className='padAIvectorTwoBg' />}
      <PadaiHeader />
      <IonContent className='padAIlandingScreen-content'>
        {step !== 'signup' && <PadaiHeaderBanner />}
        {/* {step === 1 && <PadAIStateAndSchoolSelection setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />} */}
        {/* {step === 'login' && (
          <PadAILoginForm
            mobileNo={mobileNo}
            onBack={() => setStep('phone')}
            onSubmit={(vals) => {
              // TODO: call your real login endpoint here and then route to /home
              console.log('Login with', vals);
            }}
          />
        )} */}
        {step === 'phone' && <PadAIPhoneNoValidation setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />}
        {step === 'signup' && <PadAISignUpForm setStep={setStep} loginForm={loginForm} setLoginForm={setLoginForm} />}
        <PadaiFooter />
      </IonContent>
    </IonPage>
  );
};

export default PadAILoginScreen;  