import { IonCol, IonContent, IonHeader, IonImg, IonItem, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './HomeScreen.css';
import Commonheader from '../../components/Common/Commonheader/Commonheader';
import PadaiButton from '../../components/Common/Buttons/Button';
const PadAIHomeScreen: React.FC = () => {
    const navigate = useIonRouter();
    return (
        <IonPage>
            <Commonheader />
            <IonImg src="/assets/images/dashboardScreen/topVectorOne.png" alt="headerBanner" className='padAIvectorTwoBg' />
            <IonContent className='padAIhomeScreen-content'>
                <div className='padAIHomeSection-Container'>
                    <IonImg src="/assets/images/dashboardScreen/bookVectorTwo.png" alt="headerBanner" className='padAIvectorBookIcon' />
                    <IonText className='padAIHomesubTitle'>
                        Select Your Learning Path By
                    </IonText>
                    <IonText className='padAIHomebigTitle' color={'secondary'}>
                        Setup Your Profile
                    </IonText>
                    <IonText className='padAIHomesemisubTitle'>
                        Choose your Board, Class, Language (Medium) & Language (Native) to start learning with our AI tutor
                    </IonText>
                    <div className='padAIHome-dropdown-section'>
                        <IonRow>
                            <IonCol size="6">
                                <IonText className='ion-margin-top'>
                                    <p className='padAIInputLabel'>Board</p>
                                </IonText>
                                <IonItem className='padAIHomeScreenDropdown' lines='none'>
                                    <IonSelect aria-label="board" interface="modal" placeholder="Select board" label-placement="stacked" >
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
                            </IonCol>
                            <IonCol size="6">
                                <IonText className='ion-margin-top'>
                                    <p className='padAIInputLabel'>Class</p>
                                </IonText>
                                <IonItem className='padAIHomeScreenDropdown' lines='none'>
                                    <IonSelect aria-label="class" interface="modal" placeholder="Select class" label-placement="stacked" >
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
                            </IonCol>
                            <IonCol size="6">
                                <IonText className='ion-margin-top'>
                                    <p className='padAIInputLabel'>Subject</p>
                                </IonText>
                                <IonItem className='padAIHomeScreenDropdown' lines='none'>
                                    <IonSelect aria-label="subject" interface="modal" placeholder="Select subject" label-placement="stacked" >
                                        <IonSelectOption value="Delhi">Delhi</IonSelectOption>
                                        <IonSelectOption value="Maharashtra">Maharashtra</IonSelectOption>
                                        <IonSelectOption value="Tamil Nadu">Tamil Nadu</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonText className='ion-margin-top'>
                                    <p className='padAIInputLabel'>Book</p>
                                </IonText>
                                <IonItem className='padAIHomeScreenDropdown' lines='none'>
                                    <IonSelect aria-label="book" interface="modal" placeholder="Select book" label-placement="stacked" >
                                            <IonSelectOption value="English">English</IonSelectOption>
                                            <IonSelectOption value="Hindi">Hindi</IonSelectOption>
                                            <IonSelectOption value="Kannada">Kannada</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <div className='padAIHomeContinueBtn'>
                            <PadaiButton children="Get Start"
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    navigate.push('/video-content', 'forward');
                                }}
                                color="warning"
                                size="default"
                                type="button"
                                shape="round"
                                fill="solid"
                                expand="block"></PadaiButton>
                        </div>

                    </div>
                </div>
            </IonContent>
        </IonPage >
    );
};

export default PadAIHomeScreen;