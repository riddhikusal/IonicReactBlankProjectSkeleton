import {  IonHeader, IonImg } from '@ionic/react';
import './Header.css';

const PadaiHeader: React.FC = () => {
  return (
    <IonHeader className="padAIheader-container">
      <IonImg src="/assets/logo/padai_logo.png" alt="logo" className='padAIlogo'
      />
    </IonHeader>
  );
};

export default PadaiHeader;
