import { IonCol, IonImg, IonRow, IonText } from "@ionic/react";
import './BooksContainer.css';


export interface IBooksContainerProps {
    booksImage: string;
    booksName: string;
    booksAuthor: string;
    booksSubject: string;
}
// /assets/images/books/1.png'

const PadAIBooksContainer: React.FC<IBooksContainerProps> = ({ booksImage, booksName, booksAuthor, booksSubject }) => {

    return (
        <IonCol size="4">
            <IonImg src={booksImage} alt={booksName} className='padAIHomeScreenUserBooksImage' />
            <IonText className="ion-text-wrap padAIHomeScreenUserBooks-text-container" style={{ textOverflow: 'ellipsis' }}>
                <p className='padAIHomeScreenUserBooks-text'>{booksName}, {booksSubject}</p>
                <p className='padAIHomeScreenUserBooks-text author-text'>{booksAuthor}</p>
            </IonText>
        </IonCol>
    )
}

export default PadAIBooksContainer;