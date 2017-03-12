'use strict';

/*
Responsible for the view of the dropdown banner that shows a notification

exports:
showWithMessage(message, onPress)
example:
this.notificationBanner.showWithMessage("test", ()=>{
  this.navigator.changeTab(PageNames.chatPage);
});
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  PanResponder
} from 'react-native';

const VERTICAL_THRESHOLD = 10; // distance pull/push required to register action
const BANNER_SHOW_HEIGHT = 75; // perceived height of banner
const BANNER_TOTAL_HEIGHT = 200; // perceived + hidden height of banner
const MAX_BANNER_PULL = 20; // max distance allowed for downward pull (decelerated)

const INITIAL_POSITION = {x:0, y: -BANNER_TOTAL_HEIGHT - 10};
const SHOW_POSITION = {x:0, y: BANNER_SHOW_HEIGHT - BANNER_TOTAL_HEIGHT};
const BUMP_POSITION = {x:0, y: BANNER_SHOW_HEIGHT - BANNER_TOTAL_HEIGHT + 30};
import clamp from 'clamp';

class NotificationBannerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(INITIAL_POSITION),
      message: "",
      onPress: null,
      numMessages: 0,
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dy != 0;
      },

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: 0, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: 0, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        let yDiff = this.state.pan.y._value - SHOW_POSITION.y;
        if (Math.abs(yDiff) > VERTICAL_THRESHOLD) {
          let yvelocity =  clamp(vy, -3, 3);

          if (yDiff > 0) {
            this._notificationBannerTapped();
          } else {
            this._hideNotificationBanner();
          }
        } else { // return back
          this._showNotificationBanner(null, 4);
        }
      }
    })
  }

  componentDidMount () {
    // this._showNotificationBanner();
  }

  showWithMessage(message, onPress) {
    this.setState({
      message,
      onPress,
    });
    this._showNotificationBanner();
  }

  _showNotificationBanner(callback, friction = 5) {
    if (this.state.numMessages > 0) {
      Animated.timing(
        this.state.pan,
        {
          toValue: BUMP_POSITION,
          duration: 100,
        }
      ).start(() => {
        Animated.spring(
          this.state.pan,
          {
            toValue: SHOW_POSITION,
            friction: 7,
          }
        ).start()
      });
    } else {
      Animated.spring(
        this.state.pan,
        {
          toValue: SHOW_POSITION,
          friction,
        }
      ).start(callback);
    }
    this.setState({numMessages: this.state.numMessages + 1});
  }

  _hideNotificationBanner(callback, friction = 5) {
    Animated.spring(
      this.state.pan,
      {
        toValue: INITIAL_POSITION,
        friction,
      }
    ).start(() => {
      if (callback) {
        callback();
      }
      this.setState({numMessages: 0});
    });
  }

  _notificationBannerTapped() {
    if (this.state.onPress) {
      this.state.onPress();
    }
    this._hideNotificationBanner();
  }

  render() {
    let pan = this.state.pan;
    let origY = BANNER_SHOW_HEIGHT - BANNER_TOTAL_HEIGHT;
    let translateY = pan.y.interpolate({
                                        inputRange:[origY - BANNER_SHOW_HEIGHT, origY, origY + 300],
                                        outputRange:[origY - BANNER_SHOW_HEIGHT, origY, origY + MAX_BANNER_PULL],
                                        extrapolateRight: 'clamp',
                                      });
    let numMsgs = this.state.numMessages;
    return(
      <Animated.View
        style={[styles.container, this.props.style, {transform:[{translateY}]}]}
        {...this._panResponder.panHandlers}>
        <TouchableHighlight style={{flex:1}} onPress={this._notificationBannerTapped.bind(this)}>
          <View style={[styles.view]}>
            <Text style={styles.text}>{this.state.message}{numMsgs > 1 ? " ("+numMsgs.toString()+")" : ""}</Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: BANNER_TOTAL_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
    borderRadius: 5,
  },
  text: {
    paddingTop: BANNER_TOTAL_HEIGHT - BANNER_SHOW_HEIGHT,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  }
});

export default NotificationBannerView;
