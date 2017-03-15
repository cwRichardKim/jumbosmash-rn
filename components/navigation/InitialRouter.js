'use strict';

/*
This is the file that decides which file to load. eg: login / navigation /
prerelease / postrelease
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Navigator,
} from 'react-native';

import NavigationContainer        from "./NavigationContainer.js";
import AuthContainer              from "../login/AuthContainer.js";
import DummyData                  from "./DummyData.js";
import ThankYouPage               from "./ThankYouPage.js"

const PageNames = require("../global/GlobalFunctions.js").pageNames();

const firebase = require('firebase');
const firebaseConfig = {
  apiKey: "AIzaSyCqxU8ZGcg7Tx-iJoB_IROCG_yj41kWA6A",
  authDomain: "jumbosmash-ddb99.firebase.com",
  databaseURL: "https://jumbosmash-ddb99.firebaseio.com/",
  storageBucket: "jumbosmash-ddb99.appspot.com",
};
firebase.initializeApp(firebaseConfig);

class InitialRouter extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  _renderNavigatorScene (route, navigator) {
    let user=firebase.auth().currentUser;
    if (route.name == PageNames.expiredPage) {
      return (
        <ThankYouPage
          dummyMyProfile={DummyData.myProfile}
          dummyProfiles={DummyData.profiles}
        />
      )
    } else if (route.name == PageNames.appHome) {
      return (
        <NavigationContainer
          dummyMyProfile={DummyData.myProfile}
          firebase={firebase}
          routeNavigator={navigator}
        />
      );
    } else {
      return (
        <AuthContainer
          firebase={firebase}
          routeNavigator={navigator}
        />
      )
    }
  }

  render() {
    let user = firebase.auth().currentUser;
    let userIsLoggedIn = user && user.emailVerified;
    let appHasExpired = false;

    let initialRouteName = PageNames.appHome;
    if (!userIsLoggedIn) {
      initialRouteName = PageNames.auth;
    }
    if (appHasExpired) {
      initialRouteName = PageNames.expiredPage;
    }

    return (
      <View style={{flex: 1}}>
        <Navigator
          ref={(elem)=>{this.navigator = elem}}
          initialRoute={{name: initialRouteName}}
          renderScene={this._renderNavigatorScene.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
});

  export default InitialRouter;
