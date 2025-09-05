import { IonCard, IonCardContent, IonInput, IonInputPasswordToggle, IonItem, IonLabel, IonList, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import React, { useState } from 'react';
import '../LoginScreen.css';
import PadaiButton from '../../Common/Buttons/Button';
// import { useHistory } from 'react-router-dom';
import { useIonRouter } from '@ionic/react';
import { LoginForm } from '../../../pages/LoginScreen/LoginScreen.interface';
import { useAlert } from '../../../hooks/alertHooks/useAlert';

const dummyPhoneNo = '9876543210';
const dummyEmail = 'test@test.com';

interface PhoneNoValidationProps {
    setStep: (step: number) => void;
    loginForm: LoginForm;
    setLoginForm: (loginForm: LoginForm) => void;
}

const PadAIPhoneNoValidation = ({ setStep, loginForm, setLoginForm }: PhoneNoValidationProps) => {
    const [segmentValue, setSegmentValue] = useState<'phone' | 'email'>('phone');
    const [phoneNo, setPhoneNo] = useState<string>(dummyPhoneNo);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isPhoneOrEmailVerified, setIsPhoneOrEmailVerified] = useState<boolean>(false);
    // const history = useHistory();
    const navigate = useIonRouter();

    // Alert Hooks
    const { presentAlert, dismiss } = useAlert();

    const handleContinue = () => {
        if (segmentValue === 'phone') {
            if (phoneNo == dummyPhoneNo) {
                setIsPhoneOrEmailVerified(true);
                setLoginForm({ ...loginForm, phone_no: phoneNo });
                // navigateToHomeScreen();
            } else {
                setIsPhoneOrEmailVerified(false);
                presentAlert({ message: 'Invalid phone number', header: 'Error', buttons: [() => { setStep(2); }] });
            }
        } else {
            if (email === dummyEmail) {
                setIsPhoneOrEmailVerified(true);
                setLoginForm({ ...loginForm, email: email });
            } else {
                setIsPhoneOrEmailVerified(false);
                setStep(2);
            }
        }
    }

    const navigateToHomeScreen = () => {
        navigate.push('/landing','forward','replace');
    }

    return (
        <div className='padAILogin-container'>
            <IonCard className='padAILoginCard'>
                <IonCardContent>
                    <IonText className='ion-margin-bottom'>
                        <p className='padAILoginTitle'>Sign In/ Sign Up</p>
                        <p className='padAILoginSubTitle'>Use your mobile phone number or email</p>
                    </IonText>


                    <IonSegment className='padAISegment' mode='ios' value={segmentValue} onIonChange={(e) => {
                        setSegmentValue(e.detail.value as 'phone' | 'email');
                    }}>
                        <IonSegmentButton value="phone" className='padAISegmentButton'>
                            <IonLabel>Phone</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="email" className='padAISegmentButton'>
                            <IonLabel>Email</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {segmentValue === 'phone' && (
                        <>
                            <IonText className='ion-margin-top'>
                                <p className='padAIInputLabel'>Phone Number</p>
                            </IonText>
                            <IonItem className='padAIInput' lines='none'>
                                <IonInput type="tel" placeholder="Enter your phone number" value={phoneNo} onIonInput={(e) => {
                                    console.log(e.target?.value);
                                    console.log(typeof e.target?.value);
                                    setPhoneNo((e.target?.value as string) || '')}} />
                            </IonItem>
                        </>
                    )}

                    {segmentValue === 'email' && (
                        <>
                            <IonText className='ion-margin-top'>
                                <p className='padAIInputLabel'>Email</p>
                            </IonText>
                            <IonItem className='padAIInput' lines='none'>
                                <IonInput type="email" placeholder="Enter your email" value={email} onIonInput={(e) => setEmail((e.target?.value as string) || '')} />
                            </IonItem>
                        </>
                    )}

                    {isPhoneOrEmailVerified && (
                        <>
                            <IonText className='ion-margin-top'>
                                <p className='padAIInputLabel'>Enter Password</p>
                            </IonText>
                            <IonItem className='padAIInput' lines='none'>
                                <IonInput type="password" placeholder='XXXXXXX' value="">
                                    <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                </IonInput>
                            </IonItem>
                        </>
                    )}

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
                            {!isPhoneOrEmailVerified ? 'Send Password' : 'Continue'}
                        </PadaiButton>
                    </div>
                    <div className=''>
                        <PadaiButton
                            onClick={(e) => {
                                e.preventDefault();
                                setStep(1);
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

export default PadAIPhoneNoValidation;  