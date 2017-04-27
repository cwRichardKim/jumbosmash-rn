'use strict';

/*
This is the parent file for the entire application.  Its primary responsibility
is to pass props to the Navigator and to deal with app-wide data
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Alert,
  AppState,
  AsyncStorage,
} from 'react-native';

import JumboNavigator         from "./JumboNavigator.js"
import DummyData              from "../misc/DummyData.js";

const Analytics = require('react-native-firebase-analytics');
const global = require('../global/GlobalFunctions.js');
const PageNames = global.pageNames();
const StorageKeys = global.storageKeys();

const FETCH_BATCH_SIZE = 50;

class NavigationContainer extends Component {
  constructor(props) {
    super(props);
    // don't change the structure of how this is stored. Could
    // make a lot of things break whether you realize it or not
    this.token = {val: null};
    this.isFetchInProgress = false; //flag to make sure only one fetch call is called at a time
    this.recentLikes = {}; // helps with edge case where the like request took longer than the fetch request
    this.state = {
      profiles: [],
      noMoreCards: false,
    };
  }

  componentDidMount() {
    if (this.props.shouldUseDummyData) {
      this._shouldRetrieveProfilesFromStorage();
    } else if (this.props.firebase.auth().currentUser) {
      this.props.firebase.auth()
        .currentUser
        .getToken(true)
        .then(function(idToken) {
          this.token.val = idToken;
          this._shouldRetrieveProfilesFromStorage();
        }.bind(this)).catch(function(error) {
          console.log(error);
        });
    }
    Analytics.logEvent('open_app_home', {});
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange (currentAppState) {
    if (this && currentAppState == "inactive" && this.navigator && this.navigator.swipingPage) {
      let index = this.navigator.swipingPage.state.cardIndex;
      this._removeSeenCards(index);
      if (this.navigator && this.navigator.swipingPage) {
        this.navigator.swipingPage.saveLikePoints();
      }
    }
  }

  async _saveUserToken (token, id) {
    await this.props.updateMyProfile({deviceIdList: [token]});
    this._updateProfileToServer();
  }

  // Called when the app is closed from SwipingPage.js
  // Removes all the old cards and saves the remainder to AsyncStorage
  _removeSeenCards(index) {
    let oldCurrentProfile = this.state.profiles[index];

    let oldLength = this.state.profiles.length;
    this.state.profiles.splice(0, index);
    this._shouldSaveProfilesToStorage();

    let newCurrentProfile = this.state.profiles[0];
    if (oldCurrentProfile !== newCurrentProfile) {
      throw "Removing Cards Did Not Work";
    }
    if (this.navigator && this.navigator.swipingPage) {
      this.navigator.swipingPage.setState({
        cardIndex: 0,
      });
    }
  }

  // When you right swipe on someone, removes later duplicates of that person
  _removeDuplicateProfiles(cardIndex) {
    let profile = this.state.profiles[cardIndex];
    for (var i = cardIndex + 1; i < this.state.profiles.length; i++) {
      if (this.state.profiles[i].id == profile.id) {
        this.state.profiles.splice(i, 1);
        i --;
      }
    }
  }

  //same as remove duplicates, but includes the current card
  _removeAllProfilesOfIndex(cardIndex) {
    if (cardIndex >= 0 && cardIndex < this.state.profiles.length) {
      let profile = this.state.profiles[cardIndex];
      for (var i = cardIndex; i < this.state.profiles.length; i++) {
        if (this.state.profiles[i].id == profile.id) {
          this.state.profiles.splice(i, 1);
          i --;
        }
      }
    }
  }

  _blockUserWithIndex(cardIndex) {
    this._blockUserWithId(this.state.profiles[cardIndex].id)
    this._removeAllProfilesOfIndex(cardIndex)
  }

  _blockUserWithId(profileId) {
    let url = "https://jumbosmash2017.herokuapp.com/profile/block/"+this.props.myProfile.id+"/"+profileId+"/"+this.token.val;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: "",
    }).catch((error) => {
      let errorString = "Sorry, we could not reach the servers and failed to block the user.  We removed them from your deck for now, if you see them again, try blocking them again! Or email us at team@jumbosmash.com and we can do it manually";
      Alert.alert('Error', errorString);
      console.log(error);
      //DO NOTHING (user doesn't really need to know this didn't work)
    });
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
          });
          this._removeProfilesFromStorage();

          // data is not of the correct type
        } else {
          this._fetchProfiles(FETCH_BATCH_SIZE);
        }
        // storage is null / empty
      } else {
        this._fetchProfiles(FETCH_BATCH_SIZE);
      }
      // error accessing storage
    } catch (error) {
      this._fetchProfiles(FETCH_BATCH_SIZE);
      throw error;
    }
  }

  async _getLastIndex() {
    try {
      let lastIndex = await AsyncStorage.getItem(StorageKeys.lastIndex);
      // successfully retrieved something
      if (lastIndex !== null) {
        return parseInt(lastIndex);
      // storage is null / empty
      } else {
        return 0;
      }
      // error accessing storage
    } catch (error) {
      throw error;
    }
    return 0;
  }

  async _setLastIndex(lastIndex) {
    try {
      await AsyncStorage.setItem(StorageKeys.lastIndex, lastIndex.toString());
    } catch (error) {
      throw "Tried to save lastIndex "+error;
    }
  }

  _addRecentLikes(profileId) {
    if (this.recentLikes) {
      this.recentLikes[profileId] = true;
    }
  }

  // solves the concurrency issue of fetching while a like is being processed
  _removeRecentlyLiked(array) {
    if (array && array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        if (this.recentLikes && array[i].id in this.recentLikes) {
          array.splice(i, 1);
          i--;
        }
      }
    }
    this.recentLikes = {};
    return array
  }

  // fetches new profiles and adds them to the profiles array
  // lastID: the lastID we got from the previous list of profiles
  // count: how many profiles to fetch. 0 or null is all
  async _fetchProfiles(count) {
    if (this.props.shouldUseDummyData) {
      let dummyProfs = DummyData.profiles;
      global.shuffle(dummyProfs);
      dummyProfs = dummyProfs.concat(dummyProfs).concat(dummyProfs).concat(dummyProfs);
      this.setState({
        profiles: this.state.profiles.concat(dummyProfs),
      })
    } else if (!this.props.myProfile) {
      setTimeout(this._fetchProfiles.bind(this), 200);
    } else {
      if (this.isFetchInProgress) {
        return;
      }
      this.isFetchInProgress = true;

      let lastIndex = await this._getLastIndex();
      let id = this.props.myProfile.id.toString();
      let batch = count ? count.toString() : FETCH_BATCH_SIZE.toString();
      let url = "https://jumbosmash2017.herokuapp.com/profile/batch/"+id+"/"+lastIndex+"/"+batch+"/"+this.token.val;
      console.log("Fetching profiles for "+id+" batch size: " + batch + " lastIndex: " + lastIndex);
      return fetch(url)
      .then((response) => {
        this.isFetchInProgress = false;
        if (global.isUserCheatingWithResponse(response)) {
          this.props.showCheaterPage();
          throw "Time settings are off";
        }
        if (global.isGoodResponse(response)) {
          return response.json();
        } else {
          throw ("status" in response) ? response["status"] : "Unknown Error";
        }
      }).then((responseJson) => {
        responseJson = this._removeRecentlyLiked(responseJson);
        if (responseJson.length > 0) {
          if (__DEV__) { //TODO @richard remove. for debugging purposes
            this.navigator.notificationBanner.showWithMessage("Retrieved " + responseJson.length + " profiles. prev index: "+lastIndex+", indexes: " + responseJson[0].index.toString() + " - " + responseJson[responseJson.length-1].index.toString())
          }
          this._setLastIndex(responseJson[responseJson.length - 1].index);
          global.shuffle(responseJson);
          this.setState({
            profiles: this.state.profiles.concat(responseJson),
            noMoreCards: false,
          })
        } else {
          if (lastIndex === 0) {
            this.setState({noMoreCards: true});
          } else {
            this._setLastIndex(0);
            this._fetchProfiles(FETCH_BATCH_SIZE);
          }
        }
      })
      .catch((error) => {
        this.isFetchInProgress = false;
        //TODO: @richard replace with real catch case
        Alert.alert(
          "Something Went Wrong :(",
          error.toString(),
          [{text: "OK", onPress: ()=>{}}]
        );
      });
    }
  }

  async _updateProfileToServer() {
    this.props.updateMyProfile({"photos": global.reArrangePhotos(this.props.myProfile.photos)});
    let updateSuccess = await global.asyncUpdateServerProfile(this.props.myProfile.id, this.props.myProfile, this.props.shouldUseDummyData, this.token.val);
    return updateSuccess;
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <JumboNavigator
          ref={(elem) => {this.navigator = elem}}
          initialRoute={{ name: PageNames.cardsPage }}
          fetchProfiles={this._fetchProfiles.bind(this)}
          profiles={this.state.profiles}
          removeDuplicateProfiles={this._removeDuplicateProfiles.bind(this)}
          blockUserWithIndex={this._blockUserWithIndex.bind(this)}
          myProfile={this.props.myProfile}
          updateProfileToServer={this._updateProfileToServer.bind(this)}
          firebase={this.props.firebase}
          token={this.token}
          removeSeenCards={this._removeSeenCards.bind(this)}
          routeNavigator={this.props.routeNavigator}
          shouldUseDummyData={this.props.shouldUseDummyData}
          updateMyProfile={this.props.updateMyProfile}
          noMoreCards={this.state.noMoreCards}
          addRecentLikes={this._addRecentLikes.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

  export default NavigationContainer;
