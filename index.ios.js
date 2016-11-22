/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as firebase from 'firebase';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
} from 'react-native';

import SwipingPage from "./components/cards/swipingPage.js";
import ChatPage    from "./components/chat/chatPage.js";
import LoginPage   from "./components/login/loginPage.js";

const firebaseConfig = { //TODO: add real keys @elif, with environment variables?
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  databaseURL: "<your-database-url>",
  storageBucket: "<your-storage-bucket>",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class jumbosmash extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: TemporaryMenu,
          title: 'Temporary Menu',
        }}
        style={{flex:1}}
      />
    );
  }
}

// TEMPORARY, will remove once we get a menu design
class TemporaryMenu extends Component {
  _toSwipingPage = () => {
    this.props.navigator.push({
      component: SwipingPage,
      title: 'Swiping',
    });
  }

  _toChatPage = () => {
    this.props.navigator.push({
      component: ChatPage,
      title: 'Chat',
    });
  }

  _toLoginPage = () => {
    this.props.navigator.push({
      component: LoginPage,
      title: 'Login',
    });
  }

  render() {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text>We'll get rid of this once we get an actual menu design {'\n'}</Text>
        <TouchableHighlight onPress={this._toSwipingPage}>
          <Text>Go to swiping</Text>
        </TouchableHighlight>
        <Text>{'\n'}</Text>
        <TouchableHighlight onPress={this._toChatPage}>
          <Text>Go to chat</Text>
        </TouchableHighlight>
        <Text>{'\n'}</Text>
        <TouchableHighlight onPress={this._toLoginPage}>
          <Text>Go to login</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('jumbosmash', () => jumbosmash);
