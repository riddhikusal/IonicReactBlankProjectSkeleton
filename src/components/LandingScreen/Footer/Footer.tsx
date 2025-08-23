import { IonHeader, IonImg } from '@ionic/react';
import './Footer.css';
import React from 'react';
    const PadaiFooter: React.FC = () => {
    return (
        <div className='padAIFooter-container'> 
            <IonImg src="/assets/images/landingScreens/footer.png" alt="logo" className='padAIFooterLogo'/>
            <div className='padAIFooterText-container'>
                <p>© 2025 Padai. All rights reserved.</p>
            </div>
        </div>
    );
  };
  
  export default PadaiFooter;