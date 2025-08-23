import React from 'react'
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import LandingScreen from '../pages/LandingScreen/LandingScreen';
import Home from '../pages/Home';

const AppRoutes = () => {
    return (
        <IonReactRouter>
            <IonRouterOutlet>
                <Route path="/landing" component={LandingScreen} exact={true} />
                <Route path="/home" component={Home} exact={true} />
                <Route exact path="/" render={() => <Redirect to="/landing" />} />
            </IonRouterOutlet>
        </IonReactRouter>
    )
}

export default AppRoutes;