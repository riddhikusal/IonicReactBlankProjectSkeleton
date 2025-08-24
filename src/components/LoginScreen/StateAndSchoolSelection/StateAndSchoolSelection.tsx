import { IonCard, IonCardContent, IonItem, IonList, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import React from 'react';
import '../LoginScreen.css';
import PadaiButton from '../../Common/Buttons/Button';
import { useHistory } from 'react-router-dom';
import { LoginForm } from '../../../pages/LoginScreen/LoginScreen.interface';

interface StateAndSchoolSelectionProps {
    setStep: (step: number) => void;
    loginForm: LoginForm;
    setLoginForm: (loginForm: LoginForm) => void;
}

const PadAIStateAndSchoolSelection = ({ setStep, loginForm, setLoginForm }: StateAndSchoolSelectionProps) => {
    const history = useHistory();
    return (
        <div className='padAILogin-container'>
            <IonCard className='padAILoginCard'>
                <IonCardContent>
                    <IonText className='ion-margin-bottom'>
                        <p className='padAILoginTitle'>Sign Up</p>
                        <p className='padAILoginSubTitle'>Select your state and school</p>
                    </IonText>
                    <IonText className='ion-margin-top'>
                        <p className='padAIInputLabel'>State</p>
                    </IonText>
                    <IonItem className='padAIInput' lines='none'>
                        <IonSelect aria-label="state" interface="modal" placeholder="Select state" label-placement="stacked" value={loginForm.login_screen_state_and_school_selection.state} onIonChange={(e) => setLoginForm({ ...loginForm, login_screen_state_and_school_selection: { ...loginForm.login_screen_state_and_school_selection, state: e.detail.value || '' } })}>
                            <IonSelectOption value="Delhi">Delhi</IonSelectOption>
                            <IonSelectOption value="Maharashtra">Maharashtra</IonSelectOption>
                            <IonSelectOption value="Tamil Nadu">Tamil Nadu</IonSelectOption>
                            <IonSelectOption value="Karnataka">Karnataka</IonSelectOption>
                            <IonSelectOption value="Kerala">Kerala</IonSelectOption>
                            <IonSelectOption value="Andhra Pradesh">Andhra Pradesh</IonSelectOption>
                            <IonSelectOption value="Telangana">Telangana</IonSelectOption>
                            <IonSelectOption value="Uttar Pradesh">Uttar Pradesh</IonSelectOption>
                            <IonSelectOption value="West Bengal">West Bengal</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonText className='ion-margin-top'>
                        <p className='padAIInputLabel'>School</p>
                    </IonText>
                    <IonItem className='padAIInput' lines='none'>
                        <IonSelect aria-label="school" interface="modal" placeholder="Select school" label-placement="stacked" value={loginForm.login_screen_state_and_school_selection.school} onIonChange={(e) => setLoginForm({ ...loginForm, login_screen_state_and_school_selection: { ...loginForm.login_screen_state_and_school_selection, school: e.detail.value || '' } })}>
                            <IonSelectOption value="School 1">School 1</IonSelectOption>
                            <IonSelectOption value="School 2">School 2</IonSelectOption>
                            <IonSelectOption value="School 3">School 3</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <div className='ion-margin-top'>
                        <PadaiButton
                            onClick={(e) => {
                                e.preventDefault();
                                setStep(2);
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
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default PadAIStateAndSchoolSelection;