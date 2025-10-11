import { IonCol, IonImg, IonRow, IonText, useIonRouter } from "@ionic/react";
import './BooksContainer.css';
import { useChapterStore } from "../../../services/store/chapter.store";


export interface IBooksContainerProps {
    booksImage: string;
    booksName: string;
    booksAuthor: string;
    booksSubject: string;
    booksSubjectId: number;
}
// /assets/images/books/1.png'

const PadAIBooksContainer: React.FC<IBooksContainerProps> = ({ booksImage, booksName, booksAuthor, booksSubject, booksSubjectId }) => {
    const navigate = useIonRouter();
    const setSubjectName = useChapterStore((state)=>state.setSubjectAndBookName);

    const goToChapter = () => {
        setSubjectName?.(booksSubject, booksName);
        // Method 1: Query Parameters (URL parameters)
        navigate.push(`/chapters-list?subjectId=${booksSubjectId}&subject=${encodeURIComponent(booksSubject)}&bookName=${encodeURIComponent(booksName)}`, 'forward');
        
        // Method 2: Route Parameters (uncomment to use)
        // navigate.push(`/chapters-list/${booksSubjectId}`, 'forward');
        
        // Method 3: State Object (uncomment to use - best for complex data)
        // const bookData = {
        //     id: booksSubjectId,
        //     name: booksName,
        //     subject: booksSubject,
        //     author: booksAuthor,
        //     image: booksImage
        // };
        // navigate.push('/chapters-list', 'forward', { state: bookData });
    }
    return (
        <IonCol size="4" onClick={goToChapter}>
            <IonImg src={booksImage} alt={booksName} className='padAIHomeScreenUserBooksImage' />
            <IonText className="ion-text-wrap padAIHomeScreenUserBooks-text-container" style={{ textOverflow: 'ellipsis' }}>
                <p className='padAIHomeScreenUserBooks-text'>{booksName}, {booksSubject}</p>
                {/* <p className='padAIHomeScreenUserBooks-text author-text'>{booksAuthor}</p> */}
            </IonText>
        </IonCol>
    )
}

export default PadAIBooksContainer;