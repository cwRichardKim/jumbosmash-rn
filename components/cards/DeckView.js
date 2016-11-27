'use strict';

/*
This file deals primarily with the animations of the swiping mechanism. It should
delegate the UI of the card to Card and the UI of an empty deck to NoMoreCards
*/

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Animated,
    PanResponder,
    Image
} from 'react-native';

import clamp      from 'clamp';
import YesView    from './YesView.js'
import NoView     from './NoView.js'

var SWIPE_THRESHOLD = 120;

class DeckView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.9),
      card: this.props.cards ? this.props.cards[0] : null,
    }
  }

  _goToNextCard() {
    let currentCardIdx = this.props.cards.indexOf(this.state.card);
    let newIdx = currentCardIdx + 1;

    let card = newIdx < this.props.cards.length ? this.props.cards[newIdx] : null;

    this.setState({card: card});
  }

  componentDidMount() {
    this._animateEntrance();
  }

  _animateEntrance() {
    Animated.spring( this.state.enter, { toValue: 1, friction: 8 } ).start();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.cards && nextProps.cards.length > 0){
      this.setState({
        card: nextProps.cards[0]
      })
    }
  }

  calculateVelocity(vx) {
    if (vx >= 0) {
      return clamp(vx, 3, 5);
    } else if (vx < 0) {
      return clamp(vx * -1, 3, 5) * -1;
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

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {

          if (this.state.pan.x._value > 0) {
            this.props.handleRightSwipe(this.state.card);
          } else {
            this.props.handleLeftSwipe(this.state.card);
          }

          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this._resetState.bind(this))
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  _resetState() {
    if (this.props.cardRemoved) {
      this.props.cardRemoved(this.props.cards.indexOf(this.state.card));
    }
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0.8);
    this._goToNextCard();
    this._animateEntrance();
  }

  shouldRenderCard(animatedCardstyles) {
    if (this.state.card) {
      return (
        <Animated.View style={[styles.cardView, animatedCardstyles]} {...this._panResponder.panHandlers}>
          {this.props.renderCard(this.state.card)}
        </Animated.View>
      );
    } else {
      if (this.props.renderNoMoreCards) {
        return this.props.renderNoMoreCards();
      } else {
        return (
          <View><Text>No More Cards</Text></View>
        );
      }
    }
  }

  render() {
    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]});
    let scale = enter;

    let animatedCardstyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yesOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let yesScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedYesStyles = {transform: [{scale: yesScale}], opacity: yesOpacity}

    let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    return (
      <View style={this.props.containerStyle}>

        {this.shouldRenderCard(animatedCardstyles)}

        <Animated.View style={[animatedNopeStyles, styles.noView]}>
          <NoView/>
        </Animated.View>

        <Animated.View style={[animatedYesStyles, styles.yesView]}>
          <YesView/>
        </Animated.View>

      </View>
    );
  }
}

// Base Styles. Use props to override these values
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  yesView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  noView: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  cardView: {
    width: 300,
    height: 500,
  },
});

DeckView.propTypes = {
  cards: React.PropTypes.array,
  renderCards: React.PropTypes.func,
  renderNoMoreCards: React.PropTypes.func,
  showRightSwipe: React.PropTypes.bool,
  showLeftSwipe: React.PropTypes.bool,
  handleRightSwipe: React.PropTypes.func,
  handleLeftSwipe: React.PropTypes.func,
  containerStyle: View.propTypes.style,
};

DeckView.defaultProps = {
  containerStyle: styles.container,
};


export default DeckView;
