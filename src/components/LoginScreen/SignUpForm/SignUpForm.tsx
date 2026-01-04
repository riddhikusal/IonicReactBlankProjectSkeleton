// src/components/LoginScreen/SignUpForm/SignUpForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonText
} from '@ionic/react';
import PadaiButton from '../../Common/Buttons/Button';
import { LoginForm } from '../../../pages/LoginScreen/LoginScreen.interface';
import { useAlert } from '../../../hooks/alertHooks/useAlert';
import { Board, Class, getLanguages, Language } from '../../../api/loginApi'; // <-- uses your POST API
import { getUserProfile } from '../../../utils/profileStorage';
import { signupUser } from '../../../services/loginService';
import { getBoards, getClasses } from '../../../api/contentApi/contentApi';
import { useIonRouter } from '@ionic/react';

type Props = {
  setStep: (s: 'phone' | 'login' | 'signup' | 'profile') => void;
  loginForm: LoginForm | null;
  setLoginForm: (lf: LoginForm) => void;
  FROM_PROFILE?: boolean;
};

const PadAISignUpForm: React.FC<Props> = ({ setStep, loginForm, setLoginForm, FROM_PROFILE = false }) => {
  const { presentAlert } = useAlert();
  const navigate = useIonRouter();
  // form fields
  const [name, setName] = useState<string>('');
  const [emailId, setEmailId] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [board, setBoard] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');
  const [langMedium, setLangMedium] = useState<string>(''); // code
  const [langNative, setLangNative] = useState<string>(''); // code

  const [languages, setLanguages] = useState<Language[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllClasses = async (board: number, langMedium: string) => {
    try {
      if (board && langMedium) {
        const classesResp = await getClasses({
          boardId: board,
          language: langMedium,
        });
        if (classesResp.data?.length) {
          setClasses(classesResp.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch classes', e);
    }
  }
  const getAllBoards = async (langMedium: string, boardId: number) => {
    try {
      const boardsResp = await getBoards({
        language: langMedium,
      });
      if (boardsResp.data?.length > 0) {
        setBoards(boardsResp.data);

        console.log('boardId', boardId);
        if (boardId) {
          getAllClasses(boardId, langMedium);
        }
      }
    } catch (e) {
      console.error('Failed to fetch boards', e);
    }
  }

  // Prefill + languages
  useEffect(() => {
    (async () => {
      // 1) prefill from saved profile if any
      const prof = await getUserProfile();
      let boardSelectd = (loginForm as any)?.boardId || prof?.boardId || '';
      console.log('boardSelectd', boardSelectd);

      // 2) then overlay loginForm values if present
      setMobileNo(loginForm?.phone_no || prof?.['mobileNo'] || '');
      setName(loginForm?.['full_name'] || prof?.name || '');
      setEmailId((loginForm as any)?.emailId || prof?.emailId || '');
      setBoard((loginForm as any)?.boardId || prof?.boardId || '');
      setStudentClass((loginForm as any)?.classId || prof?.classId || '');

      // 3) load languages from API
      try {
        const resp = await getLanguages();
        let mediumLanguageCode = '';
        let nativeLanguageCode = '';
        if (resp.data?.languages?.length) {
          setLanguages(resp.data.languages);

          const mediumLanguage = (loginForm as any)?.langMedium || prof?.langMedium || '';
          const nativeLanguage = (loginForm as any)?.langNative || prof?.langNative || '';

          console.log('mediumLanguage', mediumLanguage);
          console.log('nativeLanguage', nativeLanguage);
          console.log('resp.data', resp.data);
          if (mediumLanguage && resp.data && resp.data.languages && resp.data.languages.length > 0) {
            mediumLanguageCode = resp.data.languages.find((l) => l.code.toLowerCase() === mediumLanguage.toLowerCase())?.code || '';
          }
          if (nativeLanguage && resp.data && resp.data.languages && resp.data.languages.length > 0) {
            nativeLanguageCode = resp.data.languages.find((l) => l.code.toLowerCase() === nativeLanguage.toLowerCase())?.code || '';
          }
          // console.log('mediumLanguageCode', mediumLanguageCode);
          // console.log('nativeLanguageCode', nativeLanguageCode);
          setLangMedium(mediumLanguageCode);
          setLangNative(nativeLanguageCode);
        }

        // boards and classes
        getAllBoards(mediumLanguageCode, boardSelectd);
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
      await presentAlert({ header: 'Required', message: 'Please enter your name.', buttonsActions: [() => { }, () => { }] });
      return;
    }
    if (!mobileNo || mobileNo.trim().length < 10) {
      await presentAlert({ header: 'Invalid phone', message: 'Please enter a valid 10-digit mobile number.', buttonsActions: [() => { }, () => { }] });
      return;
    }

    if (!board) {
      await presentAlert({ header: 'Required', message: 'Please select your board.', buttonsActions: [() => { }, () => { }] });
      return;
    }
    if (!studentClass) {
      await presentAlert({ header: 'Required', message: 'Please select your class.', buttonsActions: [() => { }, () => { }] });
      return;
    }

    if (!langMedium) {
      await presentAlert({ header: 'Required', message: 'Please select your study/medium language.', buttonsActions: [() => { }, () => { }] });
      return;
    }
    if (!langNative) {
      await presentAlert({ header: 'Required', message: 'Please select your native language.', buttonsActions: [() => { }, () => { }] });
      return;
    }

    // let boardId: number = boards.find((b: Board) => b.code === board)?.boardId || 0;
    // let classId: number = classes.find((c: Class) => c.code === studentClass)?.classId || 0;

    // const payload = {
    //   name: name.trim(),
    //   emailId: emailId.trim() || undefined,
    //   mobileNo: mobileNo.trim(),
    //   board: boardId || undefined,
    //   class: classId || undefined,
    //   langMedium,
    //   langNative,
    // };

    try {
      setLoading(true);

      const resp = await signupUser({
        name: name.trim(),
        mobile: mobileNo.trim(),
        emailId: emailId.trim() || '',
        // board,
        // class: studentClass,
        boardId: parseInt(board),
        classId: parseInt(studentClass),
        langMedium,
        langNative,
      });

      if (resp?.status === 'UPDATED') {
        await presentAlert({
          header: 'Success',
          message: resp?.msg || 'Account created! Please log in with your new credentials.',
          buttonsActions: [() => {
            if (FROM_PROFILE) {
              navigate.push('/home', 'forward', 'replace');
            } else {
              setStep(FROM_PROFILE ? 'profile' : 'phone');
            }
          }, () => {
            if (FROM_PROFILE) {
              navigate.push('/home', 'forward', 'replace');
            } else {
              setStep(FROM_PROFILE ? 'profile' : 'phone');
            }
          }],
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

  const renderBoardOptions = () =>
    boards.map((b) => (
      <IonSelectOption key={b.boardId} value={b.boardId}>
        {b.code}
      </IonSelectOption>
    ));

  const renderClassOptions = () =>
    classes.map((c) => (
      <IonSelectOption key={c.classId} value={c.classId}>
        {c.code}
      </IonSelectOption>
    ));

  return (
    <div className="padAI-login-container">
      <IonCard className={`padAISignUpForm-container ${FROM_PROFILE ? 'padAISignUpForm-container-profile-card' : ''}`}>
        <IonCardHeader>
          <IonCardTitle>{FROM_PROFILE ? 'Edit your profile' : 'Create your account'}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className={`${FROM_PROFILE ? 'padAISignUpForm-container-profile-card-content' : ''}`}>

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
            <IonInput type="tel" value={mobileNo} placeholder="10-digit mobile number" readonly />
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
              onIonChange={(e) => {
                setBoard(e.detail.value);
                getAllClasses(e.detail.value, langMedium);
              }}
            >
              {renderBoardOptions()}
            </IonSelect>
          </IonItem>

          <IonItem lines="full" className="padAI-login-input">
            <IonLabel position="stacked">Class</IonLabel>
            <IonSelect
              interface="popover"
              placeholder="Select class"
              value={studentClass}
              onIonChange={(e) => setStudentClass(e.detail.value)}
              disabled={!board}
            >
              {renderClassOptions()}
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
              {loading ? 'Saving...' : FROM_PROFILE ? 'Update Profile' : 'Create Account'}
            </PadaiButton>
          </div>
          <div className=''>
            <PadaiButton
              onClick={(e) => {
                e.preventDefault();
                setStep(FROM_PROFILE ? 'profile' : 'phone');
                if (FROM_PROFILE) {
                  navigate.push('/home', 'forward', 'replace');
                } else {
                  setStep(FROM_PROFILE ? 'profile' : 'phone');
                }
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
