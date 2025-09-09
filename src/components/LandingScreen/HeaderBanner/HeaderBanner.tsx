import { IonImg } from '@ionic/react';
import './HeaderBanner.css';
import headingImage from '/assets/images/landingScreens/heading.png';

const PadaiHeaderBanner: React.FC = () => {
    return (
        <IonImg src={headingImage} alt="headerBanner" className='padAIheaderBanner'/>
    );
};

export default PadaiHeaderBanner;
