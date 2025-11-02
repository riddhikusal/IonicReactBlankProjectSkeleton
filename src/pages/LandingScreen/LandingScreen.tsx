import { IonButton, IonContent, IonIcon, IonImg, IonPage, useIonRouter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import PadaiHeader from '../../components/LandingScreen/Header/Header';
import PadaiHeaderBanner from '../../components/LandingScreen/HeaderBanner/HeaderBanner';
import './LandingScreen.css';
import PadaiButton from '../../components/Common/Buttons/Button';
import PadaiFooter from '../../components/LandingScreen/Footer/Footer';
import { useHistory } from 'react-router-dom';
import { getPlatform } from '../../utils/platform';
import { getUserProfile } from '../../utils/profileStorage';

const LandingScreen: React.FC = () => {
  const history = useHistory();
  const navigate = useIonRouter();
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const platformInfo = getPlatform();
    const platform = platformInfo.code;
    const imageUrl = platform === 'android' || platform === 'ios' ? `assets/images/landingScreens/vectorTwoBg.png` : `${import.meta.env.BASE_URL}/assets/images/landingScreens/vectorTwoBg.png`;
     setImageUrl(imageUrl);

    //  const getUserProfileData = async () => {
    //   try {
    //     const userProfile = await getUserProfile();
    //     if(userProfile.mobileNo && userProfile.name){
    //       navigate.push('/home','forward');
    //     }else{
    //       // N/a
    //     }
    //   }
    //   catch(error){
    //     console.error('Error getting user profile:', error);
    //   }
    //   finally{
    //     // setIsLoading(false);
    //   }
    //  }
    //  getUserProfileData();
  }, []);


  return (
    <IonPage className='padAIlandingScreen-page'>
      <IonImg src={imageUrl} alt="headerBanner" className='padAIvectorTwoBg' />
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
              navigate.push('/language', 'forward');

            }}
            color="warning"
            size="large"
            type="button"
            shape="round"
            fill="solid"
            expand="block"></PadaiButton>

          <PadaiButton children="Sign In"
            onClick={() => {
              navigate.push('/login', 'forward');
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
  
