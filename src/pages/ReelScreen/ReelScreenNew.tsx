import React, { useState, useEffect, useRef } from 'react';
import { IonPage, IonContent, IonLoading, IonText, IonButton, IonIcon } from '@ionic/react';
import { useToaster } from '../../hooks/toasterHooks/useToaster';
import { arrowBackOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import './ReelScreen.css';
import Backheader from '../../components/Common/Backheader/Backheader';

interface Video {
    id: number;
    title: string;
    url: string;
}

export interface IReelData {
    id: number;
    subject:string;
    reels:Video[];
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

const reelsData:IReelData[]=[{
    id:1,
    subject:'Science',
    reels:[...videos,...videos,...videos]
},
{
    id:2,
    subject:'Math',
    reels:[...videos,...videos]
},
{
    id:3,
    subject:'English',
    reels:[...videos,...videos,...videos,...videos]
}]



const ReelNewScreen: React.FC = () => {
    const navigate = useIonRouter();
    const [selectedSubject, setSelectedSubject] = useState<IReelData>(reelsData[0]);
    const [reelVideos, setReelVideos] = useState<Video[]>(reelsData[0].reels);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [videoProgress, setVideoProgress] = useState<{ [key: number]: number }>({});
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const { dangerToaster } = useToaster();

    // Update videos when subject changes
    useEffect(() => {
        if (selectedSubject) {
            setReelVideos(selectedSubject.reels);
            setCurrentIndex(0);
            setVideoProgress({});
        }
    }, [selectedSubject]);

    // Initialize videos
    useEffect(() => {
        if (reelVideos.length === 0) {
            dangerToaster('No content available');
        }
    }, [reelVideos, dangerToaster]);

    // Handle video play/pause and progress tracking
    useEffect(() => {
        const currentVideo = videoRefs.current[currentIndex];
        const otherVideos = Object.values(videoRefs.current).filter(
            (video, index) => index !== currentIndex
        );

        // Clear previous progress interval
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        if (currentVideo) {
            // Reset progress for current video
            setVideoProgress(prev => ({ ...prev, [currentIndex]: 0 }));

            // Set up progress tracking
            const updateProgress = () => {
                if (currentVideo && !currentVideo.paused && currentVideo.duration) {
                    const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
                    setVideoProgress(prev => ({ ...prev, [currentIndex]: Math.min(progress, 100) }));
                }
            };

            const handleVideoEnd = () => {
                const currentIdx = currentIndex;
                const videosLength = reelVideos.length;
                if (currentIdx < videosLength - 1) {
                    setTimeout(() => {
                        setCurrentIndex(currentIdx + 1);
                    }, 300);
                }
            };

            // Track video time updates
            currentVideo.addEventListener('timeupdate', updateProgress);
            currentVideo.addEventListener('ended', handleVideoEnd);

            // Play current video
            if (!isPaused) {
                currentVideo.play().catch(() => {
                    // Auto-play failed, user interaction needed
                });
            }

            // Cleanup
            return () => {
                currentVideo.removeEventListener('timeupdate', updateProgress);
                currentVideo.removeEventListener('ended', handleVideoEnd);
            };
        }

        // Pause other videos
        otherVideos.forEach((video) => {
            if (video) {
                video.pause();
            }
        });
    }, [currentIndex, reelVideos.length, isPaused]);

    // Handle scroll/gesture navigation
    const handleScroll = (event: WheelEvent) => {
        if (isLoading) return;

        event.preventDefault();
        const delta = event.deltaY;

        if (delta > 0 && currentIndex < reelVideos.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (delta < 0 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Handle touch/swipe navigation
    const handleTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
        touchEndY.current = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY.current;

        if (isLoading) return;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < reelVideos.length - 1) {
                // Swipe up
                setCurrentIndex(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe down
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleScroll, { passive: false });
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('wheel', handleScroll);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [currentIndex, isLoading, reelVideos.length]);

    // Simulate loading more videos (infinite scroll)
    const loadMoreVideos = async () => {
        if (currentIndex >= reelVideos.length - 1) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                const moreVideos = [
                    ...reelVideos,
                    ...reelVideos, // Duplicate for demo
                ];
                setReelVideos(moreVideos);
                setIsLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        if (currentIndex >= reelVideos.length - 2) {
            loadMoreVideos();
        }
    }, [currentIndex]);

    if (reelVideos.length === 0) {
        return (
            <IonPage>
                <IonContent className="reelScreen-content-empty">
                    <div className="reelScreen-empty">
                        <p>No content available</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const handleSubjectSelect = (subject: IReelData) => {
        setSelectedSubject(subject);
        setCurrentIndex(0);
    };

    const handleVideoClick = () => {
        const currentVideo = videoRefs.current[currentIndex];
        if (currentVideo) {
            if (currentVideo.paused) {
                currentVideo.play();
                setIsPaused(false);
            } else {
                currentVideo.pause();
                setIsPaused(true);
            }
        }
    };

    return (
        <IonPage>
            {/* <Backheader forReelScreen={true} /> */}
            <IonContent className="reelScreen-content">
                {/* Subject Filter - Horizontal Scroll */}
                <div className="subject-filter-container">
                    <IonButton
                        fill="clear"
                        className="subject-filter-back-button"
                        onClick={() => navigate.goBack()}
                    >
                        <IonIcon icon={arrowBackOutline} />
                    </IonButton>
                    <div className="subject-filter-scroll">
                        {reelsData.map((subject) => (
                            <IonButton
                                key={subject.id}
                                fill={selectedSubject.id === subject.id ? 'solid' : 'outline'}
                                className={`subject-filter-button ${selectedSubject.id === subject.id ? 'active' : 'inactive'}`}
                                onClick={() => handleSubjectSelect(subject)}
                            >
                                <IonText>{subject.subject}</IonText>
                            </IonButton>
                        ))}
                    </div>
                </div>

                {/* Progress Chips - WhatsApp Status Style */}
                {reelVideos.length > 0 && (
                    <div className="progress-chips-container">
                        {reelVideos.map((_, index) => (
                            <div
                                key={index}
                                className={`progress-chip ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <div
                                    className="progress-chip-fill"
                                    style={{
                                        width: index === currentIndex
                                            ? `${videoProgress[index] || 0}%`
                                            : index < currentIndex
                                            ? '100%'
                                            : '0%',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Reel Container */}
                <div className="reelContainer" ref={containerRef} onClick={handleVideoClick}>
                    {reelVideos.map((video, index) => (
                        <div
                            key={`${video.id}-${index}`}
                            className={`reelItem ${index === currentIndex ? 'active' : ''}`}
                            style={{
                                transform: `translateY(${(index - currentIndex) * 100}%)`,
                            }}
                        >
                            <video
                                ref={(el) => {
                                    if (el) videoRefs.current[index] = el;
                                }}
                                className="reelVideo"
                                src={video.url}
                                loop={false}
                                muted
                                playsInline
                            />
                            <div className="reelOverlay">
                                <div className="reelTitle">{video.title}</div>
                            </div>
                            {isPaused && index === currentIndex && (
                                <div className="play-pause-indicator">
                                    <IonText>⏸</IonText>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <IonLoading isOpen={isLoading} message="Loading more content..." />
            </IonContent>
        </IonPage>
    );
};

export default ReelNewScreen;
