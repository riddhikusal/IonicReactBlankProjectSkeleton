import { IonButton, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonPage, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonText, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './HomeScreen.css';
import Commonheader from '../../components/Common/Commonheader/Commonheader';
import { useEffect, useState } from 'react';
import PadAIBooksContainer from '../../components/HomeScreen/BooksContainer/BooksContainer';
import { GetSubjects } from '../../services/homeService';
import { useToaster } from '../../hooks/toasterHooks/useToaster';
import { IGetSubjectsRequest, IGetSubjectsResponse } from '../../api/contentApi/contentApi.interface';
import vectoreBgImage from '/assets/images/dashboardScreen/topVectorOne.png';
import { getUserProfile, UserProfile } from '../../utils/profileStorage';
import React from 'react';
import { useChapterStore } from '../../services/store/chapter.store';
import { chatbubbleOutline, homeOutline, personOutline, videocamOutline } from 'ionicons/icons';

const PadAIHomeScreen: React.FC = () => {
    // chapterInfo store
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const setContentLoading = useChapterStore((state) => state.setContentLoading);
    const setContentLoaded = useChapterStore((state) => state.setContentLoaded);
    const setAudioIsPlaying = useChapterStore((state) => state.setAudioIsPlaying);

    const { dangerToaster } = useToaster();
    const navigate = useIonRouter();
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const [subjects, setSubjects] = useState<IGetSubjectsResponse[]>([]);
    const [copyAllBooks, setCopyAllBooks] = useState<IGetSubjectsResponse[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<IGetSubjectsResponse[]>([]);
    const [isubjectDataLoading, setIsubjectDataLoading] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const getAllSubjects = async (langMedium: string, langNative: string, classId: number) => {
        try {
            setIsubjectDataLoading(true);
            let getData: IGetSubjectsRequest = {
                language: langMedium,
                classId: classId
            }
            const res = await GetSubjects(getData);
            console.log("Component", res);
            if (res.responseStatus === 'DATA_FOUND') {
                let subjects = res.data.reduce((acc: any, curr: IGetSubjectsResponse) => {
                    if (acc.length === 0) {
                        acc.push(curr);
                    }
                    else if (acc.find((subject: IGetSubjectsResponse) => subject.subjectGroup === curr.subjectGroup)) {
                        return acc;
                    }
                    else {
                        acc.push(curr);
                    }
                    return acc;
                }, [] as IGetSubjectsResponse[]);
                setSubjects(subjects);
                setCopyAllBooks(res.data);
                setFilteredSubjects(res.data);
            } else {
                setSelectedSubject('');
                setFilteredSubjects([]);
                setSubjects([]);
                setCopyAllBooks([]);
                dangerToaster(res.message || 'Failed to get subjects');
            }
        } catch (error: any) {
            console.log(error);
            setSubjects([]);
            dangerToaster(error.message || 'Failed to get subjects');

        } finally {
            setIsubjectDataLoading(false);
        }
    }

    const filterSubjects = () => {
        console.log("copyAllBooks", copyAllBooks);
        if (selectedSubject === 'All') {
            setFilteredSubjects(copyAllBooks);
            return;
        }
        setFilteredSubjects(copyAllBooks.filter((subject) => subject.subjectGroup === selectedSubject));
    }

    const getUserProfileData = async () => {
        const userProfile = await getUserProfile();
        setUserProfile(userProfile);
        getAllSubjects(userProfile?.langMedium || '', userProfile?.langNative || '', Number(userProfile?.class) || 0);
    }

    useEffect(() => {
       
        // getUserProfileData();
    }, []);

    useEffect(() => {
        console.log("selectedSubject", selectedSubject);
        filterSubjects();
    }, [selectedSubject]);

    useIonViewWillEnter(() => {
        setContentLoading?.(false);
        setContentLoaded?.(false);
        setAudioIsPlaying?.(false);
        getUserProfileData();
    });

    return (
        <IonPage>
            <Commonheader />
            <IonImg src={vectoreBgImage} alt="headerBanner" className='padAIvectorTwoBg' />
            <IonHeader>
                <div className="padAIHomeScreenUserGreeting">
                    <IonText>
                        <p className='padAIHomeScreenUserGreetingText'>Hello, {userProfile?.name || 'Guest'} </p>
                    </IonText>
                    <IonText className='padAIHomeScreenUserGreeting-text-subtitle'>
                        let's find your books here
                    </IonText>
                </div>
                <div className='padAIHomeScreenUserBooksFilter'>
                    <IonSegment scrollable={true} value={selectedSubject} mode='md'>
                        {isubjectDataLoading && [1, 2, 3, 4].map((index) => <IonSegmentButton><IonSkeletonText key={index} animated={true} style={{ width: '80px' }}></IonSkeletonText></IonSegmentButton>)}
                        {!isubjectDataLoading && (
                            <>
                                {subjects.length > 0 && <IonSegmentButton value="All" onClick={() => setSelectedSubject('All')}>
                                    <IonText>
                                        <p className={`padAIHomeScreenUserBooksFilter-text`}>All</p>
                                    </IonText>
                                </IonSegmentButton>}
                                {subjects.map((subject, index) => (
                                    <IonSegmentButton key={index} value={subject.subjectGroup} onClick={() => setSelectedSubject(subject.subjectGroup)}>
                                        <IonText key={index}>
                                            <p className={`padAIHomeScreenUserBooksFilter-text`}>{subject.subjectGroup}</p>
                                        </IonText>
                                    </IonSegmentButton>
                                ))}
                            </>)}
                    </IonSegment>
                </div>
            </IonHeader>
            <IonContent className='padAIhomeScreen-content'>
                <div className='padAIHomeSection-Container'>
                    <IonRow className='padAIHomeSection-Container-Row'>
                        {isubjectDataLoading && [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20].map((index) =>
                        (<IonCol size="4">
                            <IonText className="ion-text-wrap padAIHomeScreenUserBooks-text-container" style={{ textOverflow: 'ellipsis' }}>
                                <IonSkeletonText animated={true} style={{ width: '120px', height: '180px' }}></IonSkeletonText>
                            </IonText>
                        </IonCol>)

                        )}
                        {!isubjectDataLoading && (
                            <>
                                {filteredSubjects.map((book, index) => (
                                    <PadAIBooksContainer key={index} booksImage={book.image} booksName={book.info} booksAuthor={'N/A'} booksSubject={book.info} booksSubjectId={book.subjectId} />
                                ))}
                            </>)}
                    </IonRow>
                </div>
            </IonContent>
            {/* <IonFooter className='footer-container'>
                <IonRow>
                    <IonCol size="3" className='footer-icon-button' onClick={() => navigate.push('/home', 'forward')}>
                        <IonIcon icon={homeOutline} className='footer-icon' />
                        <IonText className='footer-icon-text'>Home</IonText>
                    </IonCol>
                    <IonCol size="3" className='footer-icon-button' onClick={() => navigate.push('/user-profile', 'forward')}>
                        <IonIcon icon={personOutline} className='footer-icon' />
                        <IonText className='footer-icon-text'>Profile</IonText>
                    </IonCol>
                    <IonCol size="3" className='footer-icon-button' onClick={() => navigate.push('/reels', 'forward')}>
                        <IonIcon icon={videocamOutline} className='footer-icon' />
                        <IonText className='footer-icon-text'>Reels</IonText>
                    </IonCol>
                    <IonCol size="3" className='footer-icon-button' onClick={() => navigate.push('/ask-ai', 'forward')}>
                        <IonIcon icon={chatbubbleOutline} className='footer-icon' />
                        <IonText className='footer-icon-text'>Ask AI</IonText>
                    </IonCol>
                </IonRow>
            </IonFooter> */}
        </IonPage >
    );
};


export default PadAIHomeScreen;

