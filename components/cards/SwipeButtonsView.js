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
  Image,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

import CircleButton from "../global/CircleButton.js";
import GlobalStyles from "../global/GlobalStyles.js";

const WIDTH = Dimensions.get("window").width;

class SwipeButtonsView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.buttonContainer, styles.leftButtonContainer]}>
          <CircleButton
            style={[GlobalStyles.buttonShadow, styles.button, styles.leftButton]}
            source={require("./images/cross.png")}
            onPress={this.props.leftButtonFunction}
          />
        </View>
        <View style={styles.centerPadding}/>
        <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
          <CircleButton
            style={[GlobalStyles.buttonShadow, styles.button, styles.rightButton]}
            source={require("./images/heart.png")}
            onPress={this.props.rightButtonFunction}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  button: {
    borderRadius: 100,
    width: WIDTH * 0.16,
    height: WIDTH * 0.16,
  },
  buttonContainer: {
    flex: 4,
  },
  leftButtonContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  centerPadding: {
    flex: 1,
  },
  rightButtonContainer: {
    justifyContent: 'center',
  },
  leftButton: {
  },
  rightButton: {
  },
});

export default SwipeButtonsView;
