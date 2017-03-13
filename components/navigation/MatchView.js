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
} from 'react-native';

import LoadableImage  from '../global/LoadableImage.js';
import RectButton     from '../global/RectButton.js';
import GlobalStyles   from "../global/GlobalStyles.js";

const BORDER_RADIUS = 10;
const WIDTH = Dimensions.get('window').width;

//TODO: @richard Make a carousel on the photos
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
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[GlobalStyles.absoluteCover, styles.background, {opacity: this.state.backgroundOpacity}]}/>
        <Animated.View style={[styles.foreground, {opacity: this.state.foregroundOpacity}]}>
          <Animated.View style={[styles.textContainer, {transform: [{scale: this.state.foregroundScale}]}]}>
            <Text style={[GlobalStyles.text, styles.matchText]}>It's a Smatch!</Text>
          </Animated.View>
          <View style={styles.matchContainer}>
            <Animated.View style={[styles.profile, styles.leftProfile, {transform: [{scale: this.state.foregroundScale}]}]}>
              <LoadableImage
                source={{uri: this._shouldRenderLeftPhoto()}}
                style={styles.image}
                _key={this._shouldRenderLeftKey()}
              />
            </Animated.View>
            <Animated.View style={[styles.profile, styles.rightProfile, {transform: [{scale: this.state.foregroundScale}]}]}>
              <LoadableImage
                source={{uri: this._shouldRenderRightPhoto()}}
                style={styles.image}
                _key={this._shouldRenderRightKey()}
              />
            </Animated.View>
          </View>
          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.rectButton, {transform: [{scale: this.state.foregroundScale}]}]}>
              <RectButton
                style={[styles.matchButton]}
                text="Go To Chat"
                onPress={() => this._close(true)}
              />
            </Animated.View>
            <Animated.View style={[styles.rectButton, {transform: [{scale: this.state.foregroundScale}]}]}>
              <RectButton
                style={[styles.closeButton]}
                text="Close"
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
  foreground: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  matchText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 40,
  },
  matchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profile: {
    width: WIDTH * 0.35,
    height: WIDTH * 0.35,
    borderRadius: WIDTH * 0.35 / 2,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'purple',
  },
  leftProfile: {
    marginRight: -10,
  },
  rightProfile: {
    marginLeft: -10,
  },
  image: {
    flex: 1,
  },
  buttonContainer: {
    flex: 2,
    justifyContent: 'center'
  },
  rectButton: {
    height: 60,
    marginTop: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  matchButton: {
    backgroundColor: '#F2585A',
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#555555',
    flex: 1,
  },
  bottomBuffer: {
    flex: 0,
  }
});

export default MatchView;
