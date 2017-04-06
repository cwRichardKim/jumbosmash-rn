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
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js"
import RectButton             from "../global/RectButton.js";
import AuthErrors             from "../login/AuthErrors.js";
let Mailer = require('NativeModules').RNMail;
const StorageKeys = GlobalFunctions.storageKeys();
const OverrideActions = GlobalFunctions.overrideActions();
const Analytics = require('react-native-firebase-analytics');
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const PADDING = 20;

class PreReleasePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    Analytics.logEvent('open_pre_release_page', {});
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

  render() {
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
              text="Copy Share Link"
              onPress={this._copyShareLink.bind(this)}
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
    opacity: 0.8,
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
    backgroundColor: "#715BB9",
  },
});

  export default PreReleasePage;
