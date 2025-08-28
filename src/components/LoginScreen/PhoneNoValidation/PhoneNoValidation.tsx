//src/components/LoginScreen/PhoneNoValidation/PhoneNoValidation.tsx
import { IonCard, IonCardContent, IonInput, IonInputPasswordToggle, IonItem, IonLabel, IonList, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import React, { useState } from 'react';
import '../LoginScreen.css';
import PadaiButton from '../../Common/Buttons/Button';
import { useHistory } from 'react-router-dom';
import { LoginForm } from '../../../pages/LoginScreen/LoginScreen.interface';
import { getMobileValidation, validateLogin } from '../../../services/loginService';

// const dummyPhoneNo = '9876543210';
// const dummyEmail = 'test@test.com';

interface PhoneNoValidationProps {
    setStep: (step: string) => void;
    loginForm: LoginForm;
    setLoginForm: (loginForm: LoginForm) => void;
}

const PadAIPhoneNoValidation = ({ setStep, loginForm, setLoginForm }: PhoneNoValidationProps) => {
    const [segmentValue, setSegmentValue] = useState<'phone' | 'email'>('phone');
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isPhoneVerified, setisPhoneVerified] = useState<boolean>(false);
    //const [isOtpRequested, setisOtpRequested] = useState<boolean>(false);
    const [event, setEvent] = useState<'validate_mobile' | 'send_otp' | 'validate_otp' | 'login'>('validate_mobile');

    const handleContinue = async () => {
        // if (segmentValue === 'phone') {
        if(event === 'validate_mobile'){ 
            const res = await getMobileValidation(phoneNo);
            const isRegistered = !!(res.isRegistered ?? res.registered ?? (res.status?.toLowerCase() === 'registered'));
            if (isRegistered) {
                setisPhoneVerified(true);
                setEvent('login');
                setLoginForm({ ...loginForm, phone_no: phoneNo });
            } else {
                // setisPhoneVerified(false);
                // setStep('signup');
                setEvent('send_otp');
            }
        }
        if(event === 'send_otp') {

        }
        if(event === 'login') {
            const loginRes = await validateLogin(phoneNo, password);
              if (loginRes.status?.toLowerCase() === 'success') {
                    alert(loginRes.msg);
                } else {
                    alert('Login failed');
                }
        }
        // } 
        // else {
        //     if (email === dummyEmail) {
        //         setisPhoneVerified(true);
        //         setLoginForm({ ...loginForm, email: email });
        //     } else {
        //         setisPhoneVerified(false);
        //         setStep(3);
        //     }
        // }
    }

    const getButtonText = (evnt) => {
        let buttonText;
        
        switch (evnt) {
            case 'validate_mobile':
            buttonText = 'Validate & Continue';
            break;
            case 'login':
            buttonText = 'Login';
            break;
            default:
            buttonText = 'Continue';
            break;
        }
        
        return buttonText;
    };

    return (
        <div className='padAILogin-container'>
            <IonCard className='padAILoginCard'>
                <IonCardContent>
                    <IonText className='ion-margin-bottom'>
                        <p className='padAILoginTitle'>Sign In/ Sign Up</p>
                        <p className='padAILoginSubTitle'>Use your mobile phone number or email</p>
                    </IonText>


                    {/* <IonSegment className='padAISegment' mode='ios' value={segmentValue} onIonChange={(e) => setSegmentValue(e.detail.value as 'phone' | 'email')}>
                        <IonSegmentButton value="phone" className='padAISegmentButton'>
                            <IonLabel>Phone</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="email" className='padAISegmentButton'>
                            <IonLabel>Email</IonLabel>
                        </IonSegmentButton>
                    </IonSegment> */}

                    {/* {segmentValue === 'phone' && ( */}
                        <>
                            <IonText className='ion-margin-top'>
                                <p className='padAIInputLabel'>Phone Number</p>
                            </IonText>
                            <IonItem className='padAIInput' lines='none'>
                                <IonInput type="tel" placeholder="Enter your phone number" value={phoneNo} onIonInput={(e) => setPhoneNo((e.target as HTMLInputElement).value || '')}
 />
                            </IonItem>
                        </>
                    {/* )} */}

                    {/* {segmentValue === 'email' && (
                        <>
                            <IonText className='ion-margin-top'>
                                <p className='padAIInputLabel'>Email</p>
                            </IonText>
                            <IonItem className='padAIInput' lines='none'>
                                <IonInput type="email" placeholder="Enter your email" value={email} onIonChange={(e) => setEmail(e.detail.value || '')} />
                            </IonItem>
                        </>
                    )} */}

                    {isPhoneVerified && (
                        <>
                            <IonText className='ion-margin-top'>
                                <p className='padAIInputLabel'>Enter Password</p>
                            </IonText>
                            <IonItem className='padAIInput' lines='none'>
                                <IonInput type="password" placeholder='XXXXXXX' value={password} onIonInput={(e) => setPassword((e.target as HTMLInputElement).value || '')}>
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
                            {/* {!isPhoneVerified ? 'Validate & Continue' : 'Continue'} */}
                            {/* {event === 'validate_mobile' ? 'Validate & Continue' : event === 'send_otp' ? 'Send OTP' : 'Login'} */}
                            {/* {event === 'validate_mobile' ? 'Validate & Continue' : event === 'login' ? 'Login' : 'Continue'} */}
                            {getButtonText(event)}
                            
                        </PadaiButton>
                    </div>
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default PadAIPhoneNoValidation;  