'use strict';

/*
page that shows before the app is released
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Alert,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js"
import RectButton             from "../global/RectButton.js";
import AuthErrors             from "../login/AuthErrors.js";

const Analytics = require('react-native-firebase-analytics');
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const PADDING = 20;

class CheaterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    Analytics.logEvent('open_cheater_page', {});
  }

  render() {
    return (
      <View style={styles.textContainer}>
        <Text style={[GlobalStyles.boldText, styles.text, {marginBottom: 10}]}>Sneaky sneaky ;)</Text>
        <Text style={[GlobalStyles.text, styles.text]}>Trying to cheat your way in? 😜 You're seeing this page because we detected that you changed the time on your phone</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    padding: PADDING,
    flex: 1,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  }
});

  export default CheaterPage;
