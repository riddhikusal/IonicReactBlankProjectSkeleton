import { IonPage } from "@ionic/react";
import PadAIFlashViewer from "../../../components/ContentView/FlashViewer/FlashViewer";
import { FlashcardData } from "../../../components/ContentView/media";


const PadAIFlashViewScreen: React.FC = () => {
    return (
        <IonPage className='padAIFlashViewScreen-page'>
            <PadAIFlashViewer   
                question="What is the capital of France?"
                answer="Paris"
                image="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            />
                        {/* <div className="flashcard-container">
                          <div className="columns-2 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>div:not(:first-child)]:mt-8">
                            {flashcards?.map((card: FlashcardData, i: number) => {
                              <div className="mb-4" key={i}>
                                <PadAIFlashViewer key={i} {...card} />
                              </div>
                            })}
                          </div>
                        </div> */}
        </IonPage>
    );
};

export default PadAIFlashViewScreen;
