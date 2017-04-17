'use strict';

/*
This file is responsible for the UI of a single card. Parent class should be
able to give it text and images and it should be able to lay it out correctly.
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  Alert,
} from 'react-native';

import CircleButton from "../global/CircleButton.js";
import GlobalStyles from "../global/GlobalStyles.js";
import GlobalFunctions from "../global/GlobalFunctions.js";
let Mailer = require('NativeModules').RNMail;

const Analytics = require('react-native-firebase-analytics');
const WIDTH = Dimensions.get("window").width;
const MIN_SWIPES_FOR_EMOJIS = 20;

const emojis= [
  [ 0, "💀"],
  [ 1, "💩"],
  [ 2, "💔"],
  [ 3, "😩"],
  [ 4, "☹️"],
  [ 5, "👌"], // starting position
  [ 7, "😍"],
  [10, "❤️"],
  [14, "💦"],
  [19, "🍑"],
  [25, "🙈"],
  [32, "🔥"],
];

class SwipeButtonsView extends Component {
  constructor(props) {
    super(props);
  }

  _sendMail() {
    if (Mailer && Mailer.mail) {
      Mailer.mail({
        subject: 'I f*cked up',
        recipients: ['team@jumbosmash.com'],
        body: '[What\'s the issue? eg: matched with someone I don\'t want to match with (include their full name if possible)]',
      }, (error, event) => {
        if(error) {
          Alert.alert('Error', 'Could not send mail, you probably have an unsupported device. Try sending an email to team@jumbosmash.com through your mail client');
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

  _undoDisabledOnPress() {
    Alert.alert(
      "You can only undo left swipes 😉",
      "",
      [
        {text:"Ah sh*t I f*cked up. Halp me", onPress:this._sendMail.bind(this)},
        {text:"fine.", onPress: ()=>{}},
      ]
    );
  }

  _getEmojiStatus() {
    let likeScore = 7;
    let totalSwipes = this.props.likeCount + this.props.dislikeCount;
    if (totalSwipes > MIN_SWIPES_FOR_EMOJIS) {
      likeScore = Math.ceil((this.props.likeCount / totalSwipes) * this.props.maxSwipesRemembered);
    }
    let emoji = emojis[7][1];
    for (var i in emojis) {
      if (likeScore >= emojis[i][0]) {
        emoji = emojis[i][1];
      }
    }
    return emoji;
  }

  _statusOnPress() {
    Analytics.logEvent('emoji_status_button', {
      'status': this._getEmojiStatus(),
    });
    Alert.alert(
      "Your Status: "+this._getEmojiStatus(),
      "Your thirst status changes to reflect how often you swipe left or right. Don't worry, nobody else has to know \n💦🔒🙈",
      [{text:"KEEP SMASHIN\'", onPress: ()=>{}},]
    );
  }

  render() {
    let emojiStatus = this._getEmojiStatus();
    return (
      <View style={styles.container}>
        <View style={[styles.buttonContainer, styles.leftButtonContainer]}>
          <CircleButton
            style={[styles.button, styles.leftButton]}
            source={require("./images/cross.png")}
            onPress={this.props.leftButtonFunction}
            hasShadow={true}
          />
          <View style={styles.undoContainer}>
            <CircleButton
              style={[styles.smallButton]}
              source={require("./images/undo.png")}
              onPress={this.props.undo}
              disabled={!this.props.canUndo}
              hasShadow={true}
              hasLowShadow={true}
              disabledOpacity={0.3}
              disabledOnPress={this._undoDisabledOnPress.bind(this)}
            />
          </View>
        </View>
        <View style={styles.centerPadding}/>
        <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
          <CircleButton
            style={[styles.button, styles.rightButton]}
            source={require("./images/heart.png")}
            onPress={this.props.rightButtonFunction}
            hasShadow={true}
          />
          <View style={styles.emojiContainer}>
            <CircleButton
              style={[styles.button]}
              textStyle={{textAlign: 'center', fontWeight: '300', color: GlobalFunctions.style().gray}}
              onPress={this._statusOnPress.bind(this)}
              hasShadow={false}
              text={"status\n"+emojiStatus}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  undoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: WIDTH * (0.11 - 0.16),
  },
  emojiContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButton: {
    borderRadius: 100,
    width: WIDTH * 0.11,
    height: WIDTH * 0.11,
  },
  button: {
    borderRadius: 100,
    width: WIDTH * 0.16,
    height: WIDTH * 0.16,
  },
  buttonContainer: {
    flex: 4,
  },
  leftButtonContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  centerPadding: {
    flex: 1,
  },
  rightButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftButton: {
  },
  rightButton: {
  },
});

export default SwipeButtonsView;
