import { IonButton, IonButtons, IonChip, IonCol, IonContent, IonIcon, IonImg, IonModal, IonRow, IonText, IonTextarea } from '@ionic/react';
import './ContentAIPanel.css';
import { ellipsisVertical, mic, play, playForward, searchOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
const PadAIContentAIPanel = () => {
    const [showSelectedText, setShowSelectedText] = useState<boolean>(false);
    const modal = useRef<HTMLIonModalElement>(null);
    return (<>
        <div className='padAIcontentAIPanel-container-overlay'>
            {showSelectedText && <div className='padAIcontentAIPanel-description-container'>
                <IonText className='padAIcontentAIPanel-description-text'><p>
                    " Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium perferendis magni at illum, earum itaque quaerat impedit soluta, optio placeat! Ab ipsam earum ex sit praesentium vitae! Repellat saepe commodi laudantium atque, praesentium aliquam expedita corrupti necessitatibus eaque possimus."
                </p></IonText>
            </div>}
            <div className="padAIcontentAIPanel-container">
                <IonRow>
                    <IonCol size='3'>
                        <IonButton  className="btnGradient" fill='clear' onClick={() => { setShowSelectedText(!showSelectedText) }}>
                            <IonImg src={'/assets/images/contentScreens/aiAsk.png'} alt='ask' />
                            <IonText>Ask</IonText>
                        </IonButton>
                    </IonCol>
                    <IonCol size='6'>
                        <IonTextarea
                            placeholder='Ask anything ..'
                        ></IonTextarea>
                    </IonCol>
                    <IonCol size='3'>
                        <IonButtons>
                            <IonButton fill='clear' > <IonIcon icon={play} className='footericons' ></IonIcon></IonButton>
                            <IonButton fill='clear' > <IonIcon icon={mic} className='footericons'></IonIcon></IonButton>
                            <IonButton fill='clear' > <IonIcon icon={ellipsisVertical} className='footericons'></IonIcon></IonButton>
                        </IonButtons>
                    </IonCol>
                </IonRow>
            </div>
        </div>
        <IonModal 
            ref={modal} 
            trigger="open-modal" 
            initialBreakpoint={0.25} 
            breakpoints={[0, 0.25, 0.5, 0.75]}
            style={{ '--z-index': '999' }}
        >
            <IonContent className="ion-padding">

            </IonContent>
        </IonModal>
    </>

    )
}

export default PadAIContentAIPanel;

// id="open-modal"