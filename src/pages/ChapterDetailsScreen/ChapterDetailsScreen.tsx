import { IonCol, IonContent, IonHeader, IonImg, IonPage, IonRow, IonIcon, IonText, IonAccordion, IonItem, IonLabel, IonAccordionGroup, useIonRouter, IonThumbnail, IonButtons, IonButton, useIonViewWillEnter } from "@ionic/react";
import PadAIBackheader from "../../components/Common/Backheader/Backheader";
import PadAIChapterContainer from "../../components/HomeScreen/ChapterContainer/ChapterContainer";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { arrowBack, arrowForward, arrowRedoOutline, bookOutline, cloudDownloadOutline, downloadOutline, logoYoutube, playCircleOutline } from "ionicons/icons";

const dummyImageAddress = [
    [
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],
    [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],
    [
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],

    //
    [
        'https://www.shutterstock.com/image-vector/quiz-word-pop-art-comic-260nw-2420110745.jpg',
        'https://www.shutterstock.com/shutterstock/photos/1346231579/display_1500/stock-vector-illustration-of-stickman-kids-reading-a-book-with-a-question-mark-shaped-book-shelf-1346231579.jpg',
        'https://d1e4pidl3fu268.cloudfront.net/e5d7d87d-c3d6-4fff-8743-d659a8827273/Capture.crop_435x326_0,5.preview.PNG',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBtudbWgTsF2rIfj2YHZmBsM18hoUho_H4TgubDQEgVfN0nMbPxYFCrzOAA-VeNTxsAc4&usqp=CAU',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',

    ],
    [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],
    [
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],
    //
    [
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],
    [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],
    [
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
        'https://www.shutterstock.com/image-vector/cute-boy-girl-sitting-on-600nw-2486052883.jpg',
        'https://img.freepik.com/premium-vector/female-teacher-explains-tutorial-using-book-while-students-listen-engage-classroom-female-teacher-explaining-tutorial-with-book_538213-156343.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWmM0SUliqLTbAu2NpmBR9NUSq2hz2KD1xg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4azd32CMO3IK4stlvIU4EjNZ4666aXMeHw&s',
        'https://classroomclipart.com/image/static2/preview2/child-reading-book-on-floor-clipart-11057.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/219/741/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://static.vecteezy.com/system/resources/previews/004/217/309/non_2x/video-tutorials-background-illustration-watching-and-streaming-online-on-computer-about-education-knowledge-for-web-banner-brochures-poster-or-book-cover-vector.jpg',
        'https://img.freepik.com/premium-vector/woman-reads-book-online-audiobook-computer-internet-video-tutorial-a-a-a-a-oncept-distance-learning-digital-classroom-teacher-with-textbook_499739-792.jpg',
    ],

]
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
import PadAIChapterHeader from "../../components/ContentView/ChapterHeader/ChapterHeader";
import audioReaderImage from '/assets/images/chapterResources/speech-bubble.png';

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
    const setSelectedChapterEduclips = useChapterStore((state) => state.setSelectedChapterEduclips);
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
            // console.log('ChapterId from route:', chapterIdFromRoute);
            // console.log('ChapterId from query:', chapterIdFromQuery);
            // console.log('Final chapterId:', chapterId);
            // console.log('Current location:', location.pathname, location.search);

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
    const getChapterImage = (resource: IResourceItem | null, key: string) => {
        if (key === 'BOOK READER') return TextReaderImage;
        else if (key === 'AUDIO READER') return audioReaderImage;
        // else if(key === 'VIDEO EXPLAINERS') '/assets/images/chapterResources/youtube.png';
        else if (key === 'VIDEO EXPLAINERS') return VideoExplainerImage;
        else if (key === 'QUESTION ANSWERS') return QuestionAnswerImage;
        else if (key === 'QUIZ') return QuizImage;
        else if (key === 'FLASHCARDS') return FlashcardImage;
        else if (key === 'NOTES & REFERENCES') return NotesReferencesImage;
        else if (key === 'EDUCLIPS') return NotesReferencesImage;
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
            {/* <PadAIChapterHeader formCapterDetailsScreen={true} /> */}

            <IonContent className="padAIChapterDetailsScreenContent padAIContentScreen-content">

                <IonText className="ion-text-wrap padAIHomeScreenUserChapter-text-container" style={{ textOverflow: 'ellipsis' }}>
                    <p className='padAIHomeScreenUserChapter-text chapter-text' style={{ paddingBottom: '0px' }}>Chapter {chapterInfo.chapterNo}</p>
                    <p className='padAIHomeScreenUserChapter-text chapter-name'>{chapterInfo.title}</p>
                </IonText>

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
                {chapterId && !loading && chapterResources &&
                    (
                        Object.keys(chapterResources).map((resource, index) => (

                            <React.Fragment key={resource}>
                                <IonItem lines="none" className="padAIChapterDetailsScreenContentAccordionItemNew" style={{ marginTop: '7px', marginBottom: '7px' }}>
                                    <IonText slot="start" className="ion-text-wrap padAIHomeScreenUserChapter-text-container" style={{ textOverflow: 'ellipsis', fontWeight: '600' }}>
                                        {resource === 'BOOK READER' ? 'Book Reader' : resource === 'AUDIO READER' ? 'Audio Reader' : resource === 'VIDEO EXPLAINERS' ? 'Video Explainers' : resource === 'QUESTION ANSWERS' ? 'Question Answers' : resource === 'QUIZ' ? 'Quiz' : resource === 'FLASHCARDS' ? 'Flashcards' : resource === 'NOTES & REFERENCES' ? 'Notes & References' : resource === 'EDUCLIPS' ? 'Educlips' : ''}
                                    </IonText>
                                    {/* <IonButtons slot="end">
                                        <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}>
                                            <IonIcon icon={arrowRedoOutline} />
                                        </IonButton>
                                    </IonButtons> */}
                                </IonItem>
                                <div className="padAIChapterDetailsScreenContentAccordionnnEW resource-cards-container">
                                    {resource !== 'EDUCLIPS' && chapterResources[resource as keyof IChapterResources].map((resourceItem, indexnEW) => (
                                        <div
                                            key={`${resource}-${resourceItem.id || indexnEW}`}
                                            className="resource-card"
                                            onClick={() => {
                                                setSelectedChapterResources?.(resourceItem);
                                                if (resource === 'BOOK READER') {
                                                    navigate.push(`/pdf-content`, 'forward');
                                                } else if (resource === 'FLASHCARDS') {
                                                    navigate.push(`/flash-content`, 'forward');
                                                } else if (resource === 'NOTES & REFERENCES') {
                                                    navigate.push(`/html-content`, 'forward');
                                                } else if (resource === 'QUESTION ANSWERS') {
                                                    navigate.push(`/question-answer-content`, 'forward');
                                                } else if (resource === 'QUIZ') {
                                                    navigate.push(`/quiz-content`, 'forward');
                                                } else if (resource === 'VIDEO EXPLAINERS') {
                                                    if (resourceItem.contentType === 'video') {
                                                        navigate.push(`/video-content`, 'forward');
                                                    } else if (resourceItem.contentType === 'youtube-video') {
                                                        navigate.push(`/youtube-content`, 'forward');
                                                    }
                                                }
                                            }}
                                        >
                                            <div className="resource-card-image">
                                                <IonImg
                                                    // src={getChapterImage(resourceItem, resource)}
                                                    src={dummyImageAddress[index][indexnEW]}
                                                    alt={resourceItem.name}
                                                    className="resource-card-img"
                                                />
                                            </div>
                                            <div className="resource-card-title">
                                                <IonText className="resource-card-name">{resourceItem.name}</IonText>
                                            </div>
                                        </div>
                                    ))}
                                    {resource === 'EDUCLIPS' && <>
                                        <div className="reels-preview-section">
                                            <div className="reels-preview-container">
                                                {chapterResources[resource as keyof IChapterResources].map((video, index) => (
                                                    <div
                                                        key={video.id}
                                                        className="reel-preview-card"
                                                        onClick={() => {
                                                            setSelectedChapterEduclips?.(chapterResources[resource as keyof IChapterResources] as IResourceItem[]);
                                                            navigate.push('/reels-for-chapter', 'forward')
                                                        }}
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
                                                        <IonText className="reel-preview-title">{video.name}</IonText>
                                                    </div>
                                                ))}
                                                <div
                                                    className="reel-preview-card reel-view-more-card"
                                                    onClick={() => navigate.push('/reels-for-chapter', 'forward')}
                                                >
                                                    <div className="reel-view-more-content">
                                                        <IonIcon icon={arrowForward} className="reel-view-more-icon" />
                                                        <IonText className="reel-view-more-text">View More</IonText>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                                </div>
                            </React.Fragment>
                        ))
                    )}

                <React.Fragment key={"audio-reader"}>
                    <IonItem lines="none" className="padAIChapterDetailsScreenContentAccordionItemNew" style={{ marginTop: '7px', marginBottom: '7px' }}>
                        <IonText slot="start" className="ion-text-wrap padAIHomeScreenUserChapter-text-container" style={{ textOverflow: 'ellipsis', fontWeight: '600' }}>
                            Audio Reader
                        </IonText>
                        {/* <IonButtons slot="end">
                                        <IonButton fill="clear" slot="icon-only" style={{ fontSize: '18px' }}>
                                            <IonIcon icon={arrowRedoOutline} />
                                        </IonButton>
                                    </IonButtons> */}
                    </IonItem>
                    <div className="padAIChapterDetailsScreenContentAccordionnnEW resource-cards-container">
                        <div
                            key={`auido-dummy`}
                            className="resource-card"
                            onClick={() => {
                                navigate.push(`/audio-reader-html-content`, 'forward');
                            }}
                        >
                            <div className="resource-card-image">
                                <IonImg
                                    // src={getChapterImage(resourceItem, resource)}
                                    src={dummyImageAddress[0][0]}
                                    alt="audio reader"
                                    className="resource-card-img"
                                />
                            </div>
                            <div className="resource-card-title">
                                <IonText className="resource-card-name">Audio Reader</IonText>
                            </div>
                        </div>
                    </div>
                </React.Fragment>


                {/* {chapterId && !loading && chapterResources && (
                    <IonAccordionGroup className="padAIChapterDetailsScreenContentAccordionGroup">
                        {Object.keys(chapterResources).map((resource, index) => (
                            <IonAccordion value={resource} key={resource} className="padAIChapterDetailsScreenContentAccordionBox">
                                <IonItem slot="header" lines="none">
                                    <IonThumbnail slot="start" className="padAIChapterDetailsScreenContentAccordionThumbnail">
                                        <IonImg src={getChapterImage(chapterResources[resource as keyof IChapterResources][0], resource)} alt="chapterImage" className="resourceContainerimg" />
                                    </IonThumbnail>
                                    <IonLabel>{resource}</IonLabel>
                                </IonItem>
                                <div className="padAIChapterDetailsScreenContentAccordion" slot="content">
                                    {chapterResources[resource as keyof IChapterResources].map((resourceItem, index) => (
                                        <IonItem lines="none" color={'light'} className="padAIChapterDetailsScreenContentAccordionItem" key={index}>
                                            <IonLabel>{resourceItem.name}</IonLabel>
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

                        <IonAccordion value="AUDIO READER" key="AUDIO READER" className="padAIChapterDetailsScreenContentAccordionBox">
                            <IonItem slot="header" lines="none">
                                <IonThumbnail slot="start" className="padAIChapterDetailsScreenContentAccordionThumbnail">
                                    <IonImg src={getChapterImage(null, 'AUDIO READER')} alt="chapterImage" className="resourceContainerimg" />
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
                    </IonAccordionGroup>
                )} */}
                {/* reels section */}
                {/* <div className="reels-preview-section">
                    <IonText className="reels-section-title">
                        <h3 style={{ margin: '15px 0 10px 15px', fontWeight: '600', fontSize: '16px' }}>Edu Reels</h3>
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
                </div> */}
            </IonContent>
        </IonPage>
    )
}

export default PadAIChapterDetailsScreen;

function useFocusEffect(arg0: () => void) {
    throw new Error("Function not implemented.");
}
