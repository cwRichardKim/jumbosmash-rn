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
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js"
import RectButton             from "../global/RectButton.js";
import AuthErrors             from "../login/AuthErrors.js";
let Mailer = require('NativeModules').RNMail;
const StorageKeys = GlobalFunctions.storageKeys();
const OverrideActions = GlobalFunctions.overrideActions();
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const PADDING = 20;

class PreReleasePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _loadPreReleaseApp() {
    Alert.alert(
      "You're here early",
      "Official release: May 12th, 2017.\n\nThe 'pre-release state' is fully functional, but chats and matches might be scarce due to the limited number of early-access users.\n\nteam@jumbosmash.com for questions!",
      [
        {text:"Open in Pre-release State", onPress:()=>{this.props.changePage(OverrideActions.openApp)}},
      ]
    )
  }

  _sendMail() {
    if (Mailer && Mailer.mail) {
      Mailer.mail({
        subject: 'Requesting Early Access',
        recipients: ['team@jumbosmash.com'],
        body: '[account email: ]',
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

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={[GlobalStyles.boldText, styles.title]}>Welcome to Jumbosmash ;)</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>Only X more days until release</Text>
            <Text style={GlobalStyles.text}>text etc etc</Text>
          </View>
          <View style={styles.buttonContainer}>
            {this._shouldLoadPreReleaseButton()}
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
