'use strict';

/*
page that shows before the app is released

This shit is super fucking messy and last minute, talk to @richard if you need help
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Alert,
  Clipboard,
  Navigator,
  Image,
  ActionSheetIOS,
  ActivityIndicator,
  Platform,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js";
import RectButton             from "../global/RectButton.js";
import AuthErrors             from "../login/AuthErrors.js";
import TagPage                from "../settings/TagPage.js";
import SettingsPage           from "../settings/SettingsPage.js";
import ProfileCardView        from "../cards/ProfileCardView.js";
const IS_ANDROID = Platform.OS === 'android';
const StorageKeys = GlobalFunctions.storageKeys();
const OverrideActions = GlobalFunctions.overrideActions();
const PushNotifications = require('../global/PushNotifications.js');
const Analytics = require('react-native-firebase-analytics');
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const PADDING = 20;
const PAGE_NAMES = GlobalFunctions.pageNames();

class PreReleasePage extends Component {
  constructor(props) {
    super(props);

    this.pushNotificationsHandler = require('react-native-push-notification');

    // done like this so that render isn't called again but we still have
    // access to the object that is being retrieved asynchronously
    this.token = {val: null}
    this.state = {
      shouldShowProfile: false,
    };
  }

  componentDidMount () {
    this._fetchToken();
    Analytics.logEvent('open_pre_release_page', {});
    this._requestPermissions()
  }

  // at this point we should extrapolate this to initialroute, but i don't want to
  // risk the work since we only have a few days left
  _fetchToken() {
    if (this.props.firebase.auth().currentUser) {
      this.props.firebase.auth()
        .currentUser
        .getToken(true)
        .then(function(idToken) {
          this.token.val = idToken;
        }.bind(this)).catch(function(error) {
          console.log(error);
        });
    }
  }

  async _requestPermissions() {
    let permissionsRequested = await AsyncStorage.getItem(StorageKeys.permissionsRequested);
    if (permissionsRequested == 'true') {
      return;
    }
    if (this.token && this.token.val) {
      if (IS_ANDROID) {
        this._configureNotifications()
      } else {
        Alert.alert(
          'Instant Smashification',
          'Would you like to get notifications from us when people want to smash you?',
          [
            {text: 'Yes Please', onPress: () => this._configureNotifications()},
            {text: 'Nah I\'m Good', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
        );
        try {
          await AsyncStorage.setItem(StorageKeys.permissionsRequested, 'true');
        } catch (err) {
          // Error saving data
          //¯\_(ツ)_/¯
          console.log(err);
        }
      }
    } else {
      setTimeout( () => {
        this._requestPermissions();
      }, 1000);
    }
  }

  // Note: A similiar function is in JumboNavigator. Notifications need
  // to be configured differently for each
  _configureNotifications () {
    this.pushNotificationsHandler.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function(token) {
            PushNotifications.onRegister(token,
              {authToken: this.token.val,
               profile: this.props.myProfile});
        }.bind(this),

        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
          console.log("Received notification: " + notification.message.body);
        },

        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is needed to receive remote push notifications)
        senderID: "559975994653",

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        requestPermissions: true,
    });
  }

  _loadPreReleaseApp() {
    let preReleaseTitle = IS_ANDROID ? "Welcome! You're here early" : "Do you agree to the terms of service?";
    let preReleaseText = IS_ANDROID ? "A few quick things.\n1) please don't show the app to anyone!\n2) We might clear the database every once in a while.\n3) report bugs at team@jumbosmash.com\n\nThanks for helping us out ;)" : "To access this app, you must agree to our terms of service (tap the 'terms of service' button). Most prominently this bans the submission of objectionable content that is offensive, insensitive, pornographic, or harmfully misleading.\n\nViolating these terms will lead to an instant termination of your account";
    let acceptText = IS_ANDROID ? "Let's go!" : "I agree to the terms of service";
    Alert.alert(
      preReleaseTitle,
      preReleaseText,
      [
        {text:acceptText, onPress:()=>{this.props.changePage(OverrideActions.openApp)}},
        {text:"Close", onPress:()=>{}}
      ]
    )
  }

  _shouldLoadPreReleaseButton () {
    if (this.props.myProfile && this.props.myProfile.teamMember === true) {
      return (
        <View>
          <RectButton
            style={[styles.button, styles.smashButton]}
            onPress={GlobalFunctions.openTOS}
            text="Terms of Service"
            textStyle={styles.buttonText}
          />
          <RectButton
            style={[styles.button, styles.smashButton]}
            textStyle={styles.buttonText}
            text="Enter"
            onPress={this._loadPreReleaseApp.bind(this)}
          />
        </View>
      )
    } else {
      return (null)
    }
  }

  _logout() {
    this.props.firebase.auth().signOut()
      .then(() => {
        for (var key in StorageKeys) {
          try {
            AsyncStorage.removeItem(StorageKeys[key]);
          } catch (error) {
            throw "Error: Remove from storage: " + error;
          }
        }
        this.props.changePage(OverrideActions.logout);
      })
      .catch((error) => {
        AuthErrors.handleLogoutError(error);
        throw error;
      }
    );
  }

  _getTimeUntilLaunch() {
    let today = new Date();
    return Math.abs(GlobalFunctions.dates().startDate.getTime() - today.getTime());
  }

  _getNumDaysUntilLaunch() {
    let today = new Date();
    let timeDiff = this._getTimeUntilLaunch();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  _renderCountdownString() {
    let diffHours = Math.floor(this._getTimeUntilLaunch() / (1000 * 3600));
    if (diffHours == 0){
      let diffMinutes = Math.floor(this._getTimeUntilLaunch() / (1000 *60))
      return (
        <View style={{paddingBottom: 10}}>
          <Text stye={GlobalStyles.text}>Senior Weekend Countdown: {diffMinutes} minutes</Text>
        </View>
      );
    } else {
      return (
        <View style={{paddingBottom: 10}}>
          <Text stye={GlobalStyles.text}>Senior Weekend Countdown: {diffHours} hours</Text>
        </View>
      );
    }
  }

  _copyShareLink() {
    if (IS_ANDROID) {
      Clipboard.setString('jumbosmash.com');
      Alert.alert(
        "Copied!",
        "Jumbosmash URL copied to your clipboard",
        [{text:"OK",onPress:()=>{}}]
      )
    } else {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: "http://jumbosmash.com",
        message: '🍆🍑  🔥🔥  🙈🙊🙉  😘👌:',
        subject: 'Who uses email? Geez get with the times',
      },
      (error) => alert(error),
      (completed, method) => {
        if (completed) {
          Analytics.logEvent('pre_release_share', {method: method});
        }
      });
    }
  }

  // given a profile, shows the profile over the navigator
  _shouldRenderProfileView() {
    if (this.state.shouldShowProfile) {
      return(
        <View style={[GlobalStyles.absoluteCover, styles.coverView]}>
          <ProfileCardView {...(this.props.myProfile)}
            pageHeight={HEIGHT}
            exitFunction={this._closeProfileCard.bind(this)}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  // called to show a profile card. if no card is set
  _showProfileCardForProfile() {
    this.setState({
      shouldShowProfile: true,
    })
  }

  _closeProfileCard() {
    this.setState({
      shouldShowProfile: false,
    })
  }

  _openEditProfilePage () {
    if (this.token && this.token.val) {
      this.navigator.replace({name: PAGE_NAMES.settingsPage});
    } else {
      Alert.alert(
        "We couldn't find your account",
        "The server may be down or you might be on poor wifi. Try again in a few minutes and if it doesn't work, log out and log back in"
      )
    }
  }

  async _updateProfileToServer() {
    this.props.updateMyProfile({"photos": GlobalFunctions.reArrangePhotos(this.props.myProfile.photos)});
    let successOption = {text: "Close Settings", onPress: ()=>{this.navigator.replace({name: PAGE_NAMES.preRelease})}};
    let updateSuccess = await GlobalFunctions.asyncUpdateServerProfile(this.props.myProfile.id, this.props.myProfile, this.props.shouldUseDummyData, this.token.val, successOption);
    return updateSuccess;
  }

  _closeOnPress () {
    Alert.alert(
      "Save Changes?",
      "Would you like to save or discard the changes you've made?",
      [
        {
          text: "Save", onPress: () => {
            if (this.settingsPage) {
              this.settingsPage.saveButtonPressed();
            }
          }
        }, {
          text: "Discard", onPress: () => {
            if (this.settingsPage && this.settingsPage.oldProfile) {
              this.props.updateMyProfile(this.settingsPage.oldProfile);
            }
            this.navigator.replace({name: PAGE_NAMES.preRelease});
          }
        }
      ]
    );
  }

  _renderPreReleaseImage() {
    let daysLeft = Math.min(this._getNumDaysUntilLaunch(), 5);
    let dayImages = [require("./images/1.png"), require("./images/2.png"), require("./images/3.png"), require("./images/4.png"), require("./images/5.png")];
    return (
      <Image
        style={styles.header}
        source={dayImages[Math.max(daysLeft - 1, 0)]}
      />
    );
  }

  _renderPreReleaseCount() {
    return (
      <View style={styles.textContainer}>
        <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>Jumbosmash is Coming 😉</Text>
        {this._renderCountdownString()}
        <Text style={GlobalStyles.text}>Don't know what to do with yourself while you wait? Invite your friends! The earlier they sign up, the higher they'll be in the deck / the earlier they'll get smashed.</Text>
      </View>
    );
  }

  _renderNavigatorScene (route, navigator) {
    if (route.name == PAGE_NAMES.preRelease) {
      return (
        <View style={{flex: 1}}>
          <ScrollView style={styles.scrollView}>
            {this._renderPreReleaseImage()}
            {this._renderPreReleaseCount()}
            <View style={styles.buttonContainer}>
              {this._shouldLoadPreReleaseButton()}
              <RectButton
                style={[styles.button, styles.smashButton]}
                textStyle={styles.buttonText}
                text="Share / Invite"
                onPress={this._copyShareLink.bind(this)}
              />
              <RectButton
                style={[styles.button, styles.smashButton]}
                textStyle={styles.buttonText}
                text="Update Your Profile"
                onPress={this._openEditProfilePage.bind(this)}
              />
              <RectButton
                style={[styles.button, styles.smashButton]}
                textStyle={styles.buttonText}
                text="Logout"
                onPress={this._logout.bind(this)}
              />
              <Text style={styles.tos} onPress={GlobalFunctions.openTOS}>Terms of Service / Privacy Policy</Text>
            </View>
          </ScrollView>
        </View>
      );
    } else if (route.name === PAGE_NAMES.settingsPage) {
      return (
        <View style = {{flex: 1, backgroundColor: 'white'}}>
          <SettingsPage
            ref={(elem) => {this.settingsPage = elem}}
            navigator={navigator}
            myProfile={this.props.myProfile}
            pageHeight={HEIGHT}
            navBarHeight={20}
            updateProfileToServer={this._updateProfileToServer.bind(this)}
            firebase={this.props.firebase}
            setHasUnsavedSettings={(hasUnsavedSettings) => {this.setState({hasUnsavedSettings})}}
            routeNavigator={this.props.routeNavigator}
            updateMyProfile={this.props.updateMyProfile}
            hasLogout={false}
            hasStaticSaveButton={true}
            showProfileCardForProfile={this._showProfileCardForProfile.bind(this)}
            closeOnPress={this._closeOnPress.bind(this)}
          />
        </View>
      );
    } else if (route.name == PAGE_NAMES.tagPage) {
      return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <TagPage
            navigator={navigator}
            myProfile={this.props.myProfile}
            token={this.token}
            showNavBar={true}
            setTags={(tags) => {this.props.updateMyProfile({tags:tags})}}
          />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Navigator
          ref={(elem)=>{this.navigator = elem}}
          initialRoute={{ name: PAGE_NAMES.preRelease }}
          renderScene={this._renderNavigatorScene.bind(this)}
          navigationBar={null}
        />
        {this._shouldRenderProfileView()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    height: WIDTH,
    width: WIDTH,
    padding: PADDING,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  title: {
    textAlign: 'center',
  },
  textContainer: {
    padding: PADDING,
    paddingBottom: 0,
  },
  registeredSmashers: {
    fontSize: 30,
  },
  buttonContainer: {
    padding: PADDING,
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: WIDTH - PADDING * 2,
    height: 60,
    marginBottom: 15,
    opacity: 1,
  },
  buttonText: {
    color: "white",
    fontWeight:"600",
  },
  smashButton: {
    backgroundColor: GlobalFunctions.style().color,
  },
});

  export default PreReleasePage;
