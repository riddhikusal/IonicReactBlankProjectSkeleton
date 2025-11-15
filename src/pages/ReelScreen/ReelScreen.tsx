import React, { useState, useEffect, useRef } from 'react';
import { IonPage, IonContent, IonLoading } from '@ionic/react';
import { useToaster } from '../../hooks/toasterHooks/useToaster';
import './ReelScreen.css';
import Backheader from '../../components/Common/Backheader/Backheader';

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

const ReelScreen: React.FC = () => {
    const [reelVideos, setReelVideos] = useState<Video[]>(videos);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const { dangerToaster } = useToaster();

    // Initialize videos
    useEffect(() => {
        if (reelVideos.length === 0) {
            dangerToaster('No content available');
        }
    }, [reelVideos, dangerToaster]);

    // Handle video play/pause
    useEffect(() => {
        const currentVideo = videoRefs.current[currentIndex];
        const otherVideos = Object.values(videoRefs.current).filter(
            (video, index) => index !== currentIndex
        );

        if (currentVideo) {
            currentVideo.play().catch(() => {
                // Auto-play failed, user interaction needed
            });
        }

        // Pause other videos
        otherVideos.forEach((video) => {
            if (video) {
                video.pause();
            }
        });
    }, [currentIndex]);

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

    return (
        <IonPage>
            <IonContent className="reelScreen-content">
                {/* <Backheader /> */}
                <div className="reelContainer" ref={containerRef}>
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
                                loop
                                muted
                                playsInline
                                
                            />
                            <div className="reelOverlay">
                                <div className="reelTitle">{video.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <IonLoading isOpen={isLoading} message="Loading more content..." />
            </IonContent>
        </IonPage>
    );
};

export default ReelScreen;
