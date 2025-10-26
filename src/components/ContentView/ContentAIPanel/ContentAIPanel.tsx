import { IonButton, IonButtons, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonImg, IonModal, IonRow, IonText, IonTextarea } from '@ionic/react';
import './ContentAIPanel.css';
import { banOutline, chevronUpCircle, colorPalette, documentOutline, ellipsisVertical, globe, language, mic, pause, play, playForward, searchOutline, sparkles, volumeHighOutline, volumeMuteOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import CustomSheetModal from '../../Common/CustomSheetModal/CustomSheetModal';
import { useChapterStore } from '../../../services/store/chapter.store';
import { useChatsStore } from '../../../services/store/chats.store';
const PadAIContentAIPanel = () => {
    const [showSelectedText, setShowSelectedText] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const modal = useRef<HTMLIonModalElement>(null);
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const setIsChatOpen = useChatsStore((state: any) => state.setIsChatOpen);
    const setAudioIsPlaying = useChapterStore((state) => state.setAudioIsPlaying);
    const setContentLoaded = useChapterStore((state) => state.setContentLoaded);
    const setContentLoading = useChapterStore((state) => state.setContentLoading);


    const handleClearContentLoadingFlag = () => {
        setContentLoading?.(false);
        setContentLoaded?.(false);
        setAudioIsPlaying?.(false);
    }

    const handleLoadContent = () => {
        setContentLoading?.(true);
        setContentLoaded?.(false);
        setAudioIsPlaying?.(false);
    }

    // const handlePlayAndPause = (clearContentLoadingFlag: boolean = false) => {
    //     console.log('clearContentLoadingFlag', clearContentLoadingFlag);
    //     if (clearContentLoadingFlag) {
    //         setContentLoaded?.(false);
    //         setAudioIsPlaying?.(false);
    //         return;
    //     }
    // }

    const handlePlayAndPause = (clearContentLoadingFlag: boolean = false) => {
        chapterInfo.audioIsPlaying = !chapterInfo.audioIsPlaying;
        console.log('chapterInfo.audioIsPlaying', chapterInfo.audioIsPlaying);
        setAudioIsPlaying?.(chapterInfo.audioIsPlaying);
    }

    useEffect(() => {
        console.log('chapterInfo.contentLoaded', chapterInfo.contentLoaded, chapterInfo.audioIsPlaying);
    }, [chapterInfo.contentLoaded, chapterInfo.audioIsPlaying]);

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
                        onClick={() => {
                            setIsModalOpen(true);
                            setIsChatOpen?.(true);
                        }}
                    >
                        {/* <IonImg src={'/assets/images/contentScreens/aiAsk.png'} alt='AI' /> */}
                        <IonIcon icon={sparkles}></IonIcon>
                        <IonText>AI</IonText>
                    </IonButton>
                    <div className={`padAIFooterFlexBtnContainer aiFooterIcons ${!chapterInfo.contentLoaded ? 'aiFooterIconsModify' : ''}`} id={!chapterInfo.contentLoaded ? 'aiFooterIconsModify' : ''}>
                        {!chapterInfo.contentLoaded && <IonButton className='padAIFooterFlexBtn no-border-right-redius' fill='clear' onClick={() => handleLoadContent()} > <IonIcon icon={volumeHighOutline} className='footericons' ></IonIcon></IonButton>}
                        {chapterInfo.contentLoaded && <IonButton className='padAIFooterFlexBtn no-border-right-redius' fill='clear' onClick={() => handleClearContentLoadingFlag()} > <IonIcon icon={banOutline} className='footericons' ></IonIcon></IonButton>}
                        {chapterInfo.contentLoaded && chapterInfo.audioIsPlaying && <IonButton className='padAIFooterFlexBtn no-border-right-redius no-border-left-redius' fill='clear' onClick={() => handlePlayAndPause(false)} >
                            <IonIcon icon={pause} className='footericons' ></IonIcon>
                        </IonButton>}
                        {chapterInfo.contentLoaded && !chapterInfo.audioIsPlaying && <IonButton className='padAIFooterFlexBtn no-border-right-redius no-border-left-redius' fill='clear' onClick={() => handlePlayAndPause(false)} >
                            <IonIcon icon={play} className='footericons' ></IonIcon>
                        </IonButton>}
                        <IonButton className='padAIFooterFlexBtn no-border-right-redius no-border-left-redius' fill='clear' > <IonIcon icon={searchOutline} className='footericons' ></IonIcon></IonButton>
                        <IonButton className='padAIFooterFlexBtn no-border-right-redius no-border-left-redius' fill='clear' > <IonIcon icon={language} className='footericons' ></IonIcon></IonButton>
                        <IonButton className='padAIFooterFlexBtn no-border-right-redius no-border-left-redius' fill='clear' > <IonIcon icon={mic} className='footericons'></IonIcon></IonButton>
                        {/* <IonButton className='padAIFooterFlexBtn no-border-left-redius'  fill='clear' > <IonIcon icon={ellipsisVertical} className='footericons'></IonIcon></IonButton> */}
                        <IonFab style={{ position: 'relative' }}>
                            <IonFabButton className='padAIFooterFlexBtn fbbtnmodify no-border-left-redius'>
                                <IonIcon icon={ellipsisVertical}></IonIcon>
                            </IonFabButton>
                            <IonFabList side="top">
                                <IonFabButton>
                                    <IonIcon icon={documentOutline}></IonIcon>
                                </IonFabButton>
                                <IonFabButton>
                                    <IonIcon icon={colorPalette}></IonIcon>
                                </IonFabButton>
                                <IonFabButton>
                                    <IonIcon icon={globe}></IonIcon>
                                </IonFabButton>
                            </IonFabList>
                        </IonFab>
                    </div>
                </div>
            </div>
        </div>
        <CustomSheetModal
            isOpen={isModalOpen}
            onClose={() => {
                setIsModalOpen(false);
                setIsChatOpen?.(false);
            }}
            selectedText={'Lorem ipsum dolor sit amet consectetur adipisicing elit. In, nihil voluptas qui voluptatum laborum officiis quidem facere deleniti aliquid quia iusto modi nam reprehenderit animi sequi molestiae consectetur consequatur. Natus, sunt doloribus, aperiam vero molestiae mollitia tempora aut cupiditate est suscipit magni pariatur amet nam voluptatum error eos quisquam minima culpa repellendus. Nulla nihil optio assumenda eum excepturi omnis, earum quidem. Laborum corporis accusamus nobis reprehenderit? Ea reprehenderit at eaque. Nihil, iste facilis saepe impedit, vero quos repellat enim nostrum praesentium, dolore ipsa voluptates vel quo aspernatur ex ullam asperiores alias minus voluptas obcaecati rerum quaerat! Nihil iste quod error!'}
        />
    </>

    )
}

export default PadAIContentAIPanel;

// id="open-modal"