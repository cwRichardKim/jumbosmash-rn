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
} from 'react-native';

class SwipeButtonsView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1}}>
          <TouchableHighlight
            style={styles.leftButtonTouchArea}
            onPress={this.props.leftButtonFunction}
          >
            <View style={styles.button}>
            </View>
          </TouchableHighlight>
        </View>

        <View style={{flex:1}}>
          <TouchableHighlight
            style={styles.rightButtonTouchArea}
            onPress={this.props.rightButtonFunction}
          >
            <View style={styles.button}>
            </View>
          </TouchableHighlight>
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
  leftButtonTouchArea: {
    margin: 10,
    flex: 1,
    backgroundColor: "#F2585A",
    borderRadius: 100,
  },
  rightButtonTouchArea: {
    margin: 10,
    flex: 1,
    backgroundColor: "#8AC3EF",
    borderRadius: 100,
  },
  button: {
    flex: 1,
  }
});

export default SwipeButtonsView;
