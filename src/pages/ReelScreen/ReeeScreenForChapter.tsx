import React, { useState, useEffect, useRef } from 'react';
import { IonPage, IonContent, IonLoading, IonText, IonButton, IonIcon, useIonViewWillEnter, useIonViewDidEnter } from '@ionic/react';
import { useToaster } from '../../hooks/toasterHooks/useToaster';
import { arrowBackOutline, chevronUpOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import './ReelScreen.css';
import Backheader from '../../components/Common/Backheader/Backheader';
import { useChapterStore } from '../../services/store/chapter.store';

interface Video {
    id: number;
    title: string;
    url: string;
}

export interface IReelData {
    id: number;
    subject: string;
    reels: Video[];
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

const reelsData: IReelData[] = [{
    id: 1,
    subject: 'Science',
    reels: [...videos, ...videos, ...videos]
},
{
    id: 2,
    subject: 'Math',
    reels: [...videos, ...videos]
},
{
    id: 3,
    subject: 'English',
    reels: [...videos, ...videos, ...videos, ...videos]
},
{
    id: 4,
    subject: 'History',
    reels: [...videos, ...videos, ...videos, ...videos]
},
{
    id: 5,
    subject: 'Geography',
    reels: [...videos, ...videos, ...videos, ...videos]
},
{
    id: 6,
    subject: 'Physics',
    reels: [...videos, ...videos, ...videos, ...videos]
},
{
    id: 7,
    subject: 'Chemistry',
    reels: [...videos, ...videos, ...videos, ...videos]
},
{
    id: 8,
    subject: 'Biology',
    reels: [...videos, ...videos, ...videos, ...videos]
},
]



const ReelsForChapterScreen: React.FC = () => {
    const navigate = useIonRouter();
    const [selectedSubject, setSelectedSubject] = useState<IReelData>();
    const [reelVideos, setReelVideos] = useState<Video[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [videoProgress, setVideoProgress] = useState<{ [key: number]: number }>({});
    const [isPaused, setIsPaused] = useState(false);
    const [dominantColor, setDominantColor] = useState<string>('#000000');
    const [blurImageUrl, setBlurImageUrl] = useState<string>('');
    const [showSwipeGuide, setShowSwipeGuide] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const blurCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const { dangerToaster } = useToaster();

    // store data
    const selectedChapterEduclips = useChapterStore((state) => state.selectedChapterEduclips);


    useIonViewDidEnter(() => {
        if (selectedChapterEduclips && selectedChapterEduclips.length > 0) {
            setSelectedSubject({
                id: 1,
                subject: 'Educlips',
                reels: (selectedChapterEduclips as any[]).map((educlip) => ({
                    id: educlip.id,
                    title: educlip.name || '',
                    url: educlip.url || '',
                })),
            })
            setReelVideos((selectedChapterEduclips as any[]).map((educlip) => ({
                id: educlip.id,
                title: educlip.name || '',
                url: educlip.url || '',
            })));
        } else {
            if (reelVideos.length === 0) {
                dangerToaster('No content available');
            }
        }
    });

    // useEffect(() => {
    //     if (selectedChapterEduclips && selectedChapterEduclips.length > 0) {
    //         setSelectedSubject({
    //             id: 1,
    //             subject: 'Educlips',
    //             reels: (selectedChapterEduclips as any[]).map((educlip) => ({
    //                 id: educlip.id,
    //                 title: educlip.name || '',
    //                 url: educlip.url || '',
    //             })),
    //         })
    //         setReelVideos((selectedChapterEduclips as any[]).map((educlip) => ({
    //             id: educlip.id,
    //             title: educlip.name || '',
    //             url: educlip.url || '',
    //         })));
    //     }
    // }, [selectedChapterEduclips]);


    // Show guide every time user visits the reel screen
    useEffect(() => {
        // Show guide after a short delay on every visit
        const timer = setTimeout(() => {
            setShowSwipeGuide(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []); // Empty dependency array - runs on mount

    // Auto-hide guide after 6 seconds (animation duration)
    // useEffect(() => {
    //     if (showSwipeGuide) {
    //         const timer = setTimeout(() => {
    //             setShowSwipeGuide(false);
    //         }, 6000); // Match animation duration
    //         return () => clearTimeout(timer);
    //     }
    // }, [showSwipeGuide]);

    // Hide guide when user swipes up (moves to next reel)
    useEffect(() => {
        if (showSwipeGuide && currentIndex > 0) {
            // User has swiped up, hide the guide
            setShowSwipeGuide(false);
        }
    }, [currentIndex, showSwipeGuide]);

    // Fix iOS viewport height on mount
    useEffect(() => {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        return () => {
            window.removeEventListener('resize', setViewportHeight);
            window.removeEventListener('orientationchange', setViewportHeight);
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, []);

    // Update videos when subject changes
    useEffect(() => {
        if (selectedSubject) {
            setReelVideos(selectedSubject.reels);
            setCurrentIndex(0);
            setVideoProgress({});
        }
    }, [selectedSubject]);

    // Initialize videos
    // useEffect(() => {
    //     if (reelVideos.length === 0) {
    //         dangerToaster('No content available');
    //     }
    // }, [reelVideos, dangerToaster]);

    // Extract dominant color and create blur background from video frame
    const extractDominantColor = (video: HTMLVideoElement) => {
        if (!video || !canvasRef.current || !blurCanvasRef.current) return;

        try {
            const canvas = canvasRef.current;
            const blurCanvas = blurCanvasRef.current;
            const ctx = canvas.getContext('2d');
            const blurCtx = blurCanvas.getContext('2d');
            if (!ctx || !blurCtx) return;

            const width = video.videoWidth || 100;
            const height = video.videoHeight || 100;

            canvas.width = width;
            canvas.height = height;
            blurCanvas.width = width;
            blurCanvas.height = height;

            ctx.drawImage(video, 0, 0, width, height);
            blurCtx.drawImage(video, 0, 0, width, height);

            // Create blurred image for background
            const blurImageData = blurCanvas.toDataURL('image/jpeg', 0.5);
            setBlurImageUrl(blurImageData);

            // Get image data for color extraction
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            // Sample pixels (every 10th pixel for performance)
            const colorCounts: { [key: string]: number } = {};
            const sampleRate = 10;

            for (let i = 0; i < data.length; i += 4 * sampleRate) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Skip very dark or very light pixels
                const brightness = (r + g + b) / 3;
                if (brightness < 30 || brightness > 225) continue;

                // Quantize colors to reduce variations
                const qr = Math.floor(r / 32) * 32;
                const qg = Math.floor(g / 32) * 32;
                const qb = Math.floor(b / 32) * 32;
                const colorKey = `${qr},${qg},${qb}`;

                colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
            }

            // Find most common color
            let maxCount = 0;
            let dominantColorKey = '0,0,0';
            for (const [color, count] of Object.entries(colorCounts)) {
                if (count > maxCount) {
                    maxCount = count;
                    dominantColorKey = color;
                }
            }

            const [r, g, b] = dominantColorKey.split(',').map(Number);
            const hexColor = `#${[r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('')}`;

            setDominantColor(hexColor);
        } catch (error) {
            console.error('Error extracting dominant color:', error);
        }
    };

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

            // Extract dominant color when video loads
            const handleLoadedData = () => {
                extractDominantColor(currentVideo);
            };

            // Set up progress tracking
            const updateProgress = () => {
                if (currentVideo && !currentVideo.paused && currentVideo.duration) {
                    const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
                    setVideoProgress(prev => ({ ...prev, [currentIndex]: Math.min(progress, 100) }));
                }
            };

            const handleVideoEnd = () => {
                // Replay the current video from the beginning instead of auto-advancing
                if (currentVideo) {
                    currentVideo.currentTime = 0;
                    setVideoProgress(prev => ({ ...prev, [currentIndex]: 0 }));
                    currentVideo.play().catch(() => {
                        // Auto-play failed, user interaction needed
                    });
                }
            };

            // Track video time updates
            currentVideo.addEventListener('timeupdate', updateProgress);
            currentVideo.addEventListener('ended', handleVideoEnd);
            currentVideo.addEventListener('loadeddata', handleLoadedData);

            // Extract color periodically
            const colorInterval = setInterval(() => {
                if (currentVideo && !currentVideo.paused) {
                    extractDominantColor(currentVideo);
                }
            }, 2000);

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
                currentVideo.removeEventListener('loadeddata', handleLoadedData);
                clearInterval(colorInterval);
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
            // loadMoreVideos();
        }
    }, [currentIndex]);

    // if (reelVideos.length === 0) {
    //     return (
    //         <IonPage>
    //             <IonContent className="reelScreen-content-empty">
    //                 <div className="reelScreen-empty">
    //                     <p>No content available</p>
    //                 </div>
    //             </IonContent>
    //         </IonPage>
    //     );
    // }

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
                {/* Subject Filter - Horizontal Scroll - Visible only when paused */}
                {isPaused && (
                    <div className="subject-filter-container">
                        <IonButton
                            fill="clear"
                            className="subject-filter-back-button"
                            onClick={() => navigate.goBack()}
                        >
                            <IonIcon icon={arrowBackOutline} />
                        </IonButton>
                        {/* <div className="subject-filter-scroll">
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
                        </div> */}
                    </div>
                )}

                {/* Progress Chips - WhatsApp Status Style - Visible only when paused */}
                {/* JUST Commented for now */}
                {/* {isPaused && reelVideos.length > 0 && (
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
                )} */}

                {/* Hidden canvases for color extraction and blur */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <canvas ref={blurCanvasRef} style={{ display: 'none' }} />

                {/* Swipe Guide Animation - First Visit Only - YouTube/Instagram Style */}
                {showSwipeGuide && !isPaused && (
                    <div className="swipe-guide-container">
                        <div className="swipe-guide-content">
                            <div className="swipe-guide-icon-container">
                                <div className="swipe-guide-icon">
                                    <IonIcon icon={chevronUpOutline} />
                                </div>
                                <div className="swipe-guide-arrows">
                                    <IonIcon icon={chevronUpOutline} className="swipe-guide-arrow" />
                                    <IonIcon icon={chevronUpOutline} className="swipe-guide-arrow" />
                                    <IonIcon icon={chevronUpOutline} className="swipe-guide-arrow" />
                                </div>
                            </div>
                            <IonText className="swipe-guide-text">Swipe up for next</IonText>
                        </div>
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
                                backgroundColor: index === currentIndex ? dominantColor : '#000000',
                            }}
                        >
                            {/* Blurred background layer */}
                            {index === currentIndex && (
                                <div
                                    className="reel-blur-background"
                                    style={{
                                        backgroundImage: blurImageUrl ? `url(${blurImageUrl})` : 'none',
                                        backgroundColor: dominantColor,
                                    }}
                                />
                            )}
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

export default ReelsForChapterScreen;
