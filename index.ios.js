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

import NavigationContainer  from "./components/navigation/NavigationContainer.js"

export default class jumbosmash extends Component {
  render() {
    return (
      <NavigationContainer
        chatroomId={"UNIQUE_CONVERSATION_ID"}
      />
    );
  }
}

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('jumbosmash', () => jumbosmash);
