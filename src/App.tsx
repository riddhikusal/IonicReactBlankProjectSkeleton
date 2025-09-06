import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
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


setupIonicReact();

const App: React.FC = () => {
  const platformInfo = getPlatform();
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [isObsolete, setIsObsolete] = useState(false);
  const [message, setMessage] = useState('');

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
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
