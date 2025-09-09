import { IonContent, IonHeader, IonToolbar,IonTitle } from "@ionic/react";

import { IonPage } from "@ionic/react";
import PadaiYouTubePlayer from "../../../components/ContentView/YoutubePlayer/YoutubePlayer";

const PadAIYoutubeContentScreen: React.FC = () => {
    return (
        <IonPage className='padAIYoutubeContentScreen-page'>
            <PadaiYouTubePlayer />
            
        </IonPage>
    );
};
   
export default PadAIYoutubeContentScreen;

const YoutubeContent = () => {
    return (
      <div
        className="!border-0 !pb-0"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px",
          flexShrink: 0,
        }}
      >
        <PadaiYouTubePlayer
          video={{
            id: video.id,
            title: video.title,
            url: video.url || "",
            thumbnail: "",
            duration: "",
            description: video.description || "",
          }}
        />
      </div>
    )
  }