import { IonCard, IonCardContent, IonInput, IonItem, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import React, { useState } from 'react';
import { defaultRegistrationForm, LoginForm, RegistrationForm } from '../../../pages/LoginScreen/LoginScreen.interface';
import PadaiButton from '../../Common/Buttons/Button';
import { defaultAlertProps, useAlert } from '../../../hooks/alertHooks/useAlert';

interface SignUpFormProps {
    setStep: (step: number) => void;
    loginForm: LoginForm;
    setLoginForm: (loginForm: LoginForm) => void;
}

const PadAISignUpForm = ({ setStep, loginForm, setLoginForm }: SignUpFormProps) => {
    const [signUpForm, setSignUpForm] = useState<RegistrationForm>(JSON.parse(JSON.stringify(defaultRegistrationForm)));
    const { presentAlert, dismiss } = useAlert();
    const handleContinue = () => {
        if (signUpForm.board === '' || signUpForm.class === '' || signUpForm.language_medium === '' || signUpForm.language_native === '') {
            presentAlert({ message: 'Please enter all the fields', header: 'Error', buttonsActions: [() => { setStep(1); }, () => { setStep(1); }] });
            return;
        }
        setLoginForm({ ...loginForm, registration_form: signUpForm });
        setStep(2);
    }
    return (
        <div className='padAILogin-container'>
            <IonCard className='padAILoginCard'>
                <IonCardContent>
                    <IonText className='ion-margin-bottom'>
                        <p className='padAILoginTitle'>Set Up Profile</p>
                        <p className='padAILoginSubTitle'>Tell us about your study to personalize your tutor</p>
                    </IonText>
                    {/* Board */}
                    <IonText className='ion-margin-top'>
                        <p className='padAIInputLabel'>Board</p>
                    </IonText>
                    <IonItem className='padAIInput' lines='none'>
                        <IonInput type="text" placeholder="Enter your board" value={signUpForm.board} onIonChange={(e) => setSignUpForm({ ...signUpForm, board: e.detail.value || '' })} />
                    </IonItem>
                    {/* Class */}
                    <IonText className='ion-margin-top'>
                        <p className='padAIInputLabel'>Class</p>
                    </IonText>
                    <IonItem className='padAIInput' lines='none'>
                        <IonInput type="tel" placeholder="Enter your class" value={signUpForm.class} onIonChange={(e) => setSignUpForm({ ...signUpForm, class: e.detail.value || '' })} />
                    </IonItem>

                    {/* Language Medium */}
                    <IonText className='ion-margin-top'>
                        <p className='padAIInputLabel'>Language (Medium)</p>
                    </IonText>
                    <IonItem className='padAIInput' lines='none'>
                        <IonSelect aria-label="language_medium" interface="modal" placeholder="Select language medium" label-placement="stacked" value={signUpForm.language_medium} onIonChange={(e) => setSignUpForm({ ...signUpForm, language_medium: e.detail.value || '' })}>
                            <IonSelectOption value="English">English</IonSelectOption>
                            <IonSelectOption value="Hindi">Hindi</IonSelectOption>
                            <IonSelectOption value="Kannada">Kannada</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    {/* Language Native */}
                    <IonText className='ion-margin-top'>
                        <p className='padAIInputLabel'>Language (Native)</p>
                    </IonText>
                    <IonItem className='padAIInput' lines='none'>
                        <IonSelect aria-label="language_native" interface="modal" placeholder="Select language native" label-placement="stacked" value={signUpForm.language_native} onIonChange={(e) => setSignUpForm({ ...signUpForm, language_native: e.detail.value || '' })}>
                            <IonSelectOption value="English">English</IonSelectOption>
                            <IonSelectOption value="Hindi">Hindi</IonSelectOption>
                            <IonSelectOption value="Kannada">Kannada</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <div className='ion-margin-top'>
                        <PadaiButton
                            onClick={(e) => {
                                e.preventDefault();
                                handleContinue();
                            }}
                            color='warning'
                            size='large'
                            type='button'
                            fill='solid'
                            expand='block'
                        >
                            Continue
                        </PadaiButton>
                    </div>
                    <div className=''>
                        <PadaiButton
                            onClick={(e) => {
                                e.preventDefault();
                                setStep(2);
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