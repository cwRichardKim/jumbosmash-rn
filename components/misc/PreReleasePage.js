'use strict';

/*
page that shows before the app is released
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
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js";
import RectButton             from "../global/RectButton.js";
import AuthErrors             from "../login/AuthErrors.js";
import TagPage                from "../settings/TagPage.js";
import SettingsPage           from "../settings/SettingsPage.js";
import ProfileCardView        from "../cards/ProfileCardView.js";
let Mailer = require('NativeModules').RNMail;
const StorageKeys = GlobalFunctions.storageKeys();
const OverrideActions = GlobalFunctions.overrideActions();
const Analytics = require('react-native-firebase-analytics');
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const PADDING = 20;
const PAGE_NAMES = GlobalFunctions.pageNames();

class PreReleasePage extends Component {
  constructor(props) {
    super(props);
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

  _loadPreReleaseApp() {
    Alert.alert(
      "You're here early",
      "Official release: "+GlobalFunctions.formatDate(GlobalFunctions.dates().startDate)+"\n\nThe 'pre-release state' is fully functional, but since we only have a handful of beta testers, we've included a few extra temporary fake users.\n\nteam@jumbosmash.com for questions!",
      [
        {text:"Open in Pre-release State", onPress:()=>{this.props.changePage(OverrideActions.openApp)}},
      ]
    )
  }

  _sendMail() {
    if (Mailer && Mailer.mail) {
      let accountEmail = (this.props.myProfile && this.props.myProfile.email) ? this.props.myProfile.email : "your tufts email";
      Mailer.mail({
        subject: 'Requesting Early Access',
        recipients: ['team@jumbosmash.com'],
        body: '[account email: '+ accountEmail +']\n\nReason: (eg: registered beta tester, Tufts Daily / Observer, way too goddamn thirsty to deal with your release date bs)',
      }, (error, event) => {
        if(error) {
          Alert.alert('Error', 'Could not send mail. Try sending an email to team@jumbosmash.com through your mail client');
        }
      });
    } else {
      Alert.alert(
        "Unsupported Device",
        "Sorry, your device doesn't support in-app email :(\nSend your question / feedback to team@jumbosmash.com with your mail client",
        [{text:"OK", onPress:()=>{}}]
      )
    }
  }

  _shouldLoadPreReleaseButton () {
    if (this.props.myProfile && (this.props.myProfile.teamMember === true || this.props.myProfile.betaTester === true)) {
      return (
        <RectButton
          style={[styles.button, styles.smashButton]}
          textStyle={styles.buttonText}
          text="Enter (you have special access 😁)"
          onPress={this._loadPreReleaseApp.bind(this)}
        />
      )
    } else {
      return (
        <RectButton
          style={[styles.button, styles.smashButton]}
          textStyle={styles.buttonText}
          text="Request Early Access"
          onPress={this._sendMail.bind(this)}
        />
      )
    }
  }

  _logout() {
    this.props.firebase.auth().signOut()
      .then(() => {
        try {
          AsyncStorage.removeItem(StorageKeys.myProfile);
        } catch (error) {
          throw "Error: Remove from storage: " + error;
        }
        this.props.changePage(OverrideActions.logout);
      })
      .catch((error) => {
        AuthErrors.handleLogoutError(error);
        throw error;
      }
    );
  }

  _renderTitleString() {
    let today = new Date();
    let timeDiff = Math.abs(GlobalFunctions.dates().startDate.getTime() - today.getTime());
    let diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 0) {
      return ("Only "+diffDays.toString()+" more days until release");
    } else {
      let diffHours = Math.floor(timeDiff / (1000 * 3600));
      return ("Only "+diffHours.toString()+" more hours until release");
    }
  }

  _copyShareLink() {
    Clipboard.setString('jumbosmash.com/share');
    Alert.alert(
      "Copied!",
      "Jumbosmash URL copied to your clipboard",
      [{text:"OK",onPress:()=>{}}]
    )
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

  _renderNavigatorScene (route, navigator) {
    if (route.name == PAGE_NAMES.preRelease) {
      return (
        <View style={{flex: 1}}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={[GlobalStyles.boldText, styles.title]}>Welcome to Jumbosmash ;)</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>{this._renderTitleString()}</Text>
              <Text style={GlobalStyles.text}>Come back at midnight on {GlobalFunctions.formatDate(GlobalFunctions.dates().startDate)} for some smashy goodness. If you are a beta tester or someone who requires early access, tap the button below</Text>
            </View>
            <View style={styles.buttonContainer}>
              {this._shouldLoadPreReleaseButton()}
              <RectButton
                style={[styles.button, styles.smashButton]}
                textStyle={styles.buttonText}
                text="Share Download Link"
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
    height: .35 * HEIGHT,
    width: WIDTH,
    padding: PADDING,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  textContainer: {
    padding: PADDING,
    paddingBottom: 0,
  },
  buttonContainer: {
    padding: PADDING,
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: WIDTH - PADDING * 2,
    height: 50,
    marginBottom: 10,
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
