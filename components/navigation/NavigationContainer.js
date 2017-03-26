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

const global = require('../global/GlobalFunctions.js');
const PageNames = global.pageNames();
const StorageKeys = global.storageKeys();

const FIRST_BATCH_SIZE = 50;
const FETCH_BATCH_SIZE = 100;

class NavigationContainer extends Component {
  constructor(props) {
    super(props);
    // don't change the structure of how this is stored. Could
    // make a lot of things break whether you realize it or not
    this.token = {val: null};
    this.state = {
      profiles: [],
    };
  }

  componentDidMount() {
    if (this.props.firebase.auth().currentUser) {
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
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));

  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange (currentAppState) {
    if (this && currentAppState == "inactive" && this.navigator.swipingPage) {
      let index = this.navigator.swipingPage.state.cardIndex;
      this._removeSeenCards(index);
      if (this.navigator && this.navigator.swipingPage) {
        this.navigator.swipingPage.saveLikePoints();
      }
    }
  }

  _saveUserToken (token, id) {
    this._updateProfile({deviceIdList: [token]})
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
    if (this.navigator.swipingPage) {
      this.navigator.swipingPage.setState({
        cardIndex: 0,
      });
    }
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
  }

  async _setLastIndex(lastIndex) {
    try {
      await AsyncStorage.setItem(StorageKeys.lastIndex, lastIndex.toString());
    } catch (error) {
      throw "Tried to save lastIndex "+error;
    }
  }

  // fetches new profiles and adds them to the profiles array
  // lastID: the lastID we got from the previous list of profiles
  // count: how many profiles to fetch. 0 or null is all
  async _fetchProfiles(lastID, count) {
    let index = await this._getLastIndex();
    // console.log("request made with last index: "+index.toString()); //TODO @richard testing code remove
    let id = this.props.myProfile.id.toString(); //TODO: @richard replace
    let batch = count ? count.toString() : FETCH_BATCH_SIZE.toString();
    let url = "https://jumbosmash2017.herokuapp.com/profile/batch/"+id+"/"+index+"/"+batch+"/"+this.token.val;
    return fetch(url)
    .then((response) => {
      if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
        return response.json();
      } else {
        throw ("status" in response) ? response["status"] : "Unknown Error";
      }
    }).then((responseJson) => {
      if (responseJson.length > 0) {
        this._setLastIndex(responseJson[responseJson.length - 1].index);
      } else {
        console.log("on fetching new profiles, we hit a case where nothing was returned (likely due to this being the last index)")
        this._setLastIndex(0);
      }
      // for (var i = 0; i < responseJson.length; i++) { //TODO @richard testing code remove
      //   console.log(responseJson[i].index.toString() + " " + responseJson[i].firstName);
      // }
      global.shuffle(responseJson);
      this.setState({
        profiles: this.state.profiles.concat(responseJson),
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

  async _asyncUpdateServerProfile(id, profileChanges, newProfile) {
    let url = "https://jumbosmash2017.herokuapp.com/profile/id/".concat(id).concat("/").concat(this.token.val);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileChanges),
    }).then((response) => {
      console.log(response);
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
    for (let key in this.props.myProfile) {
      newProfile[key] = (key in profileChanges) ? profileChanges[key] : this.props.myProfile[key];
    }
    let updateSuccess = await this._asyncUpdateServerProfile(this.props.myProfile.id, profileChanges, newProfile);
    // TODO: @richard on success, return the profile
    return newProfile;
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <JumboNavigator
          ref={(elem) => {this.navigator = elem}}
          initialRoute={{ name: PageNames.cardsPage }}
          fetchProfiles={this._fetchProfiles.bind(this)}
          profiles={this.state.profiles}
          myProfile={this.props.myProfile}
          updateProfile={this._updateProfile.bind(this)}
          firebase={this.props.firebase}
          token={this.token}
          removeSeenCards={this._removeSeenCards.bind(this)}
          routeNavigator={this.props.routeNavigator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

  export default NavigationContainer;
