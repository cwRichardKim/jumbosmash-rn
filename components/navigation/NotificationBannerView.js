'use strict';

/*
Responsible for the view of the dropdown banner that shows a notification

exports:
showWithMessage(message, onPress)
example:
this.notificationBanner.showWithMessage("dev", ()=>{
  this.navigator.changeTab(PageNames.chatPage);
});
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';

import GlobalStyles     from "../global/GlobalStyles.js";
import SimpleBadge      from "../global/SimpleBadge.js";
import GlobalFunctions  from "../global/GlobalFunctions.js";

const IS_ANDROID = Platform.OS === 'android';
const VERTICAL_THRESHOLD = 10; // distance pull/push required to register action
const BANNER_SHOW_HEIGHT = 90; // perceived height of banner
const BANNER_TOTAL_HEIGHT = 200; // perceived + hidden height of banner
const MAX_BANNER_PULL = 20; // max distance allowed for downward pull (decelerated)
const LOGO_PADDING = 25;
const LOGO_HEIGHT = BANNER_SHOW_HEIGHT - 2 * LOGO_PADDING;
const BADGE_HEIGHT = 25;
const PULL_INDICATOR_WIDTH = 40;
const PULL_INDICATOR_HEIGHT = 6;
const PULL_INDICATOR_BOTTOM = 8;
const CLOSE_BUTTON_WIDTH = 20;
const PAGE_WIDTH = Dimensions.get('window').width;

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
      ).start(() => {if (typeof callback === "function") {callback()}});
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this._hideNotificationBanner.bind(this), 4000);
    this.setState({numMessages: this.state.numMessages + 1});
  }

  _hideNotificationBanner(callback, friction = 5) {
    this.setState({numMessages: 0});
    Animated.spring(
      this.state.pan,
      {
        toValue: INITIAL_POSITION,
        friction,
      }
    ).start(() => {
      if (typeof callback === "function") {
        callback();
      }
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

    if (IS_ANDROID) {
      origY -= 10;
    }

    let translateY = pan.y.interpolate({
                                        inputRange:[origY - BANNER_SHOW_HEIGHT, origY, origY + 300],
                                        outputRange:[origY - BANNER_SHOW_HEIGHT, origY, origY + MAX_BANNER_PULL],
                                        extrapolateRight: 'clamp',
                                      });
    let badgeCount = (this.state.numMessages <= 1) ? 0 : this.state.numMessages;
    return(
      <Animated.View
        style={[styles.container, GlobalStyles.basicShadow, this.props.style, {transform:[{translateY}]}]}
        {...this._panResponder.panHandlers}>
        <TouchableHighlight style={{flex:1}} onPress={this._notificationBannerTapped.bind(this)}>
          <View style={[styles.view]}>
            <Image
              source={require("./images/banner.png")}
              style={styles.bannerBackground}
            />
            <Image
              source={require("../global/images/logo-med.png")}
              style={styles.image}
            />
            <Text
              style={[GlobalStyles.text, styles.text]}
              lineBreakMode="tail"
              numberOfLines={2}
            >
              {this.state.message}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={this._hideNotificationBanner.bind(this)}>
              <Image
                source={require("./images/banner-close.png")}
                style={styles.closeButtonImage}
              />
            </TouchableOpacity>
            <SimpleBadge
              style={styles.badge}
              value={badgeCount}
            />
            <View style={styles.pullIndicatorContainer}>
              <View style={styles.pullIndicator}/>
            </View>
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
    alignItems: "flex-start",
    paddingTop: 7,
    justifyContent: "center",
    backgroundColor: GlobalFunctions.style().color,
  },
  text: {
    paddingTop: BANNER_TOTAL_HEIGHT - BANNER_SHOW_HEIGHT,
    paddingRight: LOGO_PADDING + CLOSE_BUTTON_WIDTH,
    paddingLeft: LOGO_HEIGHT + LOGO_PADDING * 2,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: 'white',
  },
  bannerBackground: {
    height: BANNER_TOTAL_HEIGHT,
    position: 'absolute',
    bottom: 0,
    width: PAGE_WIDTH,
    resizeMode: 'cover',
  },
  image: {
    position: "absolute",
    top: BANNER_TOTAL_HEIGHT - BANNER_SHOW_HEIGHT + LOGO_PADDING + 5,
    left: LOGO_PADDING,
    height: LOGO_HEIGHT,
    width: LOGO_HEIGHT,
    borderRadius: LOGO_HEIGHT / 2,
  },
  badge: {
    position: "absolute",
    top: BANNER_TOTAL_HEIGHT - BANNER_SHOW_HEIGHT + BADGE_HEIGHT,
    left: LOGO_PADDING + LOGO_HEIGHT / 2,
    width: BADGE_HEIGHT,
    height: BADGE_HEIGHT,
  },
  pullIndicatorContainer: {
    position: "absolute",
    bottom: PULL_INDICATOR_BOTTOM,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pullIndicator: {
    width: PULL_INDICATOR_WIDTH,
    height: PULL_INDICATOR_HEIGHT,
    borderRadius: PULL_INDICATOR_HEIGHT / 2,
    backgroundColor: 'white',
    opacity: .3,
  },
  closeButton: {
    position: 'absolute',
    height: CLOSE_BUTTON_WIDTH,
    width: CLOSE_BUTTON_WIDTH,
    right: 20,
    bottom: (BANNER_SHOW_HEIGHT - CLOSE_BUTTON_WIDTH) / 2 - 5,
  },
  closeButtonImage: {
    height: CLOSE_BUTTON_WIDTH,
    width: CLOSE_BUTTON_WIDTH,
    resizeMode: 'contain',
    opacity: 0.5,
  }
});

export default NotificationBannerView;
