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
  ActivityIndicator,
} from 'react-native';

import clamp          from 'clamp';
import LoadableImage  from '../global/LoadableImage.js'

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
            this.props.handleRightSwipeForIndex(this.props.index);
          } else { // else if if it's a left swipe
            // do something with the data, this function has no impact on the visuals
            this.props.handleLeftSwipeForIndex(this.props.index);
          }
          let xdistance = (xvelocity + 0.5) * this.props.cardWidth;
          let ydistance = (yvelocity - 0.3) * this.props.cardWidth
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
          this.props.handleRightSwipeForIndex(this.props.index);
        } else {
          this.props.handleLeftSwipeForIndex(this.props.index);
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
      this.props.swipeDidComplete(this.props.index);
    }
    // reuses view for next card, center the card
    this.state.pan.setValue({x: 0, y: 0});
    this.isSwiping = false;
  }

  render() {
    let [pan, enter] = [this.state.pan, this.state.enter];

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-10deg", "0deg", "10deg"]});
    let scale = enter;

    let animatedCardstyles = this.props.positionInDeck == 0 ? {transform: [{translateX}, {translateY}, {rotate}, {scale}]} : {};

    return (
      <Animated.View style={[styles.cardView, animatedCardstyles, {zIndex: 10 - this.props.positionInDeck}]} {...this._panResponder.panHandlers}>
        <TouchableWithoutFeedback style={styles.touchArea}
          onPress={this.props.onPress}>
          <View style={styles.shadowView}>
            <View style={styles.card}>
              <LoadableImage
                source={{uri: (this.props.photos && this.props.photos.length >= 1) ? this.props.photos[0].large : 'https://img2.greatnotions.com/StockDesign/XLarge/King_Graphics/m0410.jpg'}}
                style={styles.image}
                _key={this.props.id}
              />
              <View style={styles.textContainer}>
                <Text style={styles.text}>{this.props.firstName}</Text>
              </View>
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  touchArea: {
    flex: 1,
  },
  shadowView: {
    flex: 1,
    borderRadius: borderRadius,

    // android shadow
    elevation: 3,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 14,
    shadowOpacity: 0.06,
  },
  card: {
    borderRadius: borderRadius,
    overflow: 'hidden',
    backgroundColor: 'white',
    flex: 1,
  },
  image: {
    flex: 1,
  },
  textContainer: {
    justifyContent: "center",
    minHeight: 60,
  },
  text: {
    padding: 20,
    fontSize: 20,
  }
});

Card.propTypes = {
  //TODO: add the expected property types (name, email, picture, etc)
};

Card.defaultProps = {
  //TODO: create default prop types when some stuff is screwed up
};

export default Card;
