import { useEffect, useState } from 'react';
import { 
    IonPage, 
    IonHeader, 
    IonContent, 
    IonImg, 
    IonText, 
    IonItem, 
    IonLabel, 
    IonIcon,
    IonButton,
    IonButtons,
    useIonRouter
} from '@ionic/react';
import { 
    pencilOutline, 
    notificationsOutline, 
    languageOutline, 
    shieldCheckmarkOutline, 
    locationOutline, 
    helpCircleOutline,
    chatbubbleOutline,
    lockClosedOutline,
    notifications,
    refreshOutline,
    ellipsisVertical,
    checkmarkCircle,
    logOutOutline
} from 'ionicons/icons';
import Commonheader from '../../components/Common/Commonheader/Commonheader';
import vectoreBgImage from '/assets/images/dashboardScreen/topVectorOne.png';
import { clearUserProfile, getUserProfile, UserProfile } from '../../utils/profileStorage';
import './UserProfileScreen.css';
import Backheader from '../../components/Common/Backheader/Backheader';
import PadAISignUpForm from '../../components/LoginScreen/SignUpForm/SignUpForm';

const UserProfileScreen: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useIonRouter();

    const [editProfileTabActive, setEditProfileTabActive] = useState<boolean>(true);

    const getUserProfileData = async () => {
        try {
            setIsLoading(true);
            const profile = await getUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserProfileData();
    }, []);

    const handleEditProfile = () => {
        // Navigate to edit profile screen
        console.log('Edit profile clicked');
        setEditProfileTabActive(true);
    };

    const handleLogout = () => {
        clearUserProfile();
        navigate.push('/login', 'root');
    };

    const menuItems = [
        { icon: pencilOutline, text: 'Edit profile information', action: handleEditProfile },
        { icon: notificationsOutline, text: 'Notifications', status: 'ON', action: () => {} },
        { icon: languageOutline, text: 'Language', value: 'English', action: () => {} },
        { icon: shieldCheckmarkOutline, text: 'Security', action: () => {} },
        { icon: locationOutline, text: 'Theme', value: 'Light mode', action: () => {} },
        { icon: helpCircleOutline, text: 'Help & Support', action: () => {} },
        { icon: chatbubbleOutline, text: 'Contact us', action: () => {} },
        { icon: lockClosedOutline, text: 'Privacy policy', action: () => {} },
        { icon: logOutOutline, text: 'Logout', action: handleLogout },
    ];

    return (
        <IonPage>
            {/* <Commonheader /> */}
            <Backheader/>
            <IonImg src={vectoreBgImage} alt="headerBanner" className='padAIvectorTwoBg' />
            <IonContent className='userProfileScreen-content'>
                <div className="userProfile-container">
                    {/* Profile Section */}
                    {!editProfileTabActive && <div className="userProfile-section">
                        <div className="profileImage-container">
                            <div className="profileImage-placeholder">
                                <IonText>{!userProfile || !userProfile?.name ? 'GU' : userProfile?.name?.split(' ')[0]?.charAt(0)+''+(userProfile?.name &&userProfile?.name?.split(' ')?.length > 1 ? userProfile?.name?.split(' ')[userProfile?.name?.split(' ')?.length - 1]?.charAt(0) : '')}</IonText>
                            </div>
                            {/* <div className="profileImage-edit" onClick={handleEditProfile}>
                                <IonIcon icon={pencilOutline} />
                            </div> */}
                        </div>
                        <div className="userProfile-info">
                            <IonText>
                                <h2 className="userProfile-name">{userProfile?.name || 'Guest User'}</h2>
                            </IonText>
                            <IonText className="userProfile-contact">
                                <p>{userProfile?.emailId || ''} | {userProfile?.mobileNo || ''}</p>
                            </IonText>
                        </div>
                    </div>}

                    {/* Menu Items */}
                    {/* {!editProfileTabActive && <div className="userProfile-menu" >
                        {menuItems.map((item, index) => (
                            <IonItem 
                                key={index} 
                                lines="full" 
                                button 
                                onClick={item.action}
                                className="userProfile-menuItem"
                            >
                                <IonIcon icon={item.icon} slot="start" className="menuItem-icon" />
                                <IonLabel>
                                    <p className="menuItem-text">{item.text}</p>
                                </IonLabel>
                                {item.status && (
                                    <IonText slot="end" className="menuItem-status">
                                        {item.status}
                                    </IonText>
                                )}
                                {item.value && (
                                    <IonText slot="end" className="menuItem-value">
                                        {item.value}
                                    </IonText>
                                )}
                                {!item.status && !item.value && (
                                    <IonIcon icon={checkmarkCircle} slot="end" className="menuItem-check" />
                                )}
                            </IonItem>
                        ))}
                    </div>} */}
                    {editProfileTabActive && <div className="userProfile-menu">
                        <PadAISignUpForm 
                            setStep={(step)=>{
                                if(step === 'profile'){
                                    setEditProfileTabActive(false);
                                }
                            }}
                            loginForm={null}
                            setLoginForm={()=>{}}
                            FROM_PROFILE={true}
                        />
                    </div>}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default UserProfileScreen;

