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
  TabBarIOS,
  Animated,
  TouchableHighlight,
  Navigator,
  Alert,
} from 'react-native';

import HomeTabBarIOS          from "./HomeTabBarIOS.js"
import NotificationBannerView from "./NotificationBannerView.js"
import ChatPage               from "../chat/ChatPage.js"
import ConversationPage       from "../chat/ConversationPage.js"
const global = require('../global/GlobalFunctions.js');

const firebase = require('firebase');
const firebaseConfig = {
  apiKey: "AIzaSyCqxU8ZGcg7Tx-iJoB_IROCG_yj41kWA6A",
  authDomain: "jumbosmash-ddb99.firebase.com",
  databaseURL: "https://jumbosmash-ddb99.firebaseio.com/",
  storageBucket: "jumbosmash-ddb99.appspot.com",
};
firebase.initializeApp(firebaseConfig);

const FETCH_BATCH_SIZE = 100;

//TODO: @richard delete this later
const testProfile = {
  firstName: "Test",
  lastName: "Profile",
  description: "kasjf laksj dglkasj dlgja slkgjalskdjglkasdjg laksdj glkasjd giasjg laksdj lkasjd glaksj dglkajd glkajsdg lk alkgj akldg",
  major: "something",
  photos: ["https://d13yacurqjgara.cloudfront.net/users/109914/screenshots/905742/elephant_love.jpg", "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg", "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg"],
}

class NavigationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: global.tabNames().cardsTab,
      notificationBannerText: "notification (tap me, goes to chat)",
      pan: new Animated.ValueXY({x:0, y:-100}),
      profiles: [],
      myProfile: testProfile,
      hasUnsavedSettings: false,
    };
  }

  // fetches new profiles and adds them to the profiles array
  // lastID: the lastID we got from the previous list of profiles
  // count: how many profiles to fetch. 0 or null is all
  _fetchProfiles(lastID, count) {
    //TODO incorporate lastID and count
    return fetch('https://jumbosmash2017.herokuapp.com/profile/all/586edd82837823188a297932')
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
          myProfile: responseJson[0], //TODO: @richard temporary while we don't have a real profile
        })
      })
      .catch((error) => {
        //TODO: @richard replace with real catch case
        Alert.alert(
          "Server is Down :(",
          error.toString(),
          [{text: "OK", onPress: ()=>{}}]
        );
      });
  }

  _hideNotificationBanner() {
    Animated.spring(
      this.state.pan,
      {
        toValue: {x:0, y:-100},
      }
    ).start();
  }

  _showNotificationBanner() {
    Animated.spring(
      this.state.pan,
      {
        toValue: {x:0, y:-25},
      }
    ).start();
  }

  _notificationBannerTapped() {
    this._hideNotificationBanner();
    this.setState({
      selectedTab: 'chatTab',
    });
  }

  componentDidMount() {
    // this._showNotificationBanner();
    //TODO @richard do something better here and pull from storage or something first
    this._fetchProfiles();
  }

  // Changes which tab is showing (swiping, settings, etc), check HomeTabBarIOS
  // for the tab names.  The reason why this is here is because notifications
  // will also need to change the tabs, and changes can only trickle downwards.
  // Thus, selectedTab is a property of the Navigator, and TabBar looks to
  // Navigator for this property.
  _changeTab(tabName) {
    const settingsTab = global.tabNames().settingsTab;
    let currentlyOnSettings = this.state.selectedTab == settingsTab;
    let leavingSettings = currentlyOnSettings && tabName != settingsTab;
    if (leavingSettings && this.state.hasUnsavedSettings) {
      Alert.alert(
        "Leaving unsaved changes",
        "Save your changes with the circular 'save' button at the bottom-right!",
        [
          {text: "OK", onPress:() => {
            this.setState({
              selectedTab: tabName,
            })
          }},
        ]
      );
    } else {
      this.setState({
        selectedTab: tabName,
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
      console.error(error); //TODO @richard show error thing
      throw error;
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

  // Returns the content that the navigator should show.  Since route.name is "TabBar"
  // by default, it will show the TabBar.  In order to "push" a view on top of this view,
  // You have to give it its own route name and use navigator.push({name: route name})
  _renderNavigatorScene (route, navigator) {
    if (route.name == 'TabBar') {
      return (
        <View style={{flex:1}}>
          <HomeTabBarIOS
            navigator={navigator}
            selectedTab={this.state.selectedTab}
            changeTab={this._changeTab.bind(this)}
            fetchProfiles={this._fetchProfiles.bind(this)}
            profiles={this.state.profiles}
            myProfile={this.state.myProfile}
            updateProfile={this._updateProfile.bind(this)}
            firebase={firebase}
            setHasUnsavedSettings={(hasUnsavedSettings) => {
              this.setState({hasUnsavedSettings: hasUnsavedSettings})
            }}
          />
          <Animated.View
            style={[styles.notificationBanner, {transform:this.state.pan.getTranslateTransform()}]}>
            <NotificationBannerView
              message={this.state.notificationBannerText}
              onPress={this._notificationBannerTapped.bind(this)}
            />
          </Animated.View>
        </View>
      );
    } else if (route.name == 'Chat') {
      return(<ConversationPage
                navigator={navigator}
                chatroomId={route.chatroomId}
                participants={route.participants}
                userId={route.userId}
                firebase={firebase}
              />);
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ name: 'TabBar' }}
        renderScene={this._renderNavigatorScene.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  notificationBanner: {
    position: 'absolute',
    height: 100,
    top: 0,
    left: 0,
    right: 0,
  },
});

export default NavigationContainer;
