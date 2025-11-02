import {  IonHeader, IonImg } from '@ionic/react';
import './Header.css';
// import logoImage from '/assets/logo/padai_logo.png';
import { getPlatform } from '../../../utils/platform';
import { useEffect } from 'react';
import { useState } from 'react';

const PadaiHeader: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const platformInfo = getPlatform();
    const platform = platformInfo.code;
    const imageUrl = platform === 'android' || platform === 'ios' ?  `${import.meta.env.BASE_URL}/assets/logo/padai_logo.png`:`/assets/logo/padai_logo.png` ;
    setImageUrl(imageUrl);
  }, []);
  return (
    <IonHeader className="padAIheader-container">
      <IonImg src={imageUrl} alt="logo" className='padAIlogo'
      />
    </IonHeader>
  );
};

export default PadaiHeader;
