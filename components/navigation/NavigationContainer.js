'use strict';

/*
This is the parent file for the entire application.  It houses the TabBar
Navigation and the Notification (drop down header)
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TabBarIOS,
} from 'react-native';

import SwipingPage          from "../cards/SwipingPage.js";
import ChatPage             from "../chat/ChatPage.js";
import LoginPage            from "../login/LoginPage.js";
import SettingsPage         from "../settings/SettingsPage.js"

class NavigationContainer extends Component {
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
            chatroomId={this.props.chatroomId}
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

});

export default NavigationContainer;
