'use strict';

/*
This is the parent file for the entire application.  It houses the TabBar
Navigation and the Notification (drop down header)
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Alert,
  AsyncStorage,
} from 'react-native';

import JumboNavigator         from "./JumboNavigator.js"
import NotificationBannerView from "./NotificationBannerView.js"
import MatchView              from './MatchView.js'

const global = require('../global/GlobalFunctions.js');
const PageNames = global.pageNames();
const StorageKeys = global.storageKeys();

const firebase = require('firebase');
const firebaseConfig = {
  apiKey: "AIzaSyCqxU8ZGcg7Tx-iJoB_IROCG_yj41kWA6A",
  authDomain: "jumbosmash-ddb99.firebase.com",
  databaseURL: "https://jumbosmash-ddb99.firebaseio.com/",
  storageBucket: "jumbosmash-ddb99.appspot.com",
};
firebase.initializeApp(firebaseConfig);

const FIRST_BATCH_SIZE = 50;
const FETCH_BATCH_SIZE = 100;

//TODO: @richard delete this later
const testProfile = {
  profileId: "586edd82837823188a297728",
  firstName: "Test",
  lastName: "Profile",
  description: "kasjf laksj dglkasj dlgja slkgjalskdjglkasdjg laksdj glkasjd giasjg laksdj lkasjd glaksj dglkajd glkajsdg lk alkgj akldg",
  major: "something",
  photos: [
    {large: "https://d13yacurqjgara.cloudfront.net/users/109914/screenshots/905742/elephant_love.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/109914/screenshots/905742/elephant_love.jpg"},
    {large: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg"},
    {large: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg"},
  ]
}

class NavigationContainer extends Component {
  constructor(props) {
    super(props);

    this.currentPage = PageNames.cardsPage,

    this.state = {
      profiles: [],
      myProfile: testProfile,
      matchedProfile: testProfile, // profile of the person you matched with for MatchView
      hasUnsavedSettings: false,
      currentRecipient: null, // used for the nav bar in ConversationPage
      showMatchView: false,
    };
  }

  componentDidMount() {
    this._shouldRetrieveProfilesFromStorage();

    // example notification calling function
    // this.notificationBanner.showWithMessage("test", ()=>{
    //   this._changePage(PageNames.chatPage);
    // });
    //
    // setTimeout(() => {
    //   this.notificationBanner.showWithMessage("next message arrived", ()=>{
    //     this._changePage(PageNames.chatPage);
    //   });
    // }, 2000);
  }

  // Called when the app is closed from SwipingPage.js
  // Removes all the old cards and saves the remainder to AsyncStorage
  _removeSeenCards(currentIndex) {
    let oldLength = this.state.profiles.length;
    this.state.profiles.splice(0, currentIndex);
    this._shouldSaveProfilesToStorage();
  }

  async _shouldSaveProfilesToStorage () {
    if (this.state.profiles && this.state.profiles.length > 0) {
      try {
        await AsyncStorage.setItem(StorageKeys.profiles, JSON.stringify(this.state.profiles));
      } catch (error) {
        throw error;
      }
    } else {
      throw "Tried to save profiles, but they are a type: " + typeof(this.state.profiles);
    }
  }

  // empties storage so that if the user force quits, it doesn't seem like it's
  // stuck and makes a fresh request
  async _removeProfilesFromStorage () {
    try {
      await AsyncStorage.removeItem(StorageKeys.profiles);
    } catch (error) {
      throw "Error: Remove from storage: " + error;
    }
  };

  // On load, attempts to pull information from local storage,
  // If that doesn't work, it fetches them from the server
  // Error cases also fetch from storage
  // Successfully fetching from storage also empties storage
  async _shouldRetrieveProfilesFromStorage () {
    try {
      let storedProfiles = await AsyncStorage.getItem(StorageKeys.profiles);

      // successfully retrieved something
      if (storedProfiles !== null) {
        storedProfiles = JSON.parse(storedProfiles);

        // retrieved data is of correct type
        if (storedProfiles.constructor === Array && storedProfiles.length > 0){
          this.setState({
            profiles: storedProfiles,
            myProfile: (this.state.myProfile == testProfile) ? storedProfiles[0] : this.state.myProfile, //TODO: @richard temporary while we don't have a real profile
          });
          this._removeProfilesFromStorage();

          // data is not of the correct type
        } else {
          this._fetchProfiles(0, FIRST_BATCH_SIZE);
        }
        // storage is null / empty
      } else {
        this._fetchProfiles(0, FIRST_BATCH_SIZE);
      }
      // error accessing storage
    } catch (error) {
      this._fetchProfiles(0, FIRST_BATCH_SIZE);
      throw error;
    }
  }

  // fetches new profiles and adds them to the profiles array
  // lastID: the lastID we got from the previous list of profiles
  // count: how many profiles to fetch. 0 or null is all
  _fetchProfiles(lastID, count) {
    //TODO: @richard use lastID
    let index = "0"; //TODO: @richard replace
    let id = "586edd82837823188a297932".toString(); //TODO: @richard replace
    let batch = count ? count.toString() : FETCH_BATCH_SIZE.toString();
    let url = "https://jumbosmash2017.herokuapp.com/profile/batch/"+id+"/"+index+"/"+batch;
    return fetch(url)
    .then((response) => {
      if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
        return response.json();
      } else {
        throw ("status" in response) ? response["status"] : "Unknown Error";
      }
    }).then((responseJson) => {
      global.shuffle(responseJson);
      this.setState({
        profiles: this.state.profiles.concat(responseJson),
        myProfile: (this.state.myProfile == testProfile) ? responseJson[0] : this.state.myProfile, //TODO: @richard temporary while we don't have a real profile
      })
    })
    .catch((error) => {
      //TODO: @richard replace with real catch case
      Alert.alert(
        "Something Went Wrong :(",
        error.toString(),
        [{text: "OK", onPress: ()=>{}}]
      );
    });
  }

  // Changes which tab is showing (swiping, settings, etc), check HomeTabBarIOS
  // for the tab names.  The reason why this is here is because notifications
  // will also need to change the tabs, and changes can only trickle downwards.
  // Thus, currentPage is a property of the Navigator, and TabBar looks to
  // Navigator for this property.
  _changePage(pageName) {
    const settingsPage = PageNames.settingsPage;
    let currentlyOnSettings = this.currentPage == settingsPage;
    let leavingSettings = currentlyOnSettings && pageName != settingsPage;
    if (leavingSettings && this.state.hasUnsavedSettings) {
      Alert.alert(
        "Leaving unsaved changes",
        "Save your changes with the circular 'save' button at the bottom-right!",
        [
          {text: "OK", onPress:() => {
            this.setState({
              currentPage: pageName,
            })
          }},
        ]
      );
    } else {
      this.setState({
        currentPage: pageName,
      })
    }
  }

  async _asyncUpdateServerProfile(id, profileChanges, newProfile) {
    let url = "https://jumbosmash2017.herokuapp.com/profile/id/".concat(id);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileChanges),
    }).then((response) => {
      this.setState({
        myProfile: newProfile,
      });
    }).catch((error) => {
      throw error; //TODO @richard show error thing
    });
  }

  async _updateProfile(profileChanges) {
    //TODO: @richard this is temporary while the backend isn't up yet
    let newProfile = {};
    for (let key in this.state.myProfile) {
      newProfile[key] = (key in profileChanges) ? profileChanges[key] : this.state.myProfile[key];
    }
    let updateSuccess = await this._asyncUpdateServerProfile(this.state.myProfile.id, profileChanges, newProfile);
    // TODO: @richard on success, return the profile
    return newProfile;
  }

  // shows the correct notification for matching
  // if on the swiping page, then shows full match view, else shows a banner notif
  _notifyUserOfMatchWith(profile) {
    if (profile != null && this.currentPage == PageNames.cardsPage) {
      this.setState({
        matchProfile: profile,
        showMatchView: true,
      });
    } else if (profile != null) {
      this.setState({
        matchProfile: profile,
      });
      this.notificationBanner.showWithMessage("New Match! Say Hello to " + profile.firstName, ()=>{
        this._changePage(PageNames.chatPage);
      });
    }
  }

  _shouldRenderMatchView() {
    if (this.state.showMatchView && this.currentPage == PageNames.cardsPage && this.state.profiles.length > 1) {
      return (
        <View style={styles.coverView}>
          <MatchView
            myProfile={this.state.myProfile}
            matchProfile={this.state.matchProfile}
            onClose={() => this.setState({showMatchView: false})}
          />
        </View>
      );
    }
  }

  // sets participant of chat using callback
  _setCurrentParticipant(currentParticipant) {
    if (currentParticipant) {
      this.setState({currentParticipant});
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <JumboNavigator
          initialRoute={{ name: PageNames.cardsPage }}
          currentPage={this.currentPage}
          changePage={this._changePage.bind(this)}
          fetchProfiles={this._fetchProfiles.bind(this)}
          profiles={this.state.profiles}
          myProfile={this.state.myProfile}
          updateProfile={this._updateProfile.bind(this)}
          firebase={firebase}
          setHasUnsavedSettings={(hasUnsavedSettings) => {this.setState({hasUnsavedSettings})}}
          removeSeenCards={this._removeSeenCards.bind(this)}
          notifyUserOfMatchWith={this._notifyUserOfMatchWith.bind(this)}
          setCurrentParticipant={this._setCurrentParticipant.bind(this)}
        />
        {this._shouldRenderMatchView()}
        <NotificationBannerView ref={(elem) => {this.notificationBanner = elem}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  coverView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});

  export default NavigationContainer;
