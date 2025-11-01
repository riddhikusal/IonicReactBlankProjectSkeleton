import { IonCol, IonContent, IonHeader, IonImg, IonPage, IonRow, IonIcon, IonText, IonAccordion, IonItem, IonLabel, IonAccordionGroup, useIonRouter, IonThumbnail, IonButtons, IonButton, useIonViewWillEnter } from "@ionic/react";
import PadAIBackheader from "../../components/Common/Backheader/Backheader";
import PadAIChapterContainer from "../../components/HomeScreen/ChapterContainer/ChapterContainer";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { arrowBack, arrowForward, arrowRedoOutline, bookOutline, cloudDownloadOutline, downloadOutline, logoYoutube, playCircleOutline } from "ionicons/icons";

// Mock videos data (same as ReelScreen)
interface Video {
    id: number;
    title: string;
    url: string;
}

const videos: Video[] = [
    {
        id: 1,
        title: "Short 1",
        url: "https://media.istockphoto.com/id/2089020832/video/young-female-university-student-reading-a-book-at-campus.mp4?s=mp4-640x640-is&k=20&c=0uEpKNZCuvj4s7y9fx-TXrBYoakN8RgTcARJlHuipH8=",
    },
    {
        id: 2,
        title: "Short 2",
        url: "https://media.istockphoto.com/id/2216008266/video/spinning-magnets-in-motion.mp4?s=mp4-640x640-is&k=20&c=ZI7tbcxBknUIAobzR0mFT2XbqDVdFW-WVOzJElmI5MM=",
    },
    {
        id: 3,
        title: "Short 3",
        url: "https://media.istockphoto.com/id/2173244346/video/vertical-video-a-patient-undergoes-an-mri-or-ct-scan-as-doctors-review-images-in-a-modern.mp4?s=mp4-640x640-is&k=20&c=Tp1EsiDjsJRpBygP9nx3mP5_JLnetm1jy9DWAd73Kd8=",
    },
];
import './ChapterDetailsScreen.css';
import { IChapterResources, IGetChapterResourcesRequest, IResourceItem } from "../../api/contentApi/contentApi.interface";
import { GetChapterResources } from "../../services/homeService";
import { useToaster } from "../../hooks/toasterHooks/useToaster";
import { useChapterStore } from "../../services/store/chapter.store";
import vectoreBgImage from '/assets/images/dashboardScreen/topVectorOne.png';
import logoImage from '/assets/logo/padai_logo.png';
import TextReaderImage from '/assets/images/chapterResources/pdf.png';
import VideoExplainerImage from '/assets/images/chapterResources/video.png';
import QuestionAnswerImage from '/assets/images/chapterResources/question.png';
import QuizImage from '/assets/images/chapterResources/speech-bubble.png';
import FlashcardImage from '/assets/images/chapterResources/flash-card.png';
import NotesReferencesImage from '/assets/images/chapterResources/pen-and-paper.png';
import React from "react";

const chapter = {
    chapterImage: '/assets/images/chapters/Ch01.jpeg',
    chapterName: 'Chemical Reactions and Equations',
    lastReadDateTime: 'Last Read: 10/09/2025',
}



const PadAIChapterDetailsScreen: React.FC = () => {
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const setContentLoading = useChapterStore((state) => state.setContentLoading);
    const setSelectedChapterResources = useChapterStore((state) => state.setSelectedChapterResources);
    const setContentLoaded = useChapterStore((state) => state.setContentLoaded);
    const setAudioIsPlaying = useChapterStore((state) => state.setAudioIsPlaying);
    const { id } = useParams<{ id: string }>();
    const navigate = useIonRouter();
    const location = useLocation();

    // Method 1: Get from route parameters (recommended for /chapter-details/:id)
    const chapterIdFromRoute = id;

    // Method 2: Get from query parameters (fallback for /chapter-details?id=123)
    const searchParams = new URLSearchParams(location.search);
    const chapterIdFromQuery = searchParams.get('id');

    // Use route parameter first, then fallback to query parameter
    const chapterId = chapterIdFromRoute || chapterIdFromQuery;


    const [chapterResources, setChapterResources] = useState<IChapterResources | null>(null);
    const [loading, setLoading] = useState(false);
    const { dangerToaster } = useToaster();

    const getChapterResouces = async () => {
        try {
            setLoading(true);
            console.log('ChapterId from route:', chapterIdFromRoute);
            console.log('ChapterId from query:', chapterIdFromQuery);
            console.log('Final chapterId:', chapterId);
            console.log('Current location:', location.pathname, location.search);

            if (chapterId) {
                let data: IGetChapterResourcesRequest = {
                    chapterId: Number(chapterId),
                    language: 'en'
                }
                const res = await GetChapterResources(data);
                if (res.responseStatus === 'DATA_FOUND') {
                    setChapterResources(res.data as IChapterResources);
                } else {
                    setChapterResources(null);
                    dangerToaster(res.message);
                    navigate.push('/home');
                }
            } else {
                setChapterResources(null);
                dangerToaster('Chapter ID not found. Please try again.');
                console.error('ChapterId is null or undefined');
                // Don't redirect immediately, let user see the error
            }
        } catch (error) {
            console.error('Error fetching chapter resources:', error);
            setChapterResources(null);
            dangerToaster('Failed to load chapter resources');
        } finally {
            setLoading(false);
        }
    }
    const getChapterImage = (resource: IResourceItem, key: string) => {
        if (key === 'BOOK READER') return TextReaderImage;
        // else if(key === 'VIDEO EXPLAINERS') '/assets/images/chapterResources/youtube.png';
        else if (key === 'VIDEO EXPLAINERS') return VideoExplainerImage;
        else if (key === 'QUESTION ANSWERS') return QuestionAnswerImage;
        else if (key === 'QUIZ') return QuizImage;
        else if (key === 'FLASHCARDS') return FlashcardImage;
        else if (key === 'NOTES & REFERENCES') return NotesReferencesImage;
    }
    useEffect(() => {
        setContentLoaded?.(false);
        setAudioIsPlaying?.(false);
        console.log('useEffect triggered with chapterId:', chapterId);
        if (chapterId) {
            getChapterResouces();
        } else {
            console.warn('ChapterId is null, not fetching resources');
        }
    }, [chapterId]);


    useIonViewWillEnter(() => {
        setContentLoading?.(false);
        setContentLoaded?.(false);
        setAudioIsPlaying?.(false);
    });

    return (
        <IonPage>
            <PadAIBackheader />
            <IonImg src={vectoreBgImage} alt="headerBanner" className='padAIvectorTwoBg' />

            <IonHeader>
                <PadAIChapterContainer
                    key={'ChapterDetails'}
                    id={1}
                    chapterImage={chapterInfo.image}
                    chapterName={chapterInfo.title}
                    lastReadDateTime={''}
                    chapterSubject={'Science'}
                    showStarIcon={true}
                    showArrowIcon={false}
                    index={1}
                />
            </IonHeader>
            <IonContent className="padAIChapterDetailsScreenContent">
                {/* reels section */}
                <div className="reels-preview-section">
                    <IonText className="reels-section-title">
                        <h3 style={{ margin: '15px 0 10px 15px', fontWeight: '600' }}>Educational Reels</h3>
                    </IonText>
                    <div className="reels-preview-container">
                        {videos.slice(0, 3).map((video, index) => (
                            <div
                                key={video.id}
                                className="reel-preview-card"
                                onClick={() => navigate.push('/reels', 'forward')}
                            >
                                <div className="reel-preview-thumbnail">
                                    <video
                                        src={video.url}
                                        muted
                                        playsInline
                                        className="reel-preview-video"
                                    />
                                    <div className="reel-preview-overlay">
                                        <IonIcon icon={playCircleOutline} className="reel-play-icon" />
                                    </div>
                                </div>
                                <IonText className="reel-preview-title">{video.title}</IonText>
                            </div>
                        ))}
                        <div
                            className="reel-preview-card reel-view-more-card"
                            onClick={() => navigate.push('/reels', 'forward')}
                        >
                            <div className="reel-view-more-content">
                                <IonIcon icon={arrowForward} className="reel-view-more-icon" />
                                <IonText className="reel-view-more-text">View More</IonText>
                            </div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <IonText>Loading chapter resources...</IonText>
                    </div>
                )}

                {!chapterId && !loading && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <IonText color="danger">
                            <h3>Chapter ID not found</h3>
                            <p>Please navigate back and try again.</p>
                        </IonText>
                    </div>
                )}

                {chapterId && !loading && chapterResources && (
                    <IonAccordionGroup className="padAIChapterDetailsScreenContentAccordionGroup">
                        {Object.keys(chapterResources).map((resource, index) => (
                            <IonAccordion value={resource} key={index} className="padAIChapterDetailsScreenContentAccordionBox">
                                <IonItem slot="header" lines="none">
                                    <IonThumbnail slot="start" className="padAIChapterDetailsScreenContentAccordionThumbnail">
                                        <IonImg src={getChapterImage(chapterResources[resource as keyof IChapterResources][0], resource)} alt="chapterImage" className="resourceContainerimg" />
                                    </IonThumbnail>
                                    <IonLabel>{resource}</IonLabel>
                                </IonItem>
                                <div className="padAIChapterDetailsScreenContentAccordion" slot="content">
                                    {chapterResources[resource as keyof IChapterResources].map((resourceItem, index) => (
                                        <IonItem lines="none" color={'light'} className="padAIChapterDetailsScreenContentAccordionItem">
                                            <IonLabel key={index}>{resourceItem.name}</IonLabel>
                                            {resource == 'BOOK READER' && <IonButtons>
                                                <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}

                                                    onClick={() => {
                                                        setSelectedChapterResources?.(resourceItem);
                                                        navigate.push(`/pdf-content`, 'forward');
                                                    }}
                                                > <IonIcon icon={cloudDownloadOutline} /></IonButton>
                                                <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}
                                                    onClick={() => {
                                                        setSelectedChapterResources?.(resourceItem);
                                                        navigate.push(`/pdf-content`, 'forward');
                                                    }}
                                                > <IonIcon icon={arrowRedoOutline} /></IonButton>
                                            </IonButtons>
                                            }
                                            {resource == 'FLASHCARDS' && <IonButtons>
                                                <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}

                                                    onClick={() => {
                                                        setSelectedChapterResources?.(resourceItem);
                                                        navigate.push(`/flash-content`, 'forward');
                                                    }}
                                                > <IonIcon icon={arrowRedoOutline} /></IonButton>
                                            </IonButtons>
                                            }
                                            {resource == 'NOTES & REFERENCES' && <IonButtons>
                                                <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}
                                                    onClick={() => {
                                                        setSelectedChapterResources?.(resourceItem);
                                                        navigate.push(`/html-content`, 'forward');
                                                    }}
                                                > <IonIcon icon={arrowRedoOutline} /></IonButton>
                                            </IonButtons>
                                            }
                                            {resource == 'QUESTION ANSWERS' && <IonButtons>
                                                <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}
                                                    onClick={() => {
                                                        setSelectedChapterResources?.(resourceItem);
                                                        navigate.push(`/question-answer-content`, 'forward');
                                                    }}
                                                > <IonIcon icon={arrowRedoOutline} /></IonButton>
                                            </IonButtons>
                                            }
                                            {resource == 'QUIZ' && <IonButtons>
                                                <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}
                                                    onClick={() => {
                                                        setSelectedChapterResources?.(resourceItem);
                                                        navigate.push(`/quiz-content`, 'forward');
                                                    }}
                                                > <IonIcon icon={arrowRedoOutline} /></IonButton>
                                            </IonButtons>
                                            }
                                            {resource == 'VIDEO EXPLAINERS' && <IonButtons>
                                                <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}
                                                    onClick={() => {
                                                        setSelectedChapterResources?.(resourceItem);
                                                        if (resourceItem.contentType === 'video') {
                                                            navigate.push(`/video-content`, 'forward');
                                                        } else if (resourceItem.contentType === 'youtube-video') {
                                                            navigate.push(`/youtube-content`, 'forward');
                                                        }
                                                    }}
                                                > <IonIcon icon={resourceItem.contentType === 'video' ? playCircleOutline : logoYoutube} /></IonButton>
                                            </IonButtons>
                                            }
                                        </IonItem>
                                    ))}
                                </div>
                            </IonAccordion>
                        ))}

                        {/* Test For AudioR */}
                        {/* {chapterResources['BOOK READER'] && chapterResources['BOOK READER'].length > 0 && ( */}
                        <IonAccordion value="AUDIO READER" key="AUDIO READER" className="padAIChapterDetailsScreenContentAccordionBox">
                            <IonItem slot="header" lines="none">
                                <IonThumbnail slot="start" className="padAIChapterDetailsScreenContentAccordionThumbnail">
                                    <IonImg src={'/assets/images/chapterResources/pdf.png'} alt="chapterImage" className="resourceContainerimg" />
                                </IonThumbnail>
                                <IonLabel>Audio Reader HTML Content</IonLabel>
                            </IonItem>
                            <div className="padAIChapterDetailsScreenContentAccordion" slot="content">
                                <IonItem lines="none" color={'light'} className="padAIChapterDetailsScreenContentAccordionItem">
                                    <IonLabel slot="start">Audio Reader HTML Content</IonLabel>
                                    <IonButtons slot="end">
                                        <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}
                                            onClick={() => {
                                                navigate.push(`/audio-reader-html-content`, 'forward');
                                            }}
                                        > <IonIcon icon={arrowRedoOutline} /></IonButton>
                                    </IonButtons>
                                </IonItem>
                            </div>

                        </IonAccordion>
                        {/* // )} */}
                    </IonAccordionGroup>
                )}

                {/* <IonRow>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/pdf.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Text Book Link
                        </IonText>
                       </div>
                    </IonCol>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/pdf.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Text Book Link - Hindi
                        </IonText>
                       </div>
                    </IonCol>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/youtube.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Youtube
                        </IonText>
                       </div>
                    </IonCol>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/video.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Text Book Link - Hindi
                        </IonText>
                       </div>
                    </IonCol>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/question.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Text Book Link - Hindi
                        </IonText>
                       </div>
                    </IonCol>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/speech-bubble.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Text Book Link - Hindi
                        </IonText>
                       </div>
                    </IonCol>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/pencil.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Text Book Link - Hindi
                        </IonText>
                       </div>
                    </IonCol>
                    <IonCol size="4" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <div className="resourceContainer">
                       <IonImg src={'/assets/images/chapterResources/pen-and-paper.png'} alt="chapterImage"  className="resourceContainerimg"/>
                        <IonText>
                            Text Book Link - Hindi
                        </IonText>
                       </div>
                    </IonCol>
                </IonRow> */}
            </IonContent>
        </IonPage>
    )
}

export default PadAIChapterDetailsScreen;

function useFocusEffect(arg0: () => void) {
    throw new Error("Function not implemented.");
}
