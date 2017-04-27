'use strict';

/*
This file is responsible for the UI and motion of a single card. Parent class should be
able to give it text and images and it should be able to lay it out correctly.
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import clamp          from 'clamp';
import LoadableImage  from '../global/LoadableImage.js';

const GlobalStyles = require("../global/GlobalStyles.js");
const GlobalFunctions = require("../global/GlobalFunctions.js");
const IS_ANDROID = Platform.OS === 'android';

const SWIPE_THRESHOLD = 90;

class Card extends Component {
  constructor(props) {
    super(props);

    this.isSwiping = false;

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.9),
      isImageLoading: true,
    }
  }

  // Returns whether the card should register a swipe action.
  // mostly guards against spam swiping / pressing
  _canSwipe() {
    return !this.isSwiping && this.props.positionInDeck == 0;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0 && this._canSwipe();
      },

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        if (!this._canSwipe()) {
          return;
        }
        this.state.pan.flattenOffset();

        // if we swiped more then 120px away from the middle
        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          this.isSwiping = true;
          let isRight = this.state.pan.x._value > 0;
          let xvelocity =  clamp(vx, 1, 3);
          let yvelocity =  clamp(vy, -3, 3);

          // if it's a right swipe
          if (isRight) {
            // do something with the data, this function has no impact on the visuals
            this.props.handleRightSwipeForIndex(this.props.cardIndex);
          } else { // else if if it's a left swipe
            // do something with the data, this function has no impact on the visuals
            this.props.handleLeftSwipeForIndex(this.props.cardIndex);
          }
          let xdistance = (xvelocity + 0.5) * this.props.cardWidth;
          let ydistance = (yvelocity - 0.3) * this.props.cardWidth;
          Animated.timing(this.state.pan, {
            toValue: {x: isRight ? xdistance : -xdistance, y: ydistance},
            duration: 200,
          }).start(this._swipeDidComplete.bind(this));

        } else { // return back
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  componentDidMount() {
    this._animateEntrance();
  }

  _programmaticSwipeAnimation(isRight) {
    if (!this.isSwiping) {
      this.isSwiping = true;
      let xValue = isRight ? this.props.cardWidth * 2 : this.props.cardWidth * -2;
      let yValue = 50;
      Animated.timing(this.state.pan, {
        toValue: {x: xValue, y: yValue},
        duration: 200,
      }).start(() => {
        if (isRight) {
          this.props.handleRightSwipeForIndex(this.props.cardIndex);
        } else {
          this.props.handleLeftSwipeForIndex(this.props.cardIndex);
        }
        this._swipeDidComplete();
      });
    }
  }

  programmaticSwipeRight() {
    this._programmaticSwipeAnimation(true);
  }

  programmaticSwipeLeft() {
    this._programmaticSwipeAnimation(false);
  }

  _animateEntrance() {
    Animated.spring( this.state.enter, { toValue: 1, friction: 8 } ).start();
  }

  _swipeDidComplete() {
    if (this.props.swipeDidComplete) {
      // this function deals with the data (number of cards) and should have no impact on visuals
      this.props.swipeDidComplete(this.props.cardIndex);
    }
    // reuses view for next card, center the card
    this.state.pan.setValue({x: 0, y: 0});
    this.isSwiping = false;
  }

  _shouldRenderCheck(isTeamMember) {
    if (isTeamMember) {
      return (
        <Image
          source={require("./images/check.png")}
          style={styles.check}
        />
      );
    } else {
      return null;
    }
  }

  _renderText() {
    if (this.props.tags && this.props.tags.length > 0) {
      return (
        <Text style={[GlobalStyles.text, styles.text]}>
          {this.props.firstName} <Text style={GlobalStyles.subtext}>- {this.props.tags.length} shared tags</Text>
        </Text>
      )
    } else {
      return (
        <Text style={[GlobalStyles.text, styles.text]}>{this.props.firstName}</Text>
      )
    }
  }

  //TODO @richard remove later, for debugging purposes
  _renderIndexView() {
    if (__DEV__ && this.props.index && this.props.numCards) {
      return (
        <View style={styles.indexView}>
          <Text>{"[i: " +this.props.cardIndex.toString()+ ", card: "+this.props.index.toString() +" of: " + this.props.numCards.toString()+" cards]"}</Text>
        </View>
      )
    } else {
      return null;
    }
  }

  render() {
    let [pan, enter] = [this.state.pan, this.state.enter];
    let [translateX, translateY] = [pan.x, pan.y];
    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-10deg", "0deg", "10deg"]});
    let scale = enter;

    let animatedCardstyles = this.props.positionInDeck == 0 ? {transform: [{translateX}, {translateY}, {rotate}, {scale}]} : {};

    let isTeamMember = this.props.teamMember === true;
    let popCard = isTeamMember && this.props.positionInDeck == 0;

    let androidElevation = 0;
    if (this.props.positionInDeck === 0) {
      androidElevation = 7;
    } else if (this.props.positionInDeck === 1) {
      androidElevation = 3
    }

    let cardShadow = {
      // android shadow
      elevation: androidElevation,
      // shadowColor: popCard ? GlobalFunctions.style().color : '#000000',
      shadowColor: GlobalFunctions.style().color,

      // ios shadow
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowRadius: 5,
      shadowOpacity: popCard ? 0.5 : 0.08,
    }

    return (
      <Animated.View style={[cardShadow, GlobalStyles.absoluteCover, styles.cardView, animatedCardstyles, {zIndex: 10 - this.props.positionInDeck}]} {...this._panResponder.panHandlers}>
        <TouchableWithoutFeedback style={styles.touchArea}
          onPress={()=>{this.props.onPress(null, true, this.props.cardIndex)}}>
          <View style={styles.card}>
            <LoadableImage
              source={{uri: (this.props.photos && this.props.photos.length >= 1) ? this.props.photos[0].large : ""}}
              style={styles.image}
              imageStyle={styles.imageStyle}
              backgroundStyle={styles.imageBackgroundStyle}
              _key={this.props.id}
              thumbnail={{uri: (this.props.photos && this.props.photos.length >=1) ? this.props.photos[0].small : ""}}
            />
            {this._renderIndexView()}
            <View style={styles.textContainer}>
              {this._renderText()}
              {this._shouldRenderCheck(isTeamMember)}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

let borderRadius = 20;

const styles = StyleSheet.create({
  cardView: {
    borderRadius: borderRadius,
  },
  touchArea: {
    flex: 1,
  },
  card: {
    borderRadius: borderRadius,
    overflow: IS_ANDROID ? null : 'hidden',
    backgroundColor: 'white',
    flex: 1,
  },
  image: {
    flex: 1,
  },
  imageStyle: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  },
  imageBackgroundStyle: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    padding: 20,
  },
  text: {
    fontSize: 20,
  },
  check: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginLeft: 7,
    marginBottom: 4,
  },
  indexView: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    opacity: 0.8,
    padding: 5,
    borderRadius: 5,
  }
});

export default Card;
