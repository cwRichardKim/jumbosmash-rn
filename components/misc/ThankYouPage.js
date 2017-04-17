'use strict';

/*
page that shows after the app is finished / the server shut down
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js"
import RectButton             from "../global/RectButton.js";
const OverrideActions = GlobalFunctions.overrideActions();
const Analytics = require('react-native-firebase-analytics');
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const PADDING = 20;

class ThankYouPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    Analytics.logEvent('open_thank_you_page', {});
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

  _loadExpiredApp() {
    Alert.alert(
      "Warning: app may be shut down",
      "Jumbosmash might still work, but there's a decent chance we shut down the server due to cost reasons. Cross your fingers and give it a shot! 🤞",
      [
        {text:"KEEP SMASHIN'", onPress:()=>{this.props.changePage(OverrideActions.openApp)}},
        {text:"Close", onPress:()=>{}},
      ]
    )
  }

  _loadDemoPage() {
    Alert.alert(
      "Jumbosmash Demo",
      "The Demo uses fake profiles to see what the app was like now that Senior Week is over",
      [
        {text:"See the demo!", onPress:()=>{this.props.changePage(OverrideActions.demoApp)}},
        {text:"Close", onPress:()=>{}},
      ]
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={[GlobalStyles.boldText, styles.title]}>Congratulations{"\n"}Class of 2017</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>We hope you had fun</Text>
            <Text style={GlobalStyles.text}>Using JumboSmash, we certainly had fun making it. We wish you all the best of luck and hope you keep in contact with your matches. Off to the real world we go!</Text>
            <Text style={[GlobalStyles.text, styles.emojiText]}>🙈🙊🙉🍆🍑</Text>
          </View>
          <View style={styles.buttonContainer}>
            <RectButton
              style={[styles.button, styles.smashButton]}
              textStyle={styles.buttonText}
              text="Keep Smashin'"
              onPress={this._loadExpiredApp.bind(this)}
            />
            <RectButton
              style={[styles.button, styles.dummyButton]}
              textStyle={styles.buttonText}
              text="Demo the App (dummy profiles)"
              onPress={this._loadDemoPage.bind(this)}
            />
            <RectButton
              style={[styles.button, styles.aboutButton]}
              textStyle={styles.buttonText}
              text="Making of / About the Team"
              onPress={this._openAboutURL.bind(this)}
            />
          </View>
          <View style={[styles.textContainer, styles.thankYous]}>
            <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>Our Team:</Text>
            <Text style={GlobalStyles.text}>Developers: {GlobalFunctions.developers()}{"\nDesigners: "+GlobalFunctions.designers()}.{"\n\n"}We’d also like to thank our many beta testers including:{"\n"}</Text>
            <Text style={[GlobalStyles.text, {textAlign: 'center'}]}>{GlobalFunctions.betaTesters()}</Text>
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
  emojiText: {
    textAlign: 'center',
    margin: 20,
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
  dummyButton: {
    backgroundColor: GlobalFunctions.style().color,
  },
  smashButton: {
    backgroundColor: GlobalFunctions.style().color,
  },
  aboutButton: {
    backgroundColor: GlobalFunctions.style().color,
  },
  thankYous: {
    marginBottom: 50,
  }
});

  export default ThankYouPage;
