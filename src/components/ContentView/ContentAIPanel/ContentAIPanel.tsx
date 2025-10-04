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
            {/* {showSelectedText && <div className='padAIcontentAIPanel-description-container'>
                <IonText className='padAIcontentAIPanel-description-text'><p>
                    " Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium perferendis magni at illum, earum itaque quaerat impedit soluta, optio placeat! Ab ipsam earum ex sit praesentium vitae! Repellat saepe commodi laudantium atque, praesentium aliquam expedita corrupti necessitatibus eaque possimus."
                </p></IonText>
            </div>} */}
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
            selectedText={'Lorem ipsum dolor sit amet consectetur adipisicing elit. In, nihil voluptas qui voluptatum laborum officiis quidem facere deleniti aliquid quia iusto modi nam reprehenderit animi sequi molestiae consectetur consequatur. Natus, sunt doloribus, aperiam vero molestiae mollitia tempora aut cupiditate est suscipit magni pariatur amet nam voluptatum error eos quisquam minima culpa repellendus. Nulla nihil optio assumenda eum excepturi omnis, earum quidem. Laborum corporis accusamus nobis reprehenderit? Ea reprehenderit at eaque. Nihil, iste facilis saepe impedit, vero quos repellat enim nostrum praesentium, dolore ipsa voluptates vel quo aspernatur ex ullam asperiores alias minus voluptas obcaecati rerum quaerat! Nihil iste quod error!'}
        />
    </>

    )
}

export default PadAIContentAIPanel;

// id="open-modal"