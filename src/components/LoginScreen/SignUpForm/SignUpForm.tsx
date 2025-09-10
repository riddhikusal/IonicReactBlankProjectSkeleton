// src/components/LoginScreen/SignUpForm/SignUpForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonText
} from '@ionic/react';
import PadaiButton from '../../Common/Buttons/Button';
import { LoginForm } from '../../../pages/LoginScreen/LoginScreen.interface';
import { useAlert } from '../../../hooks/alertHooks/useAlert';
import { getLanguages, Language } from '../../../api/loginApi'; // <-- uses your POST API
import { getUserProfile } from '../../../utils/profileStorage';
import { signupUser } from '../../../services/loginService';

type Props = {
  setStep: (s: 'phone' | 'login' | 'signup') => void;
  loginForm: LoginForm;
  setLoginForm: (lf: LoginForm) => void;
};

const PadAISignUpForm: React.FC<Props> = ({ setStep, loginForm, setLoginForm }) => {
  const { presentAlert } = useAlert();

  // form fields
  const [name, setName] = useState<string>('');
  const [emailId, setEmailId] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [board, setBoard] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');
  const [langMedium, setLangMedium] = useState<string>(''); // code
  const [langNative, setLangNative] = useState<string>(''); // code

  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Prefill + languages
  useEffect(() => {
    (async () => {
      // 1) prefill from saved profile if any
      const prof = await getUserProfile();

      // 2) then overlay loginForm values if present
      setMobileNo(loginForm?.phone_no || prof?.['mobileNo'] || '');
      setName(loginForm?.['full_name'] || prof?.name || '');
      setEmailId((loginForm as any)?.emailId || prof?.emailId || '');
      setBoard((loginForm as any)?.board || prof?.board || '');
      setStudentClass((loginForm as any)?.class || prof?.class || '');
      setLangMedium((loginForm as any)?.langMedium || prof?.langMedium || '');
      setLangNative((loginForm as any)?.langNative || prof?.langNative || '');

      // 3) load languages from API
      try {
        const resp = await getLanguages();
        if (resp.data?.languages?.length) {
          setLanguages(resp.data.languages);
        }
      } catch (e) {
        console.error('Failed to fetch languages', e);
      }
    })();
  }, [loginForm]);

  // // keep parent form in sync (only fields it knows/uses)
  // useEffect(() => {
  //   setLoginForm({
  //     ...loginForm,
  //     phone_no: mobileNo,
  //     full_name: name,
  //     emailId,
  //     board,
  //     class: studentClass,
  //     langMedium,
  //     langNative,
  //   } as LoginForm);
  // }, [mobileNo, name, emailId, board, studentClass, langMedium, langNative]); // eslint-disable-line

  const canSubmit = useMemo(() => {
    const baseOk = !!name && !!mobileNo && !!langMedium && !!langNative;
    
    return baseOk;
  }, [name, mobileNo, langMedium, langNative]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      await presentAlert({ header: 'Required', message: 'Please enter your name.', buttonsActions: [() => {}, () => {}] });
      return;
    }
    if (!mobileNo || mobileNo.trim().length < 10) {
      await presentAlert({ header: 'Invalid phone', message: 'Please enter a valid 10-digit mobile number.', buttonsActions: [() => {}, () => {}] });
      return;
    }
    if (!langMedium) {
      await presentAlert({ header: 'Required', message: 'Please select your study/medium language.', buttonsActions: [() => {}, () => {}] });
      return;
    }
    if (!langNative) {
      await presentAlert({ header: 'Required', message: 'Please select your native language.', buttonsActions: [() => {}, () => {}] });
      return;
    }

    const payload = {
      name: name.trim(),
      emailId: emailId.trim() || undefined,
      mobileNo: mobileNo.trim(),
      board: board || undefined,
      class: studentClass || undefined,
      langMedium,
      langNative,
    };

    try {
      setLoading(true);

      const resp = await signupUser({
        name: name.trim(),
        mobile: mobileNo.trim(),
        emailId: emailId.trim() || '',
        board,
        class: studentClass,
        langMedium,
        langNative,
      });

      if (resp?.status === 'UPDATED') {
        await presentAlert({
          header: 'Success',
          message: resp?.msg || 'Account created! Please log in with your new credentials.',
          buttonsActions: [() => { }, () => { }],
        });
        // go to home
      } else {
        await presentAlert({
          header: 'Signup failed',
          message: resp?.msg || 'Something went wrong while creating your account.',
          buttonsActions: [() => { }, () => { }],
        });
      }
    } catch (e: any) {
      await presentAlert({
        header: 'Signup failed',
        message: e?.message ?? 'Something went wrong while creating your account.',
        buttonsActions: [() => { }, () => { }],
      });
    } finally {
      setLoading(false);
    }

  };

  const renderLangOptions = () =>
    languages.map((l) => (
      <IonSelectOption key={l.code} value={l.code}>
        {l.languageText || l.name}
      </IonSelectOption>
    ));

  return (
    <div className="padAI-login-container">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Create your account</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Full Name</IonLabel>
            <IonInput value={name} placeholder="Your name" onIonChange={(e) => setName(e.detail.value || '')} />
          </IonItem>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput type="email" value={emailId} placeholder="you@example.com" onIonChange={(e) => setEmailId(e.detail.value || '')} />
          </IonItem>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Mobile Number</IonLabel>
            <IonInput type="tel" value={mobileNo} placeholder="10-digit mobile number" readonly/>
          </IonItem>

          {/* <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Board</IonLabel>
            <IonInput value={board} placeholder="(Optional) e.g., CBSE, ICSE" onIonChange={(e) => setBoard(e.detail.value || '')} />
          </IonItem>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Class</IonLabel>
            <IonInput value={studentClass} placeholder="(Optional) e.g., 10" onIonChange={(e) => setStudentClass(e.detail.value || '')} />
          </IonItem> */}
          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Board</IonLabel>
            <IonSelect
              interface="popover"
              placeholder="Select board"
              value={board}
              onIonChange={(e) => setBoard(e.detail.value)}
            >
              <IonSelectOption value="CBSE">CBSE</IonSelectOption>
              <IonSelectOption value="ICSE">ICSE</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Class</IonLabel>
            <IonSelect
              interface="popover"
              placeholder="Select class"
              value={studentClass}
              onIonChange={(e) => setStudentClass(e.detail.value)}
            >
              {[...Array(10)].map((_, i) => (
                <IonSelectOption key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Preferred Language (Medium)</IonLabel>
            <IonSelect interface="popover" placeholder="Select language" value={langMedium} onIonChange={(e) => setLangMedium(e.detail.value)}>
              {renderLangOptions()}
            </IonSelect>
          </IonItem>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Native Language</IonLabel>
            <IonSelect interface="popover" placeholder="Select language" value={langNative} onIonChange={(e) => setLangNative(e.detail.value)}>
              {renderLangOptions()}
            </IonSelect>
          </IonItem>

         {/* <div className="padAI-login-actions" style={{ marginTop: 16 }}>
            <PadaiButton onClick={handleSubmit} disabled={loading || !canSubmit}>
              {loading ? 'Saving...' : 'Create Account'}
            </PadaiButton>
          </div> */}
<div className='ion-margin-top'>
                        <PadaiButton
                            onClick={handleSubmit} disabled={loading || !canSubmit}
                            color='warning'
                            size='large'
                            type='button'
                            fill='solid'
                            expand='block'
                        >
                             {loading ? 'Saving...' : 'Create Account'}
                        </PadaiButton>
                    </div>
                    <div className=''>
                        <PadaiButton
                            onClick={(e) => {
                                e.preventDefault();
                                setStep('login');
                            }}
                            color='warning'
                            size='large'
                            type='button'
                            fill='clear'
                            expand='block'
                        >
                            <IonText className='padAILanguageSubTitle padAIGoBackBtn'>
                                Go Back
                            </IonText>
                        </PadaiButton>
                    </div>

          
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default PadAISignUpForm;
