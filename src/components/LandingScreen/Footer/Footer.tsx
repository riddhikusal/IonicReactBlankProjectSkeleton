import { IonHeader, IonImg } from '@ionic/react';
import './Footer.css';
import React from 'react';
import { getPlatform } from '../../../utils/platform';
    const PadaiFooter: React.FC = () => {
    const platform = getPlatform();
    return (
        <div className='padAIFooter-container'> 
            <IonImg src={`${import.meta.env.BASE_URL}assets/images/landingScreens/footer.png`} alt="logo" className='padAIFooterLogo'/>
            <div className='padAIFooterText-container'>
                <p>© 2025 Padai</p>
                <p>{getPlatform().code}</p>
            </div>
        </div>
    );
  };
  
  export default PadaiFooter;