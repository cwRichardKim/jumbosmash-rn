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
  Animated,
  PanResponder,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import clamp            from 'clamp';

let SWIPE_THRESHOLD = 120;

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.9),
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity = this.calculateVelocity(vx);

        // if we swiped more then 120px away from the middle
        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {

          // if it's a right swipe
          if (this.state.pan.x._value > 0) {
            // do something with the data, this function has no impact on the visuals
            this.props.handleRightSwipeForIndex(this.props.index);
          } else { // else if if it's a left swipe
            // do something with the data, this function has no impact on the visuals
            this.props.handleLeftSwipeForIndex(this.props.index);
          }

          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.975
          }).start(this._swipeDidComplete.bind(this))
        } else { //
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

  calculateVelocity(vx) {
    if (vx >= 0) {
      return clamp(vx, 3, 5);
    } else if (vx < 0) {
      return clamp(vx * -1, 3, 5) * -1;
    }
  }

  _animateEntrance() {
    Animated.spring( this.state.enter, { toValue: 1, friction: 8 } ).start();
  }

  _swipeDidComplete() {
    if (this.props.swipeDidComplete) {
      // this function deals with the data (number of cards) and should have no impact on visuals
      this.props.swipeDidComplete(this.props.index);
    }
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0.9);
    this._animateEntrance();
  }

  render() {
    let [pan, enter] = [this.state.pan, this.state.enter];

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]});
    let scale = enter;

    let animatedCardstyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    return (
      <Animated.View style={[styles.cardView, animatedCardstyles, {zIndex: this.props.isTop ? 11 : 10}]} {...this._panResponder.panHandlers}>
        <TouchableWithoutFeedback style={styles.touchArea}
          onPress={this.props.onPress}>
          <View style={styles.shadowView}>
            <View style={styles.card}>
              <Image
                style={styles.thumbnail}
                source={{uri: (this.props.photos && this.props.photos.length >= 1) ? this.props.photos[0] : 'https://img2.greatnotions.com/StockDesign/XLarge/King_Graphics/m0410.jpg'}}
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
  thumbnail: {
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
