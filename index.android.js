/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import InitialRouter  from "./components/navigation/InitialRouter.js"
import FirebaseCrash from 'react-native-firebase-crash-report';

export default class jumbosmash extends Component {
  render() {
    FirebaseCrash.log('opened index.android.js');
    return (
      <InitialRouter/>
    );
  }
}

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('jumbosmash', () => jumbosmash);
