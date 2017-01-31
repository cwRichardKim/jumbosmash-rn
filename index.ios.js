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
  NavigatorIOS,
  TouchableHighlight,
  TabBarIOS,
  Dimensions,
} from 'react-native';

import SwipingPage  from "./components/cards/SwipingPage.js";
import ChatPage     from "./components/chat/ChatPage.js";
import LoginPage    from "./components/login/LoginPage.js";
import SettingsPage from "./components/settings/SettingsPage.js"


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
    let tabBarHeight = 49;
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
            chatroomId={"UNIQUE_CONVERSATION_ID"}
          />
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
          <SettingsPage/>
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
