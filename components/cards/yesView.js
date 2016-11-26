'use strict';

/*
Responsible for the icon that appears when the user swipes right
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class YesView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <View style={[styles.view]}>
        <Text style={styles.text}>{"Yup!"}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    borderColor: 'green',
    borderWidth: 2,
    padding: 20,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: 'green',
    backgroundColor: 'transparent',
  },
});

export default YesView;
