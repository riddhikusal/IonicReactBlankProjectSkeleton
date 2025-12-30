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
    const setSubjectName = useChapterStore((state) => state.setSubjectAndBookName);

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
            {/* <IonImg src={booksImage} alt={booksName} className='padAIHomeScreenUserBooksImage' />
            <IonText className="ion-text-wrap padAIHomeScreenUserBooks-text-container" style={{ textOverflow: 'ellipsis' }}>
                <p className='padAIHomeScreenUserBooks-text'>{booksName}, {booksSubject}</p>
            </IonText> */}
            <div

                className="resource-card updated-card" >
                <div className="resource-card-image updated-img-card-container">
                    <IonImg
                        src={booksImage} alt={booksName}
                        className="resource-card-img updated-img-card"
                    />
                </div>
                <div className="resource-card-title updated-card-title">
                <IonText className="resource-card-name updated-card-title-text">{booksName}</IonText>
            </div>
            </div>
        </IonCol>
    )
}

export default PadAIBooksContainer;


// <div className="padAIChapterDetailsScreenContentAccordionnnEW resource-cards-container">
//     {chapterResources[resource as keyof IChapterResources].map((resourceItem, indexnEW) => (
//         <div
//             key={`${resource}-${resourceItem.id || indexnEW}`}
//             className="resource-card"
//             onClick={() => {
//                 setSelectedChapterResources?.(resourceItem);
//                 if (resource === 'BOOK READER') {
//                     navigate.push(`/pdf-content`, 'forward');
//                 } else if (resource === 'FLASHCARDS') {
//                     navigate.push(`/flash-content`, 'forward');
//                 } else if (resource === 'NOTES & REFERENCES') {
//                     navigate.push(`/html-content`, 'forward');
//                 } else if (resource === 'QUESTION ANSWERS') {
//                     navigate.push(`/question-answer-content`, 'forward');
//                 } else if (resource === 'QUIZ') {
//                     navigate.push(`/quiz-content`, 'forward');
//                 } else if (resource === 'VIDEO EXPLAINERS') {
//                     if (resourceItem.contentType === 'video') {
//                         navigate.push(`/video-content`, 'forward');
//                     } else if (resourceItem.contentType === 'youtube-video') {
//                         navigate.push(`/youtube-content`, 'forward');
//                     }
//                 }
//             }}
//         >
//             <div className="resource-card-image">
//                 <IonImg
//                     // src={getChapterImage(resourceItem, resource)}
//                     src={dummyImageAddress[index][indexnEW]}
//                     alt={resourceItem.name}
//                     className="resource-card-img"
//                 />
//             </div>
//             <div className="resource-card-title">
//                 <IonText className="resource-card-name">{resourceItem.name}</IonText>
//             </div>
//         </div>
//     ))}
// </div>