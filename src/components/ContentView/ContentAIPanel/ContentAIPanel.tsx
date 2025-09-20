import { IonButton, IonButtons, IonChip, IonCol, IonContent, IonIcon, IonImg, IonModal, IonRow, IonText, IonTextarea } from '@ionic/react';
import './ContentAIPanel.css';
import { ellipsisVertical, language, mic, pause, play, playForward, searchOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import CustomSheetModal from '../../Common/CustomSheetModal/CustomSheetModal';
const PadAIContentAIPanel = () => {
    const [showSelectedText, setShowSelectedText] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const modal = useRef<HTMLIonModalElement>(null);
    return (<>
        <div className='padAIcontentAIPanel-container-overlay'>
            {showSelectedText && <div className='padAIcontentAIPanel-description-container'>
                <IonText className='padAIcontentAIPanel-description-text'><p>
                    " Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium perferendis magni at illum, earum itaque quaerat impedit soluta, optio placeat! Ab ipsam earum ex sit praesentium vitae! Repellat saepe commodi laudantium atque, praesentium aliquam expedita corrupti necessitatibus eaque possimus."
                </p></IonText>
            </div>}
            <div className="padAIcontentAIPanel-container">
                <div className="padAIFooterFlexBtnContainer">
                    <IonButton
                        className="btnGradient"
                        fill='clear'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <IonImg src={'/assets/images/contentScreens/aiAsk.png'} alt='ask' />
                        <IonText>Ask</IonText>
                    </IonButton>
                    <IonButton className='padAIFooterFlexBtn' fill='clear' > <IonIcon icon={play} className='footericons' ></IonIcon></IonButton>
                    <IonButton className='padAIFooterFlexBtn' fill='clear' > <IonIcon icon={pause} className='footericons' ></IonIcon></IonButton>
                    <IonButton className='padAIFooterFlexBtn' fill='clear' > <IonIcon icon={searchOutline} className='footericons' ></IonIcon></IonButton>
                    <IonButton className='padAIFooterFlexBtn' fill='clear' > <IonIcon icon={language} className='footericons' ></IonIcon></IonButton>
                    <IonButton className='padAIFooterFlexBtn' fill='clear' > <IonIcon icon={mic} className='footericons'></IonIcon></IonButton>
                    {/* <IonButton className='padAIFooterFlexBtn'  fill='clear' > <IonIcon icon={ellipsisVertical} className='footericons'></IonIcon></IonButton> */}
                </div>
            </div>
        </div>
        <CustomSheetModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />
    </>

    )
}

export default PadAIContentAIPanel;

// id="open-modal"