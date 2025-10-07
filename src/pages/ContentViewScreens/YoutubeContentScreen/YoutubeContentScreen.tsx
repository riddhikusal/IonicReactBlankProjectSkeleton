import { IonContent, IonHeader, IonToolbar,IonTitle } from "@ionic/react";

import { IonPage } from "@ionic/react";
import PadaiYouTubePlayer from "../../../components/ContentView/YoutubePlayer/YoutubePlayer";

const PadAIYoutubeContentScreen: React.FC = () => {
    return (
        <IonPage className='padAIYoutubeContentScreen-page'>
            <PadaiYouTubePlayer 
              video={{
                id: 'test',
                title: 'test', 
                url: 'https://www.youtube.com/embed/rtjGH0B-vVA',
                thumbnail: "",
                duration: "",
                description: 'test',
              }}
            />            
        </IonPage>
    );
};
   
export default PadAIYoutubeContentScreen;

// const YoutubeContent = () => {
//     return (
//       <div
//         className="!border-0 !pb-0"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           padding: "12px",
//           flexShrink: 0,
//         }}
//       >
//             <PadaiYouTubePlayer
//             video={{
//                 id: 'test',
//                 title: 'test',
//                 url: 'https://www.youtube.com/embed/rtjGH0B-vVA',
//                 thumbnail: "",
//                 duration: "",
//                 description: 'test',
//             }}
//             />
//       </div>
//     )
//   }