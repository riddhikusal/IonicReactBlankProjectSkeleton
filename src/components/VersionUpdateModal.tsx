// src/components/VersionUpdateModal.tsx
import React from 'react';
import { IonModal, IonButton } from '@ionic/react';

interface VersionUpdateModalProps {
  isOpen: boolean;
  isObsolete: boolean;
  message: string;
  onClose: () => void;
  onUpdate?: () => void; // optional handler to redirect to App Store/Play Store
}

const VersionUpdateModal: React.FC<VersionUpdateModalProps> = ({
  isOpen,
  isObsolete,
  message,
  onClose,
  onUpdate,
}) => {
  return (
    <IonModal isOpen={isOpen} backdropDismiss={!isObsolete}>
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>{message || 'A new version is available!'}</h2>

        {isObsolete ? (
          <>
            <p style={{ color: 'red' }}>
              This version is obsolete. Please update to continue.
            </p>
            {onUpdate && (
              <IonButton color="primary" onClick={onUpdate}>
                Update Now
              </IonButton>
            )}
          </>
        ) : (
          <>
            <IonButton onClick={onClose}>Close</IonButton>
            {onUpdate && (
              <IonButton color="primary" onClick={onUpdate}>
                Update Now
              </IonButton>
            )}
          </>
        )}
      </div>
    </IonModal>
  );
};

export default VersionUpdateModal;
