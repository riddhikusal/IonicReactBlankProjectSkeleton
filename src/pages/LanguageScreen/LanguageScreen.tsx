import { IonContent, IonImg, IonPage } from '@ionic/react';
import React from 'react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import PadaiButton from '../../components/Common/Buttons/Button';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import PadaiLanguageContainer from '../../components/LanguageScreen/LanguageContainer/LanguageContainer';
import './LanguageScreen.css';
import { getPlatform } from '../../utils/platform';
import { useEffect } from 'react';
import { useState } from 'react';
const PadAILanguageScreen: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const platformInfo = getPlatform();
    const platform = platformInfo.code;
    const imageUrl = platform === 'android' || platform === 'ios' ? `assets/images/landingScreens/vectorTwoBg.png` : `${import.meta.env.BASE_URL}/assets/images/landingScreens/vectorTwoBg.png`;
    setImageUrl(imageUrl);
  }, []);
  // check platform if not  mobile then image url will add ${import.meta.env.BASE_URL}
  return (
    <IonPage className='padAIlandingScreen-page'>
      <IonImg src={imageUrl} alt="headerBanner" className='padAIvectorTwoBg' />
      <PadaiHeader />
      <IonContent className='padAIlandingScreen-content'>
        <PadaiHeaderBanner />
        <PadaiLanguageContainer />
        <PadaiFooter />
      </IonContent>
    </IonPage>
  );
};

export default PadAILanguageScreen;
