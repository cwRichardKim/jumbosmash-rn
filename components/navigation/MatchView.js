'use strict';

/*
This file is responseible for the UI of the match notification.

It requires:
myProfile: profile of the user
matchProfile: profile of the other user

onClose: function called after the view finishes its closing animation (usualy something like setState({showMatchView: false}))
onSuccess: function called after onClose if the user chose to hit the success button ("go to match")
           eg: change the tab to chat
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';

import LoadableImage    from '../global/LoadableImage.js';
import RectButton       from '../global/RectButton.js';
import GlobalStyles     from "../global/GlobalStyles.js";
import GlobalFunctions  from "../global/GlobalFunctions.js";

const WIDTH = Dimensions.get('window').width;
const BORDER_RADIUS = 10;
const PROFILE_BORDER_WIDTH = 4;
const PROFILE_WIDTH = WIDTH * 0.35;
const Analytics = require('react-native-firebase-analytics');
const IS_ANDROID = Platform.OS === 'android';

class MatchView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundOpacity: new Animated.Value(0),
      foregroundOpacity: new Animated.Value(0),
      foregroundScale: new Animated.Value(0.4),
    }
  }

  _shouldRenderLeftPhoto() {
    if (this.props.myProfile && this.props.myProfile.photos && this.props.myProfile.photos[0]) {
      return this.props.myProfile.photos[0].small;
    } else {
      return null;
    }
  }

  _shouldRenderRightPhoto() {
    if (this.props.matchProfile && this.props.matchProfile.photos && this.props.matchProfile.photos[0]) {
      return this.props.matchProfile.photos[0].small;
    } else {
      return null;
    }
  }

  _shouldRenderLeftKey() {
    if (this.props.myProfile && this.props.myProfile.id && this.props.myProfile.id.length > 0) {
      return this.props.myProfile.id+"small";
    } else {
      return null;
    }
  }

  _shouldRenderRightKey() {
    if (this.props.matchProfile && this.props.matchProfile.id && this.props.matchProfile.id.length > 0) {
      return this.props.matchProfile.id+"small";
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.state.backgroundOpacity.setValue(0);
    this.state.foregroundOpacity.setValue(0);
    this.state.foregroundScale.setValue(0.4);
    Animated.parallel([
      Animated.timing(
        this.state.backgroundOpacity,
        {toValue: 0.5}
      ),
      Animated.timing(
        this.state.foregroundOpacity,
        {toValue: 1}
      ),
      Animated.spring(
        this.state.foregroundScale,
        {toValue: 1, friction: 4}
      )
    ]).start();
  }

  _animateClose(callback) {
    Animated.sequence([
      Animated.timing(
        this.state.foregroundScale,
        {toValue: 1.1, duration: 200}
      ),
      Animated.parallel([
        Animated.timing(
          this.state.backgroundOpacity,
          {toValue: 0}
        ),
        Animated.timing(
          this.state.foregroundOpacity,
          {toValue: 0, duration: 200}
        ),
        Animated.spring(
          this.state.foregroundScale,
          {toValue: 0.5, friction: 4}
        )
      ])
    ]).start(callback)
  }

  // calls closing animation, then calls the closing function, and optionally
  // calls the success function
  _close(isSuccess) {
    this._animateClose(()=>{
      if (this.props.onClose) {
        if (isSuccess && this.props.onSuccess) {
          this.props.onSuccess();
        }
        this.props.onClose();
      }
    });
    Analytics.logEvent('match_button_hit', {
      'name': isSuccess ? 'smash_now' : 'smash_later',
    });
  }

  render() {
    let profileStyle = IS_ANDROID ? styles.profileAndroid : styles.profile;
    return (
      <View style={styles.container}>
        <Animated.View style={[GlobalStyles.absoluteCover, styles.background, {opacity: this.state.backgroundOpacity}]}/>
        <Animated.View style={[styles.foreground, {opacity: this.state.foregroundOpacity}]}>
          <View style={styles.topSpace}/>
          <Animated.View style={[styles.textContainer, {transform: [{scale: this.state.foregroundScale}]}]}>
            <Text style={[GlobalStyles.text, styles.matchText]}>It's a Smatch!</Text>
            <Text style={[GlobalStyles.text, {textAlign: 'center', color: 'white'}]}>Say hello to {this.props.matchProfile.firstName}</Text>
          </Animated.View>
          <View style={styles.matchContainer}>
            <Animated.View style={[profileStyle, styles.leftProfile, {transform: [{scale: this.state.foregroundScale}]}]}>
              <LoadableImage
                source={{uri: this._shouldRenderLeftPhoto()}}
                style={IS_ANDROID ? styles.profileAndroidContainer : styles.image}
                imageStyle={IS_ANDROID ? styles.imageAndroid : null}
                backgroundStyle={IS_ANDROID ? styles.imageAndroid : null}
                circleClippingStyle = {IS_ANDROID ? styles.fixCircleClipping : null}
                _key={this._shouldRenderLeftKey()}
              />
            </Animated.View>
            <Animated.View style={[profileStyle, styles.rightProfile, {transform: [{scale: this.state.foregroundScale}]}]}>
              <LoadableImage
                source={{uri: this._shouldRenderRightPhoto()}}
                style={IS_ANDROID ? styles.profileAndroidContainer : styles.image}
                imageStyle={IS_ANDROID ? styles.imageAndroid : null}
                backgroundStyle={IS_ANDROID ? styles.imageAndroid : null}
                circleClippingStyle = {IS_ANDROID ? styles.fixCircleClipping : null}
                _key={this._shouldRenderRightKey()}
              />
            </Animated.View>
          </View>
          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.rectButton, {transform: [{scale: this.state.foregroundScale}]}]}>
              <RectButton
                style={[styles.matchButton]}
                text="Smash Now"
                textStyle={styles.buttonText}
                onPress={() => this._close(true)}
              />
            </Animated.View>
            <Animated.View style={[styles.rectButton, {transform: [{scale: this.state.foregroundScale}]}]}>
              <RectButton
                style={[styles.closeButton]}
                text="Smash Later"
                textStyle={styles.buttonText}
                onPress={() => this._close(false)}
              />
            </Animated.View>
          </View>
          <View style={styles.bottomBuffer}/>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: 'black',
  },
  topSpace: {
    flex: 1,
  },
  foreground: {
    flex: 1,
  },
  textContainer: {
    flex: 3,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  matchText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 60,
    fontFamily: 'Satisfy',
  },
  matchContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profile: {
    width: PROFILE_WIDTH,
    height: PROFILE_WIDTH,
    borderRadius: PROFILE_WIDTH / 2,
    overflow: 'hidden',
    borderWidth: PROFILE_BORDER_WIDTH,
    borderColor: GlobalFunctions.style().color,
  },
  profileAndroid: {
    width: PROFILE_WIDTH + PROFILE_BORDER_WIDTH * 2,
    height: PROFILE_WIDTH + PROFILE_BORDER_WIDTH * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftProfile: {
    marginRight: -10,
  },
  rightProfile: {
    marginLeft: -10,
  },
  profileAndroidContainer: {
    width: PROFILE_WIDTH,
    height: PROFILE_WIDTH,
  },
  image: {
    flex: 1,
  },
  imageAndroid: {
    width: PROFILE_WIDTH,
    height: PROFILE_WIDTH,
    borderRadius: PROFILE_WIDTH / 2,
  },
  fixCircleClipping: {
    position: 'absolute',
    top: -PROFILE_BORDER_WIDTH,
    bottom: -PROFILE_BORDER_WIDTH,
    right: -PROFILE_BORDER_WIDTH,
    left: -PROFILE_BORDER_WIDTH,
    borderRadius: PROFILE_WIDTH / 2 + PROFILE_BORDER_WIDTH / 2,
    borderWidth: PROFILE_BORDER_WIDTH,
    borderColor: GlobalFunctions.style().color
  },
  buttonContainer: {
    flex: 5,
    justifyContent: 'center'
  },
  rectButton: {
    height: 60,
    marginTop: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  buttonText: {
    color: "white",
    fontWeight:"600",
  },
  matchButton: {
    backgroundColor: GlobalFunctions.style().color,
    flex: 1,
  },
  closeButton: {
    backgroundColor: GlobalFunctions.style().color,
    flex: 1,
  },
  bottomBuffer: {
    flex: 0,
  }
});

export default MatchView;
