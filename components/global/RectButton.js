'use strict';

/*
Button that pulls up email-support
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import GlobalStyles   from "../global/GlobalStyles.js";

class RectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      springValue: new Animated.Value(1.0),
    }
  }

  _onPressIn() {
    if (!this.props.shouldNotAnimate) {
      this.state.springValue.setValue(0.97);
      Animated.timing(
        this.state.springValue,
        {toValue: 0.95}
      ).start()
    }
  }

  _onPress() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  _onPressOut() {
    Animated.spring(
      this.state.springValue,
      {
        toValue: 1.0,
        friction: 3,
      }
    ).start();
  }

  render() {
    return(
      <Animated.View
        style={[styles.container,
                this.props.style ? this.props.style : {},
                {transform:[{scale: this.state.springValue}]}]}
      >
        <TouchableWithoutFeedback
          style={styles.touchArea}
          onPress={this._onPress.bind(this)}
          onPressIn={this._onPressIn.bind(this)}
          onPressOut={this._onPressOut.bind(this)}
        >
          <View style={styles.view}>
            <Text style={[GlobalStyles.text, this.props.textStyle]}>{this.props.text ? this.props.text : ""}</Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
  },
  touchArea: {
    flex: 1,
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default RectButton;
