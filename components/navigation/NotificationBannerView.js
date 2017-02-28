'use strict';

/*
Responsible for the view of the dropdown banner that shows a notification
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

const VERTICAL_THRESHOLD = 10;
const BANNER_SHOW_HEIGHT = 75;
const BANNER_TOTAL_HEIGHT = 200; // from NavigationContainer

const INITIAL_POSITION = {x:0, y: -BANNER_TOTAL_HEIGHT};
const SHOW_POSITION = {x:0, y: BANNER_SHOW_HEIGHT - BANNER_TOTAL_HEIGHT};
import clamp from 'clamp';

class NotificationBannerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(INITIAL_POSITION),
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

        console.log(Math.abs(this.state.pan.y._value - SHOW_POSITION.y))
        if (Math.abs(this.state.pan.y._value - SHOW_POSITION.y) > VERTICAL_THRESHOLD) {
          let yvelocity =  clamp(vy, -3, 3);

          this._hideNotificationBanner();
        } else { // return back
          this._showNotificationBanner();
        }
      }
    })
  }

  componentDidMount () {
    this._showNotificationBanner();
  }

  _showNotificationBanner(callback) {
    Animated.spring(
      this.state.pan,
      {
        toValue: SHOW_POSITION,
      }
    ).start(callback);
  }

  _hideNotificationBanner(callback) {
    Animated.spring(
      this.state.pan,
      {
        toValue: INITIAL_POSITION,
      }
    ).start(callback);
  }

  _notificationBannerTapped() {
    this._hideNotificationBanner(this.props.onPress());
  }

  render() {
    return(
      <Animated.View
        style={[this.props.style, {transform:this.state.pan.getTranslateTransform()}]}
        {...this._panResponder.panHandlers}>
        <TouchableHighlight style={styles.container} onPress={this._notificationBannerTapped.bind(this)}>
          <View style={[styles.view]}>
            <Text style={styles.text}>{this.props.message ? this.props.message : "test"}</Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray"
  },
  text: {
    paddingTop: BANNER_TOTAL_HEIGHT - BANNER_SHOW_HEIGHT,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  }
});

export default NotificationBannerView;
