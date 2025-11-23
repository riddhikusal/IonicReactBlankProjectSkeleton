import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonText,
  IonAvatar,
  IonFooter,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, informationCircleOutline, informationCircleSharp, languageSharp, languageOutline, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, videocamOutline, personOutline, helpCircleOutline, chatbubbleOutline, logOutOutline } from 'ionicons/icons';
import './Menu.css';
import { getUserProfile, UserProfile, clearUserProfile } from '../utils/profileStorage';
import { useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'About',
    url: '/user-profile',
    iosIcon: personOutline,
    mdIcon: personOutline
  },
  {
    title: 'Reels',
    url: '/reels',
    iosIcon: videocamOutline,
    mdIcon: videocamOutline
  },
  {
    title: 'Notifications',
    url: '/user-profile',
    iosIcon: informationCircleOutline,
    mdIcon: informationCircleOutline
  },
  {
    title: 'Language',
    url: '/user-profile',
    iosIcon: languageOutline,
    mdIcon: languageOutline
  },
  {
    title: 'Contact us',
    url: '/user-profile',
    iosIcon: chatbubbleOutline,
    mdIcon: chatbubbleOutline
  },
  {
    title: 'FAQ',
    url: '/user-profile',
    iosIcon: helpCircleOutline,
    mdIcon: helpCircleOutline
  },

  // {
  //   title: 'Outbox',
  //   url: '/folder/Outbox',
  //   iosIcon: paperPlaneOutline,
  //   mdIcon: paperPlaneSharp
  // },
  // {
  //   title: 'Favorites',
  //   url: '/folder/Favorites',
  //   iosIcon: heartOutline,
  //   mdIcon: heartSharp
  // },
  // {
  //   title: 'Archived',
  //   url: '/folder/Archived',
  //   iosIcon: archiveOutline,
  //   mdIcon: archiveSharp
  // },
  // {
  //   title: 'Trash',
  //   url: '/folder/Trash',
  //   iosIcon: trashOutline,
  //   mdIcon: trashSharp
  // },
  // {
  //   title: 'Spam',
  //   url: '/folder/Spam',
  //   iosIcon: warningOutline,
  //   mdIcon: warningSharp
  // }
];

const labels: string[] = ['Favourites', 'Recent Read', 'History', 'Settings'];

const Menu: React.FC = () => {
  const location = useLocation();
  const navigate = useIonRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);


  const getUserProfileData = async () => {
    const userProfile = await getUserProfile();
    setUserProfile(userProfile);
  }

  useEffect(() => {
    getUserProfileData();
  }, []);

  const handleLogout = () => {
    clearUserProfile();
    navigate.push('/login', 'root');
  };

  return (
    <IonMenu contentId="main" type="overlay" swipeGesture={false}>
      <IonContent className='p-0 sideNav_ion_content' style={{padding: '0px !important'}}>
        <IonList id="inbox-list" className='p-0' style={{padding: '0px !important'}}>
          <IonListHeader className='p-3 bg-light' style={{ textTransform: 'capitalize' }}>
            <div className="profileImage-container" style={{marginBottom:'0px'}}>
              <IonAvatar className="profile-avatar">
                <div className="profileImage-placeholder">
                  <IonText>{!userProfile || !userProfile?.name ? 'GU' : userProfile?.name?.split(' ')[0]?.charAt(0) + '' + (userProfile?.name && userProfile?.name?.split(' ')?.length > 1 ? userProfile?.name?.split(' ')[userProfile?.name?.split(' ')?.length - 1]?.charAt(0) : '')}</IonText>
                </div>
              </IonAvatar>
              {/* <div className="profileImage-edit" onClick={handleEditProfile}>
                                <IonIcon icon={pencilOutline} />
                            </div> */}
            </div>
            <div className="profileImage-info">
              <IonText>{userProfile?.name || 'Guest User'}</IonText>
              <IonNote>{userProfile?.mobileNo || 'Not available'}</IonNote>
            </div>
            </IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false} className='p-3'>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        {/* <IonList id="labels-list" className='p-3'>
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon aria-hidden="true" slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
      
      <IonFooter className="menu-footer">
        <IonMenuToggle autoHide={false}>
          <IonItem 
            button 
            onClick={handleLogout}
            lines="none"
            className="logout-item"
          >
            <IonIcon aria-hidden="true" slot="start" icon={logOutOutline} />
            <IonLabel>Logout</IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
