import {  IonHeader, IonImg } from '@ionic/react';
import './Header.css';
import logoImage from '/assets/logo/padai_logo.png';

const PadaiHeader: React.FC = () => {
  return (
    <IonHeader className="padAIheader-container">
      <IonImg src={logoImage} alt="logo" className='padAIlogo'
      />
    </IonHeader>
  );
};

export default PadaiHeader;
