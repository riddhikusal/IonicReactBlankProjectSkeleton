import { IonCard, IonCardContent, IonInput, IonInputPasswordToggle, IonItem, IonLabel, IonList, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import React, { useState } from 'react';
import '../LoginScreen.css';
import PadaiButton from '../../Common/Buttons/Button';
import { useHistory } from 'react-router-dom';
import { LoginForm } from '../../../pages/LoginScreen/LoginScreen.interface';

const dummyPhoneNo = '9876543210';
const dummyEmail = 'test@test.com';

interface PhoneNoValidationProps {
    setStep: (step: number) => void;
    loginForm: LoginForm;
    setLoginForm: (loginForm: LoginForm) => void;
}

const PadAIPhoneNoValidation = ({ setStep, loginForm, setLoginForm }: PhoneNoValidationProps) => {
    const [segmentValue, setSegmentValue] = useState<'phone' | 'email'>('phone');
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isPhoneOrEmailVerified, setIsPhoneOrEmailVerified] = useState<boolean>(false);

    const handleContinue = () => {
        if (segmentValue === 'phone') {
            if (phoneNo === dummyPhoneNo) {
                setIsPhoneOrEmailVerified(true);
                setLoginForm({ ...loginForm, phone_no: phoneNo });
            } else {
                setIsPhoneOrEmailVerified(false);
                setStep(3);
            }
        } else {
            if (email === dummyEmail) {
                setIsPhoneOrEmailVerified(true);
                setLoginForm({ ...loginForm, email: email });
            } else {
                setIsPhoneOrEmailVerified(false);
                setStep(3);
            }
        }
    }

    return (
        <div className='padAILogin-container'>
            <IonCard className='padAILoginCard'>
                <IonCardContent>
                    <IonText className='ion-margin-bottom'>
                        <p className='padAILoginTitle'>Sign In/ Sign Up</p>
                        <p className='padAILoginSubTitle'>Use your mobile phone number or email</p>
                    </IonText>


                    <IonSegment className='padAISegment' mode='ios' value={segmentValue} onIonChange={(e) => setSegmentValue(e.detail.value as 'phone' | 'email')}>
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
                                <IonInput type="tel" placeholder="Enter your phone number" value={phoneNo} onIonChange={(e) => setPhoneNo(e.detail.value || '')} />
                            </IonItem>
                        </>
                    )}

                    {segmentValue === 'email' && (
                        <>
                            <IonText className='ion-margin-top'>
                                <p className='padAIInputLabel'>Email</p>
                            </IonText>
                            <IonItem className='padAIInput' lines='none'>
                                <IonInput type="email" placeholder="Enter your email" value={email} onIonChange={(e) => setEmail(e.detail.value || '')} />
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
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default PadAIPhoneNoValidation;  