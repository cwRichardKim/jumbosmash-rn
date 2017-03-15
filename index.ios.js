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
  View,
} from 'react-native';

import InitialRouter  from "./components/navigation/InitialRouter.js"

export default class jumbosmash extends Component {
  render() {
    return (
      <InitialRouter/>
    );
  }
}

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('jumbosmash', () => jumbosmash);
