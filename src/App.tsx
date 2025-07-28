// src/App.tsx
import React, { useEffect, useState } from 'react';
import { IonApp, IonContent } from '@ionic/react';
import { usePlatform } from './hooks/usePlatform';
import { getPlatformVersionStatus } from './services/getVersionService';
import VersionUpdateModal from './components/VersionUpdateModal';

const App: React.FC = () => {
  const platformInfo = usePlatform();
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [isObsolete, setIsObsolete] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const { showPopup, isObsolete, message } = await getPlatformVersionStatus();
        setMessage(message);
        setIsObsolete(isObsolete);
        setShowUpdatePopup(showPopup);
      } catch (err) {
        console.error('Version check failed', err);
      }
    };

    checkAppVersion();
  }, []);

  const handleUpdate = () => {
    // Example: Open App Store/Play Store/PWA reload
    window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
  };

  return (
    <IonApp>
      <IonContent>
        <h2>Welcome to My App</h2>
        <p>Platform: {platformInfo.name}</p>

        <VersionUpdateModal
          isOpen={showUpdatePopup}
          isObsolete={isObsolete}
          message={message}
          onClose={() => setShowUpdatePopup(false)}
          onUpdate={handleUpdate}
        />
      </IonContent>
    </IonApp>
  );
};

export default App;
