import {  IonContent, IonImg, IonPage } from '@ionic/react';
import React from 'react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import PadaiButton from '../../components/Common/Buttons/Button';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import PadaiLanguageContainer from '../../components/LanguageScreen/LanguageContainer/LanguageContainer';
import './LanguageScreen.css';
const PadAILanguageScreen: React.FC = () => {
  return (
    <IonPage>
      <PadaiHeader />
      <IonContent>
        <PadaiHeaderBanner />
        <PadaiLanguageContainer />
        <PadaiFooter />
      </IonContent>
    </IonPage>
  );
};

export default PadAILanguageScreen;
