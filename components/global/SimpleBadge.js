'use strict';

/*
shows a red circle with a number on it

properties:
value: number in the circle
style: styling such as color
textStyle: styling for text
*/

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

const globalStyles = require("../global/GlobalStyles.js");

class SimpleBadge extends Component {
  render() {
    if (!this.props.value || this.props.value <= 0) {
      return null;
    } else {
      return (
        <View style={[styles.container, this.props.style]}>
          <Text style={[globalStyles.text, styles.text, this.props.textStyle]}>
            {this.props.value || 0}
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 200,
    backgroundColor: "red",
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  }
})

export default SimpleBadge;
