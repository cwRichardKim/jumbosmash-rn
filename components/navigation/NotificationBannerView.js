'use strict';

/*
Responsible for the view of the dropdown banner that shows a notification
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

class NotificationBannerView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <TouchableHighlight style={styles.container} onPress={this.props.onPress}>
        <View style={[styles.view]}>
          <Text style={styles.text}>{this.props.message ? this.props.message : "test"}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray"
  },
  text: {
    paddingTop: 25,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  }
});

export default NotificationBannerView;
