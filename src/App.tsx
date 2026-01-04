import { IonApp, IonLoading, IonRouterOutlet, IonSplitPane, setupIonicReact, useIonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import Menu from './components/Menu';
// import Page from './pages/Page';
import LandingScreen from './pages/LandingScreen/LandingScreen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* Dark mode disabled - app only supports light theme */
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';
import PadAILanguageScreen from './pages/LanguageScreen/LanguageScreen';
import PadAILoginScreen from './pages/LoginScreen/LoginScreen';
import './App.css';
import { useEffect, useState } from 'react';
import { getPlatform } from './utils/platform';
import PadAIHomeScreen from './pages/HomeScreen/HomeScreen';
import PadAIVideoContentScreen from './pages/ContentViewScreens/VideoContentScreen/VideoContentScreen';
import PadAIYoutubeContentScreen from './pages/ContentViewScreens/YoutubeContentScreen/YoutubeContentScreen';
import PadAIHTMLContentScreen from './pages/ContentViewScreens/HtmlContentScreen/HtmlContentScreen';
import PadAIChaptersScreen from './pages/ChaptersScreen/ChaptersScreen';
import PadAIChapterDetailsScreen from './pages/ChapterDetailsScreen/ChapterDetailsScreen';
import PadAIQuestionAnswerContentScreen from './pages/ContentViewScreens/QuestionAnswerContentScreen/QuestionAnswerContentScreen';
import PadAIQuizContentScreen from './pages/ContentViewScreens/QuizContentScreen/QuizContentScreen';
import { useChapterStore } from './services/store/chapter.store';
import PadAIPDFViewerContentScreen from './pages/ContentViewScreens/PDFViewerContentScreen/PDFViewerContentScreen';
import PadAIFlashcardContentScreen from './pages/ContentViewScreens/FlashcardContentScreen/FlashcardContentScreen';
import UserProfileScreen from './pages/UserProfileScreen/UserProfileScreen';
import ReelScreen from './pages/ReelScreen/ReelScreen';
import { SplashScreen } from '@capacitor/splash-screen';
import PadAIAudioReaderHTMLContentScreen from './pages/ContentViewScreens/AudioReadoutScreen/AudioReadoutScreen';
import PadAIQuestionAnswerDetailsScreen from './pages/ContentViewScreens/QuestionAnswerContentScreen/QuestionAnswerDetailsScreen/QuestionAnswerDetailsScreen';
import ReelNewScreen from './pages/ReelScreen/ReelScreenNew';
import ReelsForChapterScreen from './pages/ReelScreen/ReeeScreenForChapter';
import AudioSpeakScreen from './pages/AudioSpeakScreen/AudioSpeakScreen';


setupIonicReact();

const App: React.FC = () => {
  const platformInfo = getPlatform();
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [isObsolete, setIsObsolete] = useState(false);
  const [message, setMessage] = useState('');
  const chapterInfo = useChapterStore((state) => state.chapterInfo);
  const setContentLoading = useChapterStore((state) => state.setContentLoading);
  const setContentLoaded = useChapterStore((state) => state.setContentLoaded);
  const setAudioIsPlaying = useChapterStore((state) => state.setAudioIsPlaying);
  const [present, dismiss] = useIonLoading();
  // ... inside your component or effect

  useEffect(() => {
    // Show the splash for two seconds and then automatically hide it:
    const showSplash = async () => {
    SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
      });
    }
    showSplash();
  }, []);
  useEffect(() => {
    console.log('chapterInfo.contentLoading', chapterInfo.contentLoading, chapterInfo.contentLoaded, chapterInfo.audioIsPlaying);
    if (chapterInfo.contentLoading) {
      present({
        message: 'Please wait...'
      });
    } else {
      dismiss();
    }
  }, [chapterInfo.contentLoading]);

  useEffect(() => {
    // const checkAppVersion = async () => {
    //   try {
    //     const { showPopup, isObsolete, message } = await getPlatformVersionStatus();
    //     setMessage(message);
    //     setIsObsolete(isObsolete);
    //     setShowUpdatePopup(showPopup);
    //   } catch (err) {
    //     console.error('Version check failed', err);
    //   }
    // };

    // checkAppVersion();
    setContentLoading?.(false);
    setContentLoaded?.(false);
    setAudioIsPlaying?.(false);
  }, []);

  const handleUpdate = () => {
    // Example: Open App Store/Play Store/PWA reload
    window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
  };

  return (
    <IonApp>
      <IonReactRouter basename={import.meta.env.BASE_URL}>
        <IonSplitPane contentId="main" disabled={true}>
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/landing" />
            </Route>
            {/* <Route path="/folder/:name" exact={true}>
              <Page />
            </Route> */}
            {/* Landing Screen */}
            <Route path="/landing" exact={true}>
              <LandingScreen />
            </Route>
            {/* Language Screen */}
            <Route path="/language" exact={true}>
              <PadAILanguageScreen />
            </Route>
            {/* Login Screen */}
            <Route path="/login" exact={true}>
              <PadAILoginScreen />
            </Route>
            {/* Home Screen */}
            <Route path="/home" exact={true}>
              <PadAIHomeScreen />
            </Route>
            {/* Chapter Screen */}
            <Route path="/chapters-list" exact={true}>
              <PadAIChaptersScreen />
            </Route>
            {/* Chapter Screen with dynamic route parameter */}
            <Route path="/chapters-list/:bookId" exact={true}>
              <PadAIChaptersScreen />
            </Route>
            {/* Chapter Details Screen */}
            <Route path="/chapter-details/" exact={true}>
              <PadAIChapterDetailsScreen />
            </Route>
            <Route path="/chapter-details/:id" exact={true}>
              <PadAIChapterDetailsScreen />
            </Route>
            {/* Video Content Screen */}
            <Route path="/video-content" exact={true}>
              <PadAIVideoContentScreen />
            </Route>
            {/* Video Content Screen */}
            <Route path="/youtube-content" exact={true}>
              <PadAIYoutubeContentScreen />
            </Route>
            {/* Html Content Screen */}
            <Route path="/html-content" exact={true}>
              <PadAIHTMLContentScreen />
            </Route>
            {/* Flash Content Screen */}
            <Route path="/flash-content" exact={true}>
              {/* <PadAIFlashViewScreen /> */}
              <PadAIFlashcardContentScreen />
            </Route>
            {/* Question Answer Content Screen */}
            <Route path="/question-answer-content" exact={true}>
              <PadAIQuestionAnswerContentScreen />
            </Route>
            {/* Quiz Content Screen */}
            <Route path="/quiz-content" exact={true}>
              <PadAIQuizContentScreen />
            </Route>
            {/* PDF Viewer Content Screen */}
            <Route path="/pdf-content" exact={true}>
              <PadAIPDFViewerContentScreen />
            </Route>
            {/* Audio Reader HTML Content Screen */}
            <Route path="/audio-reader-html-content" exact={true}>
              <PadAIAudioReaderHTMLContentScreen />
            </Route>
            {/* User Profile Screen */}
            <Route path="/user-profile" exact={true}>
              <UserProfileScreen />
            </Route>
            {/* Reel Screen */}
            <Route path="/reels" exact={true}>
              <ReelScreen />
            </Route>
            {/* Reel New Screen */}
            <Route path="/reels-new" exact={true}>
              <ReelNewScreen />
            </Route>
            {/* Reels for Selected Chapter */}
            <Route path="/reels-for-chapter" exact={true}>
              <ReelsForChapterScreen />
            </Route>
            {/* Question Answer Details Screen */}
            <Route path="/question-answer-details" exact={true}>
              <PadAIQuestionAnswerDetailsScreen />
            </Route>
            {/* Audio Speak Screen */}
            <Route path="/audio-speak" exact={true}>
              <AudioSpeakScreen />
            </Route>
            {/* Catch-all route - redirect any invalid route to home */}
            {/* <Route path="*">
              <Redirect to="/home" />
            </Route> */}
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
      {/* <IonLoading trigger="open-loading" message="Please wait..." duration={3000} isOpen={chapterInfo.contentLoading} /> */}

    </IonApp>
  );
};

export default App;
