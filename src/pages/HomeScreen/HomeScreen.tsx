import { IonCol, IonContent, IonHeader, IonImg, IonPage, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonText, useIonRouter } from '@ionic/react';
import './HomeScreen.css';
import Commonheader from '../../components/Common/Commonheader/Commonheader';
import { useEffect, useState } from 'react';
import PadAIBooksContainer from '../../components/HomeScreen/BooksContainer/BooksContainer';
import { GetSubjects } from '../../services/homeService';
import { useToaster } from '../../hooks/toasterHooks/useToaster';
import { IGetSubjectsRequest, IGetSubjectsResponse } from '../../api/contentApi/contentApi.interface';
const user = {
    name: 'John Doe'
}
const subjects = [
    {
        name: 'Science',
        author: 'Author 1'
    },
    {
        name: 'English',
        author: 'Author 2'
    },
    {
        name: 'Mathematics',
        author: 'Author 3'
    },
    {
        name: 'Social Studies',
        author: 'Author 4'
    },
    {
        name: 'Hindi',
        author: 'Author 5'
    },
    {
        name: 'Computer Science',
        author: 'Author 6'
    },
    {
        name: 'Art',
        author: 'Author 7'
    },
    {
        name: 'Music',
        author: 'Author 8'
    },
    {
        name: 'Physical Education',
        author: 'Author 9'
    },
    {
        name: 'History',
        author: 'Author 10'
    },
    {
        name: 'Geography',
        author: 'Author 11'
    },
    {
        name: 'Economics',
        author: 'Author 12'
    },

]
const books = [
    {
        name: 'Book 1',
        author: 'Author 1',
        subject: 'Subject 1',
        image: '/assets/images/books/1.png'
    },
    {
        name: 'Book 2',
        author: 'Author 2',
        subject: 'Subject 2',
        image: '/assets/images/books/2.png'
    },
    {
        name: 'Book 3',
        author: 'Author 3',
        subject: 'Subject 3',
        image: '/assets/images/books/3.png'
    },
    {
        name: 'Book 4',
        author: 'Author 4',
        subject: 'Subject 4',
        image: '/assets/images/books/4.png'
    },
    {
        name: 'Book 5',
        author: 'Author 5',
        subject: 'Subject 5',
        image: '/assets/images/books/5.png'
    },
    {
        name: 'Book 6',
        author: 'Author 6',
        subject: 'Subject 6',
        image: '/assets/images/books/6.png'
    },
    {
        name: 'Book 7',
        author: 'Author 7',
        subject: 'Subject 7',
        image: '/assets/images/books/7.png'
    },
    {
        name: 'Book 8',
        author: 'Author 8',
        subject: 'Subject 8',
        image: '/assets/images/books/8.png'
    },
    {
        name: 'Book 9',
        author: 'Author 9',
        subject: 'Subject 9',
        image: '/assets/images/books/9.png'
    },
    {
        name: 'Book 10',
        author: 'Author 10',
        subject: 'Subject 10',
        image: '/assets/images/books/10.png'
    },
]
const PadAIHomeScreen: React.FC = () => {
    const { dangerToaster } = useToaster();
    const navigate = useIonRouter();
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const [subjects, setSubjects] = useState<IGetSubjectsResponse[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<IGetSubjectsResponse[]>([]);
    const [isubjectDataLoading, setIsubjectDataLoading] = useState<boolean>(false);

    const getAllSubjects = async () => {
        try {
            setIsubjectDataLoading(true);
            let getData: IGetSubjectsRequest = {
                language: 'en',
                classId: 13
            }
            const res = await GetSubjects(getData);
            console.log("Component", res);
            if (res.responseStatus === 'DATA_FOUND') {
                setSubjects(res.data);
                setFilteredSubjects(res.data);
            } else {
                dangerToaster(res.message);
            }
        } catch (error: any) {
            console.log(error);
            setSubjects([]);
            dangerToaster(error.message);

        } finally {
            setIsubjectDataLoading(false);
        }
    }

    const filterSubjects = () => {
        if (selectedSubject === 'All') {
            setFilteredSubjects(subjects);
            return;
        }
        setFilteredSubjects(subjects.filter((subject) => subject.info === selectedSubject));
    }

    useEffect(() => {
        getAllSubjects();
    }, []);

    useEffect(() => {
        console.log("selectedSubject", selectedSubject);
        filterSubjects();
    }, [selectedSubject]);

    return (
        <IonPage>
            <Commonheader />
            <IonImg src="/assets/images/dashboardScreen/topVectorOne.png" alt="headerBanner" className='padAIvectorTwoBg' />
            <IonHeader>
                <div className="padAIHomeScreenUserGreeting">
                    <IonText>
                        <p className='padAIHomeScreenUserGreetingText'>Hello, {user?.name || 'Guest'} </p>
                    </IonText>
                    <IonText className='padAIHomeScreenUserGreeting-text-subtitle'>
                        let's find your books here
                    </IonText>
                </div>
                <div className='padAIHomeScreenUserBooksFilter'>
                    <IonSegment scrollable={true} value={selectedSubject}>
                        {isubjectDataLoading && [1, 2, 3, 4].map((index) => <IonSegmentButton><IonSkeletonText key={index} animated={true} style={{ width: '80px' }}></IonSkeletonText></IonSegmentButton>)}
                        {!isubjectDataLoading && (
                            <>
                                <IonSegmentButton value="All" onClick={() => setSelectedSubject('All')}>
                                    <IonText>
                                        <p className={`padAIHomeScreenUserBooksFilter-text`}>All</p>
                                    </IonText>
                                </IonSegmentButton>
                                {subjects.map((subject, index) => (
                                    <IonSegmentButton key={index} value={subject.info} onClick={() => setSelectedSubject(subject.info)}>
                                        <IonText key={index}>
                                            <p className={`padAIHomeScreenUserBooksFilter-text`}>{subject.info}</p>
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
                        {isubjectDataLoading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) =>
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
        </IonPage >
    );
};

<IonSegment scrollable={true} value="heart">
    <IonSegmentButton value="home">

    </IonSegmentButton>
</IonSegment>

export default PadAIHomeScreen;