import { IonCard, IonCardContent, IonCol, IonRow, IonText } from '@ionic/react';
import React, { useState } from 'react';
import PadaiLanguageButtons from '../LanguageButtons/LanguageButtons';
import './LanguageContainer.css';
import PadaiButton from '../../Common/Buttons/Button';
import { useHistory } from 'react-router-dom';

const PadaiLanguageContainer: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const history = useHistory();
    return (
        <div className='padAIlanguage-container'>
            <IonCard className='padAILanguageCard'>
                <IonCardContent>
                    <IonText >
                        <p className='padAILanguageTitle'>Choose your language</p>
                        <p className='padAILanguageSubTitle'>Select your preferred language to continue</p>
                    </IonText>
                    <IonRow className='ion-margin-top'>
                        <IonCol size="6">
                            <PadaiLanguageButtons language="English" isActive={selectedLanguage === 'English'} onClick={setSelectedLanguage} />
                        </IonCol>
                        <IonCol size="6">
                            <PadaiLanguageButtons language="हिन्दी" isActive={selectedLanguage === 'हिन्दी'} onClick={setSelectedLanguage} />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6">
                            <PadaiLanguageButtons language="मराठी" isActive={selectedLanguage === 'मराठी'} onClick={setSelectedLanguage} />
                        </IonCol>
                        <IonCol size="6">
                            <PadaiLanguageButtons language="தமிழ்" isActive={selectedLanguage === 'தமிழ்'} onClick={setSelectedLanguage} />
                        </IonCol>
                    </IonRow>
                    <IonRow></IonRow>
                    <IonRow>
                        <IonCol size="6">
                            <PadaiLanguageButtons language="తెలుగు" isActive={selectedLanguage === 'తెలుగు'} onClick={setSelectedLanguage} />
                        </IonCol>
                        <IonCol size="6">
                            <PadaiLanguageButtons language="বাংলা" isActive={selectedLanguage === 'বাংলা'} onClick={setSelectedLanguage} />
                        </IonCol>
                    </IonRow>
                    <IonText>
                        <p className='padAILanguageSubTitle'>
                            You can change this later in settings
                        </p>
                    </IonText>
                   { selectedLanguage && <div className='ion-margin-top'>
                        <PadaiButton
                            onClick={(e) => {
                                e.preventDefault();
                                history.push('/login');
                            }}
                            color='warning'
                            size='large'
                            type='button'
                            fill='solid'
                            expand='block'
                        >
                            Continue
                        </PadaiButton>
                    </div>}
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default PadaiLanguageContainer;