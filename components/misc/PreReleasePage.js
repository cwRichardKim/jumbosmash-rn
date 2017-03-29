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
  Alert,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js"
import RectButton             from "../global/RectButton.js";
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

  _openAboutURL() {
    let aboutURL = "http://tufts.io/jumbosmash2017";
    if (Linking.canOpenURL(aboutURL)) {
      Linking.openURL(aboutURL);
    } else {
      Alert.alert(
        "Unable to open link with your device",
        "Try going to "+aboutURL+" in your local browser",
        [{text: "OK", onPress: ()=>{}}]
      )
    }
  }

  _loadPrereleaseApp() {
    Alert.alert(
      "Opening app in pre-release state",
      "Jumbosmash will be released on May 12th, 2017.\n\nOnly developers and beta testers have access to the app before then. In this pre-release state, the app will function normally, but some features might seem empty. For example, no chats or matches will exist since no user will have swiped right on you.\n\nteam@jumbosmash.com for questions!",
      [
        {text:"Open in Pre-release State", onPress:()=>{this.props.changePage(OverrideActions.openApp)}},
      ]
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
            <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>We hope you had fun</Text>
            <Text style={GlobalStyles.text}>Using JumboSmash, we certainly had fun making it. We wish you all the best of luck and hope you keep in contact with your matches. Off to the real world we go!</Text>
          </View>
          <View style={styles.buttonContainer}>
            <RectButton
              style={[styles.button, styles.smashButton]}
              textStyle={styles.buttonText}
              text="PRE-RELEASE"
              onPress={this._loadPrereleaseApp.bind(this)}
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
