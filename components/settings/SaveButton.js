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

import Button from "../global/Button.js"
const SaveButtonState = require('../global/GlobalFunctions.js').saveButtonStates();

class SaveButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY({x:0, y:0}),
    }
  }

  _bounce() {
    if (this.props.saveButtonState == SaveButtonState.show) {
      setTimeout(() => {
        if (this.props.saveButtonState == SaveButtonState.show) {
          Animated.timing(
            this.state.pan,
            {
              toValue: {x: 0, y: -10},
              easing: Easing.out(Easing.ease),
              duration: 200,
            }
          ).start( () => {
            Animated.timing(
              this.state.pan,
              {
                toValue: {x: 0, y: 0},
                easing: Easing.bounce,
              }
            ).start(() => {
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
          <Button
            style={styles.saveButton}
            source={require("./images/saveButton.png")}
            onPress={this._onPress.bind(this)}
            animateInFrom={showButton ? {x: 0, y: 100} : null}
            isLoading={this.props.saveButtonState == SaveButtonState.saving}
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
    // android shadow
    elevation: 3,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
});

export default SaveButton;
