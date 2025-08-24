// src/App.tsx
import React, { useEffect, useState } from 'react';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/react';
import { getPlatform } from './utils/platform';
import { getPlatformVersionStatus } from './services/getVersionService';
import VersionUpdateModal from './components/VersionUpdateModal';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppRoutes from './routes/AppRoutes';
import { setupIonicReact } from '@ionic/react';
import './App.css';

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

/* Theme variables */
import './theme/variables.css';

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
        <AppRoutes />
        {/* <VersionUpdateModal
          isOpen={showUpdatePopup}
          isObsolete={isObsolete}
          message={message}
          onClose={() => setShowUpdatePopup(false)}
          onUpdate={handleUpdate}
        /> */}
    </IonApp>
  );
};

export default App;
