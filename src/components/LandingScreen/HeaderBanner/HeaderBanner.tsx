import { IonImg } from '@ionic/react';
import './HeaderBanner.css';

const PadaiHeaderBanner: React.FC = () => {
    return (
        <IonImg   src={`${import.meta.env.BASE_URL}assets/images/landingScreens/heading.png`} alt="headerBanner" className='padAIheaderBanner'/>
    );
};

export default PadaiHeaderBanner;
