import { IonImg } from '@ionic/react';
import './HeaderBanner.css';
import { getPlatform } from '../../../utils/platform';
import { useState } from 'react';
import { useEffect } from 'react';

const PadaiHeaderBanner: React.FC = () => {

    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        const platform = getPlatform();
        const imageUrl = platform.code === 'android' || platform.code === 'ios' ? `assets/images/landingScreens/heading.png` : `${import.meta.env.BASE_URL}/assets/images/landingScreens/heading.png`;
        setImageUrl(imageUrl);
    }, []);
    return (
        <IonImg src={imageUrl} alt="headerBanner" className='padAIheaderBanner' />
    );
};

export default PadaiHeaderBanner;
