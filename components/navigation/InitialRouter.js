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

    // this flag is to make sure _shouldFetchUserAndProfile is only called once
    this.didGetUserAndProfile = false;

    // first time login / signup, this is required because state isn't guaranteed
    // to update in time. this.state.myProfile is used to rerender pages when
    // myProfile changes, this.firstTimeMyProfile is used to create the pages in
    // the first place
    this.firstTimeMyProfile = null;

    // allows user to override the expired or prerelease page. for example,
    // if user sees expired page but chooses to continue using the app,
    // this is set to true
    this.shouldOverridePageLoads = false;

    // if this is true, then no requests should be made and all data should be
    // dummy data
    this.shouldUseDummyData = false;

    this.state = {
      myProfile: null,
    }
  }

  componentDidMount() {
    this._shouldFetchUserAndProfile();
  }

  // This function allows any child page to set the myProfile for the entire app
  // state.myProfile is used as the primary "myProfile" reference and rerenders
  // all the pages, but the first time we load, setState does not guarantee it
  // finish before render is called, so we're using firstTimeMyProfile as well
  _setMyProfile (myProfile) {
    this.setState(myProfile);
    this.firstTimeMyProfile = myProfile;
  }

  // This function is what decides what page to load. While this function is
  // working, the user will see the "loadingPage".
  // if the user has myProfile, firebase user, and is verified, then it goes
  // to the main application. else it loads the auth container
  async _shouldFetchUserAndProfile() {
    if (this.shouldUseDummyData) {
      this.setState({myProfile: DummyData.myProfile});
      this._loadPage(PageNames.appHome);
    } else {
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
  }

  // helper function to shouldFetchUserAndProfile. Checks local storage for
  // myProfile, else returns null
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

  // this function is called to change the page and takes overriding into account
  // So it will only allow a page change if the app is active or the user
  // specifically overrides it. This prevents shouldFetchUserAndProfile from
  // opening the app when it has already expired
  _loadPage(page) {
    if (this.shouldOverridePageLoads === true || APP_STATE === AppExpirationStates.active) {
      this.navigator.replace({name: page});
    }
  }

  // called by thank you page or prerelease pages, allows user to change pages
  //
  _changePageFromAppNonActivityPages(action) {
    const overrideActions = GlobalFunctions.overrideActions();
    if (action === overrideActions.openApp) {
      this.shouldOverridePageLoads = true;
      this._shouldFetchUserAndProfile();
    } else if (action == overrideActions.demoApp) {
      this.shouldOverridePageLoads = true;
      this.shouldUseDummyData = true
      this._shouldFetchUserAndProfile(); //TODO @richard change with dummy data
    }
  }

  _renderNavigatorScene (route, navigator) {
    if (route.name == PageNames.expiredPage) {
      return (
        <ThankYouPage
          changePage={this._changePageFromAppNonActivityPages.bind(this)}
        />
      )
    } else if (route.name == PageNames.appHome) {
      return (
        <NavigationContainer
          firebase={firebase}
          routeNavigator={navigator}
          myProfile={this.state.myProfile || this.firstTimeMyProfile}
          setMyProfile={this._setMyProfile.bind(this)}
          shouldUseDummyData={this.shouldUseDummyData}
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
    /*
      This flow is as follows:
      No matter what, because of the asynchronicity of the requests and properties,
      loading page will load first.  The only exception to this is if the app
      has already expired, in which case the expiration page loads.
      Selecting the correct page to load is then up to _shouldFetchUserAndProfile
    */

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
