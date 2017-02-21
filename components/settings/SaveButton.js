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

class SaveButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      saveButtonBump: new Animated.ValueXY({x:0, y:0}),
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this._bounce();
  }

  _bounce() {
    setTimeout(() => {
      Animated.timing(
        this.state.saveButtonBump,
        {
          toValue: {x: 0, y: -10},
          easing: Easing.out(Easing.ease),
          duration: 200,
        }
      ).start( () => {
        Animated.timing(
          this.state.saveButtonBump,
          {
            toValue: {x: 0, y: 0},
            easing: Easing.bounce,
          }
        ).start(() => {
          if (! this.state.isSaving) {
            this._bounce();
          }
        });
      });
    }, 3000);
  }

  _onPress() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  render() {
    return(
      <Animated.View style={[styles.saveButtonContainer,
                            {transform: this.state.saveButtonBump.getTranslateTransform()}]}>
        <Button
          style={styles.saveButton}
          source={require("./images/saveButton.png")}
          onPress={this._onPress.bind(this)}
          animateInFrom={{x: 0, y: 100}}
          animateOutTo={{x:0, y:100}}
        />
      </Animated.View>
    );
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
