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
  AsyncStorage,
} from 'react-native';

import NavigationContainer        from "./NavigationContainer.js";
import AuthContainer              from "../login/AuthContainer.js";
import DummyData                  from "../misc/DummyData.js";
import ThankYouPage               from "../misc/ThankYouPage.js";
import LoadingPage                from "../misc/LoadingPage.js";

const PageNames = require("../global/GlobalFunctions.js").pageNames();
const StorageKeys = require("../global/GlobalFunctions.js").storageKeys();

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
    this.didGetUserAndProfile = false;
    this.state = {
      myProfile: null,
    }
  }

  componentDidMount() {
    this._shouldFetchUserAndProfile();
  }

  async _shouldFetchUserAndProfile() {
    firebase.auth().onAuthStateChanged(async function(user) {
      if (!this.didGetUserAndProfile) {
        this.didGetUserAndProfile = true;
        let myProfile = await this._shouldFetchUserAndProfile();
        myProfile = DummyData.myProfile; //TODO: @richard remove this once accounts are created
        if (user && user.emailVerified && myProfile) {
          this.setState({myProfile});
          this.navigator.replace({name: PageNames.appHome});
        } else {
          this.navigator.replace({name: PageNames.auth});
        }
      }
    }.bind(this));
  }

  async _shouldFetchMyProfileFromStorage() {
    try {
      let storedMyProfile = await AsyncStorage.getItem(StorageKeys.myProfile);
      if (storedMyProfile !== null && typeof(storedMyProfile) !== "undefined") {
        storedMyProfile = JSON.parse(storedMyProfile);
        if (storedMyProfile && storedMyProfile.id) {
          return storedMyProfile;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error; //TODO @richard notify user
      return null;
    }
  }

  _renderNavigatorScene (route, navigator) {
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
          myProfile={this.state.myProfile}
        />
      );
    } else if (route.name == PageNames.loadingPage) {
      return (
        <LoadingPage/>
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
    let appHasExpired = false;

    let initialRouteName = PageNames.loadingPage;
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
