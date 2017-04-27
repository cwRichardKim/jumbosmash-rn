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
  NetInfo,
  Alert,
} from 'react-native';

import NavigationContainer        from "./NavigationContainer.js";
import AuthNavigator              from "../login/AuthNavigator.js";
import DummyData                  from "../misc/DummyData.js";
import ThankYouPage               from "../misc/ThankYouPage.js";
import PreReleasePage             from "../misc/PreReleasePage.js";
import LoadingPage                from "../misc/LoadingPage.js";
import GlobalFunctions            from "../global/GlobalFunctions.js";
import CheaterPage                from "../misc/CheaterPage.js";

const PageNames = require("../global/GlobalFunctions.js").pageNames();
const StorageKeys = require("../global/GlobalFunctions.js").storageKeys();

const AppExpirationStates = GlobalFunctions.appExpirationStates();
const APP_STATE = GlobalFunctions.calculateAppExpirationState();

const Analytics = require('react-native-firebase-analytics');
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

    // allows user to override the expired or prerelease page. for example,
    // if user sees expired page but chooses to continue using the app,
    // this is set to true
    this.shouldOverridePageLoads = false;

    // if this is true, then no requests should be made and all data should be
    // dummy data
    this.shouldUseDummyData = false;

    // check the server date to see if the user changed their date locally
    // and mark them as cheaters if they did
    this.userIsCheating = false;

    this.state = {
      myProfile: null,
      isConnected: null,
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleConnectivityChange
    );

    this._shouldFetchUserAndProfile();
  }

  _handleConnectivityChange = (isConnected) => {
    if (!isConnected) {
      Alert.alert("We can't detect a connection, expect limited functionality :(")
    }

    this.setState({
      isConnected,
    });
  };

  _initializeFirebaseAnalytics(user, hasAllParams) {
    let userId = (user && user.uid) ? user.uid : "unknown";
    Analytics.setUserId(userId);
    // Analytics.setUserProperty('propertyName', 'propertyValue');

    Analytics.logEvent('app_open', {
      'has_all_params': hasAllParams
    });
  }

  // This function allows any child page to set the myProfile for the entire app
  // state.myProfile is used as the primary "myProfile" reference and rerenders
  // all the pages
  _setMyProfile (myProfile) {
    this.setState({myProfile: myProfile});
    AsyncStorage.setItem(StorageKeys.myProfile, JSON.stringify(myProfile));
  }

  // updates myProfile given a list of changes
  _updateMyProfile(changes) {
    let newProfile = {};
    for (var key in this.state.myProfile) {
      newProfile[key] = this.state.myProfile[key];
    }
    for (var key in changes) {
      newProfile[key] = changes[key];
    }
    this._setMyProfile(newProfile);
  }

  _showCheaterPage() {
    this.userIsCheating = true;
    this.navigator.replace({name: PageNames.cheaterPage});
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

          // First checks local storage for profile
          let myProfile = await this._shouldFetchMyProfileFromStorage();
          if (user && user.emailVerified && myProfile) {
            this.setState({myProfile});
            this._initializeFirebaseAnalytics(user, true);
            this._loadPage(PageNames.appHome);
          } else {
            this._initializeFirebaseAnalytics(user, false);
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
      throw error;
      return null;
    }
    return null;
  }

  // this function is called to change the page and takes overriding into account
  // So it will only allow a page change if the app is active or the user
  // specifically overrides it. This prevents shouldFetchUserAndProfile from
  // opening the app when it has already expired
  _loadPage(page) {
    let appState = GlobalFunctions.calculateAppExpirationState();
    if (this.userIsCheating) {
      this._showCheaterPage();
    } else if (this.shouldOverridePageLoads === true || appState === AppExpirationStates.active) {
      Analytics.logEvent('override_open_app_home', {
        'destination': page || "unkown"
      });
      this.navigator.replace({name: page});
    } else if (appState === AppExpirationStates.preRelease) {
      if (page === PageNames.auth) {
        this.navigator.replace({name: page});
      } else if (!this.shouldOverridePageLoads) {
        this.navigator.replace({name: PageNames.preRelease});
      }
    }
  }

  // called by thank you page or prerelease pages, allows user to change pages
  //
  _changePageFromAppNonActivityPages(action) {
    const overrideActions = GlobalFunctions.overrideActions();
    if (action === overrideActions.openApp) {
      this.shouldOverridePageLoads = true;
      this.didGetUserAndProfile = false;
      this._shouldFetchUserAndProfile();
    } else if (action === overrideActions.tryApp) {
      this.shouldOverridePageLoads = true;
      this.shouldUseDummyData = true;
      this._shouldFetchUserAndProfile();
    } else if (action === overrideActions.logout) {
      this.shouldOverridePageLoads = false;
      this.shouldUseDummyData = false;
      this.navigator.replace({name: PageNames.auth});
      this._shouldFetchUserAndProfile();
    }
  }

  _renderNavigatorScene (route, navigator) {
    if (route.name == PageNames.expiredPage) {
      return (
        <ThankYouPage
          changePage={this._changePageFromAppNonActivityPages.bind(this)}
        />
      )
    } else if (route.name == PageNames.preRelease) {
      return (
        <PreReleasePage
          changePage={this._changePageFromAppNonActivityPages.bind(this)}
          updateMyProfile={this._updateMyProfile.bind(this)}
          myProfile={this.state.myProfile}
          firebase={firebase}
          routeNavigator={navigator}
        />
      )
    } else if (route.name == PageNames.appHome) {
      return (
        <NavigationContainer
          firebase={firebase}
          routeNavigator={navigator}
          myProfile={this.state.myProfile}
          setMyProfile={this._setMyProfile.bind(this)}
          updateMyProfile={this._updateMyProfile.bind(this)}
          shouldUseDummyData={this.shouldUseDummyData}
          showCheaterPage={this._showCheaterPage.bind(this)}
        />
      );
    } else if (route.name == PageNames.cheaterPage) {
      return (
        <CheaterPage/>
      );
    } else if (route.name == PageNames.loadingPage) {
      return (
        <LoadingPage/>
      );
    } else {
      return (
        <AuthNavigator
          firebase={firebase}
          routeNavigator={navigator}
          myProfile={this.state.myProfile}
          setMyProfile={this._setMyProfile.bind(this)}
          updateMyProfile={this._updateMyProfile.bind(this)}
          loadPage={this._loadPage.bind(this)}
          isConnected={this.state.isConnected}
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
