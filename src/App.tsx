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

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

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


setupIonicReact();

const App: React.FC = () => {
  const platformInfo = getPlatform();
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [isObsolete, setIsObsolete] = useState(false);
  const [message, setMessage] = useState('');
  const chapterInfo = useChapterStore((state)=>state.chapterInfo);
  const setContentLoading = useChapterStore((state)=>state.setContentLoading);
  const [present, dismiss] = useIonLoading();

  useEffect(() => {
    if(chapterInfo.contentLoading) {
      present({ message: 'Please wait...' });
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
  }, []);

  const handleUpdate = () => {
    // Example: Open App Store/Play Store/PWA reload
    window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
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
            {/* Question Answer Content Screen */}
            <Route path="/question-answer-content" exact={true}>
              <PadAIQuestionAnswerContentScreen />
            </Route>
            {/* Quiz Content Screen */}
            <Route path="/quiz-content" exact={true}>
              <PadAIQuizContentScreen />
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
