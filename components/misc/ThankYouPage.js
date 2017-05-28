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
  Image,
  Platform,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js"
import RectButton             from "../global/RectButton.js";
const OverrideActions = GlobalFunctions.overrideActions();
const Analytics = require('react-native-firebase-analytics');
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const PADDING = 20;
const IS_ANDROID = Platform.OS === 'android';

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

  _loadTryPage() {
    Alert.alert(
      "Try JumboSmash",
      "This version uses fake profiles to see what the app was like during the prime of Senior Week",
      [
        {text:"Let's Go!", onPress:()=>{this.props.changePage(OverrideActions.tryApp)}},
        {text:"Close", onPress:()=>{}},
      ]
    )
  }

  _openAppStore () {
    let link = IS_ANDROID ? "market://details?id=com.jumbosmash" : "itms-apps://itunes.apple.com/us/app/jumbosmash/id1208768432?ls=1&mt=8";
    Linking.canOpenURL(link).then(supported => {
      supported && Linking.openURL(link);
    }, (err) => console.log(err));
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Image
              style={styles.gif}
              source={require("./images/wink.gif")}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>Congratulations Class of 2017</Text>
            <Text style={GlobalStyles.text}>We hope you had fun using JumboSmash, we certainly had fun making it. We wish you all the best of luck and hope you keep in contact with your matches. Off to the real world we go!</Text>
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
              text="Try the App with dummy profiles"
              onPress={this._loadTryPage.bind(this)}
            />
            <RectButton
              style={[styles.button, styles.aboutButton]}
              textStyle={styles.buttonText}
              text="Making of / About the Team"
              onPress={this._openAboutURL.bind(this)}
            />
            <RectButton
              style={[styles.button, styles.aboutButton]}
              textStyle={styles.buttonText}
              text="Write an App Review (Weirder is Better)"
              onPress={this._openAppStore.bind(this)}
            />
          </View>
          <View style={[styles.textContainer, styles.thankYous]}>
            <Text style={[GlobalStyles.boldText, {marginBottom: 10}]}>Our Team:</Text>
            <Text style={GlobalStyles.text}>Developers: {GlobalFunctions.developers()}{"\nDesigners: "+GlobalFunctions.designers()}.{"\n\n"}We’d also like to thank many people for their help including:{"\n"}</Text>
            <Text style={[GlobalStyles.text, {textAlign: 'center'}]}>{GlobalFunctions.helpers()}</Text>
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
    height: WIDTH,
    width: WIDTH,
    padding: PADDING,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    resizeMode: 'contain',
    marginTop: WIDTH * .15,
    width: WIDTH*.7,
    height: WIDTH*.7,
  },
  title: {
    textAlign: 'center',
  },
  textContainer: {
    paddingRight: PADDING,
    paddingLeft: PADDING,
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
    textAlign: 'center',
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
