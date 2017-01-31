'use strict';

/*
Responsible for the view of the dropdown banner that shows a notification
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class NotificationBannerView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <View style={[styles.view]}>
        <Text style={styles.text}>{"Nope!"}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    borderColor: 'red',
    borderWidth: 2,
    padding: 20,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: 'red',
    backgroundColor: 'transparent',
  }
});

export default NotificationBannerView;
