import React from 'react';
import PadaiButton from '../../Common/Buttons/Button';
import { IonIcon, IonText } from '@ionic/react';
import { checkmark } from 'ionicons/icons';

import './LanguageButtons.css';

interface IPadaiLanguageButtonsProps {
    language: string;
    isActive: boolean;
    onClick: (e: any) => void;
}


const PadaiLanguageButtons: React.FC<IPadaiLanguageButtonsProps> = ({ language, isActive, onClick }) => {
    return (
        <PadaiButton
            onClick={(e) => {
                onClick(language);
            }}
            color={isActive ? 'warning' : 'light'}
            size="large"
            type="button"
            fill="solid"
            expand="block"
        >
          <div className='padAILanguageButton-container'>
            <IonText> {language} </IonText>
            {isActive && <IonIcon icon={checkmark} />}
          </div>
        </PadaiButton>
    );
};

export default PadaiLanguageButtons;