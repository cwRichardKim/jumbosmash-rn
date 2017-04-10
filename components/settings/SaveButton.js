'use strict';

/*
Save button UI and Animations for the settings page. Reliese on Button.js
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Animated,
  Easing,
} from 'react-native';

import CircleButton from "../global/CircleButton.js"
import GlobalStyles from "../global/GlobalStyles.js"
const SaveButtonState = require('../global/GlobalFunctions.js').saveButtonStates();

class SaveButton extends Component {
  constructor(props) {
    super(props);
    this.isBouncing = false;

    this.keyboardHeight = this.props.keyboardHeight;

    this.state = {
      pan: new Animated.ValueXY({x:0, y: this.keyboardHeight}),
    }
  }

  // public function
  keyboardHeightWillChange(keyboardHeight) {
    this.keyboardHeight = keyboardHeight;
    Animated.spring(
      this.state.pan,
      {
        toValue: {x: 0, y: - this.keyboardHeight}
      }
    ).start();
  }

  _bounce() {
    if (this.props.saveButtonState == SaveButtonState.show && !this.isBouncing) {
      this.isBouncing = true;
      setTimeout(() => {
        if (this.props.saveButtonState == SaveButtonState.show) {
          Animated.timing(
            this.state.pan,
            {
              toValue: {x: 0, y: -10 - this.keyboardHeight},
              easing: Easing.out(Easing.ease),
              duration: 200,
            }
          ).start( () => {
            Animated.timing(
              this.state.pan,
              {
                toValue: {x: 0, y: 0 - this.keyboardHeight},
                easing: Easing.bounce,
              }
            ).start(() => {
              this.isBouncing = false;
              this._bounce();
            });
          });
        }
      }, 4000);
    }
  }

  _onPress() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  // public function to animate the button away
  animateOut (callback) {
    setTimeout(() => {
      Animated.timing(
        this.state.pan,
        {
          toValue: {x: 0, y: 100},
          duration: 300,
        }
      ).start(() => {
        if (callback) {
          callback();
        }
        this.state.pan.setValue({x:0, y:0});
      });
    }, 300);
  }

  render() {
    let hideButton = this.props.saveButtonState == SaveButtonState.hide;
    let showButton = this.props.saveButtonState == SaveButtonState.show;
    let buttonIsLoading = this.props.saveButtonState == SaveButtonState.saving;
    if (showButton) {
      this._bounce();
    }
    if (showButton || buttonIsLoading) {
      return(
        <Animated.View style={[styles.saveButtonContainer,
          {transform: this.state.pan.getTranslateTransform()}]}>
          <CircleButton
            style={[styles.saveButton]}
            source={require("./images/saveButton.png")}
            onPress={this._onPress.bind(this)}
            animateInFrom={showButton ? {x: 0, y: 100} : null}
            isLoading={this.props.saveButtonState == SaveButtonState.saving}
            hasShadow={true}
            hasStrongShadow={true}
          />
        </Animated.View>
      );
    } else {
      return(null);
    }
  }
}

const styles = StyleSheet.create({
  saveButtonContainer: {
    position: 'absolute',
    bottom: 20,
    height: 50,
    width: 70,
    right: 0,
  },
  saveButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default SaveButton;
