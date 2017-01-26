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
  TabBarIOS,
} from 'react-native';

import SwipingPage from "./components/cards/SwipingPage.js";
import ChatPage    from "./components/chat/ChatPage.js";
import LoginPage   from "./components/login/LoginPage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqxU8ZGcg7Tx-iJoB_IROCG_yj41kWA6A",
  authDomain: "jumbosmash-ddb99.firebaseapp.com",
  databaseURL: "https://jumbosmash-ddb99.firebaseio.com/",
  storageBucket: "jumbosmash-ddb99.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class jumbosmash extends Component {
  render() {
    return (
      <TabBar/>
    );
  }
}

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'cardsTab',
      chatNotifCount: 0,
    }
  }

  render() {
    return (
      <TabBarIOS
        unselectedTintColor="yellow"
        tintColor="white"
        unselectedItemTintColor="red"
        barTintColor="darkslateblue">
        {/* @jade temporary to access the login page until login code is complete */}
        <TabBarIOS.Item
          title="Login"
          systemIcon="downloads"
          selected={this.state.selectedTab === 'loginTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'loginTab',
            });
          }}>
          <LoginPage/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Cards"
          systemIcon="history"
          selected={this.state.selectedTab === 'cardsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'cardsTab',
            });
          }}>
          <SwipingPage/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Chat"
          systemIcon="contacts"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          badgeColor="black"
          selected={this.state.selectedTab === 'chatTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'chatTab',
            });
          }}>
          <ChatPage
          />
          {/* ^ penis */}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Settings"
          systemIcon="more"
          selected={this.state.selectedTab === 'settingsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'settingsTab',
            });
          }}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>Soon to be Settings</Text></View>
        </TabBarIOS.Item>
      </TabBarIOS>
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
