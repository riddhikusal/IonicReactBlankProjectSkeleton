import { IonButton, IonContent, IonIcon, IonImg, IonPage,useIonRouter } from '@ionic/react';
import React from 'react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import './LandingScreen.css';
import PadaiButton from '../../components/Common/Buttons/Button';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import { useHistory } from 'react-router-dom';

const LandingScreen: React.FC = () => {
  const history = useHistory();
  const navigate = useIonRouter();
  return (
    <IonPage className='padAIlandingScreen-page'>
      <IonImg src={`${import.meta.env.BASE_URL}assets/images/landingScreens/vectorTwoBg.png`} alt="headerBanner" className='padAIvectorTwoBg' />
      <PadaiHeader />
      <IonContent className='padAIlandingScreen-content'>
        <PadaiHeaderBanner />
        {/* <IonButton onClick={() => {
          navigate.push('/language','forward');
        }}>
          <IonIcon icon="arrow-forward"></IonIcon>
        </IonButton> */}
        <IonImg src={`${import.meta.env.BASE_URL}assets/images/landingScreens/vectorOne.png`} alt="headerBanner" className='padAIvectorOne' />
        <div className='padAIbuttons-container'>
          <PadaiButton children="Get Started Free"
            onClick={(e: any) => {
              e.preventDefault();
              navigate.push('/language','forward');

            }}
            color="warning"
            size="large"
            type="button"
            shape="round"
            fill="solid"
            expand="block"></PadaiButton>

          <PadaiButton children="Sign In"
            onClick={() => {
              navigate.push('/login','forward');
            }}
            color="medium"
            size="large"
            type="button"
            shape="round"
            fill="outline"
            expand="block"></PadaiButton>
        </div>
        <PadaiFooter />
      </IonContent>
    </IonPage>
  );
};

export default LandingScreen;
