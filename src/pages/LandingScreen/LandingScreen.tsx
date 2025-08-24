import { IonContent, IonImg, IonPage } from '@ionic/react';
import React from 'react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import './LandingScreen.css';
import PadaiButton from '../../components/Common/Buttons/Button';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import { useHistory } from 'react-router-dom';
const LandingScreen: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <PadaiHeader />
      <IonContent>
        <PadaiHeaderBanner />
        <IonImg src="/assets/images/landingScreens/vectorOne.png" alt="headerBanner" className='padAIvectorOne' />
        <div className='padAIbuttons-container'>
          <PadaiButton children="Get Started Free"
            onClick={(e: any) => {
              e.preventDefault();
              history.push('/language');

            }}
            color="warning"
            size="large"
            type="button"
            shape="round"
            fill="solid"
            expand="block"></PadaiButton>

          <PadaiButton children="Sign In"
            onClick={() => { }}
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
