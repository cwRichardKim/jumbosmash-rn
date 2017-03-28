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
import GlobalFunctions            from "../global/GlobalFunctions.js";

const PageNames = require("../global/GlobalFunctions.js").pageNames();
const StorageKeys = require("../global/GlobalFunctions.js").storageKeys();

const AppExpirationStates = GlobalFunctions.appExpirationStates();
const APP_STATE = GlobalFunctions.calculateAppExpirationState();

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
    this.firstTimeMyProfile = null; // first login / signup, this is required because state isn't guaranteed to update in time
    this.shouldOverridePageLoads = false; //allows user to override the expired or prerelease page

    this.state = {
      myProfile: null,
    }
  }

  componentDidMount() {
    this._shouldFetchUserAndProfile();
  }

  _setMyProfile (myProfile) {
    this.setState(myProfile);
    this.firstTimeMyProfile = myProfile;
  }

  async _shouldFetchUserAndProfile() {
    firebase.auth().onAuthStateChanged(async function(user) {
      if (!this.didGetUserAndProfile) {
        this.didGetUserAndProfile = true;
        let myProfile = await this._shouldFetchMyProfileFromStorage();
        if (user && user.emailVerified && myProfile) {
          this.setState({myProfile});
          this._loadPage(PageNames.appHome);
        } else {
          this._loadPage(PageNames.auth);
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
        }
      }
    } catch (error) {
      throw error; //TODO @richard notify user
      return null;
    }
    return null;
  }

  // this function is called
  _loadPage(page) {
    if (this.shouldOverridePageLoads === true || APP_STATE === AppExpirationStates.active) {
      this.navigator.replace({name: page});
    } else if (APP_STATE === AppExpirationStates.preRelease) {

    } else {

    }
  }

  // called by thank you page or prerelease pages, allows user to change pages
  _changePageFromAppNonActivityPages(action) {
    const overrideActions = GlobalFunctions.overrideActions();
    if (action === overrideActions.openApp) {
      this.shouldOverridePageLoads = true;
      this._shouldFetchUserAndProfile();
    } else if (action == overrideActions.demoApp) {
      this.shouldOverridePageLoads = true;
      this._shouldFetchUserAndProfile(); //TODO @richard change with dummy data
    }
  }

  _renderNavigatorScene (route, navigator) {
    if (route.name == PageNames.expiredPage) {
      return (
        <ThankYouPage
          dummyMyProfile={DummyData.myProfile}
          dummyProfiles={DummyData.profiles}
          changePage={this._changePageFromAppNonActivityPages.bind(this)}
        />
      )
    } else if (route.name == PageNames.appHome) {
      return (
        <NavigationContainer
          dummyMyProfile={DummyData.myProfile}
          firebase={firebase}
          routeNavigator={navigator}
          myProfile={this.state.myProfile || this.firstTimeMyProfile}
          setMyProfile={this._setMyProfile.bind(this)}
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
          setMyProfile={this._setMyProfile.bind(this)}
        />
      )
    }
  }

  render() {
    let initialRouteName = PageNames.loadingPage;

    if (APP_STATE === AppExpirationStates.expired) {
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
