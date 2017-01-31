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
  Animated,
  TouchableHighlight,
} from 'react-native';

import SwipingPage            from "../cards/SwipingPage.js";
import ChatPage               from "../chat/ChatPage.js";
import LoginPage              from "../login/LoginPage.js";
import SettingsPage           from "../settings/SettingsPage.js"
import NotificationBannerView from "./NotificationBannerView.js"

class NavigationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'cardsTab',
      chatNotifCount: 0,
      notificationBannerText: "notification banner (tap me)",
      pan: new Animated.ValueXY({x:0, y:-100}),
    };
  }

  _hideNotificationBanner() {
    Animated.spring(
      this.state.pan,
      {
        toValue: {x:0, y:-100},
      }
    ).start();
  }

  _showNotificationBanner() {
    Animated.spring(
      this.state.pan,
      {
        toValue: {x:0, y:-25},
      }
    ).start();
  }

  _notificationBannerTapped() {
    this._hideNotificationBanner();
  }

  componentDidMount() {
    this._showNotificationBanner();
  }

  render() {
    let tabBarHeight = 49;
    return (
      <View style={{flex:1}}>
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
        <Animated.View
          style={[styles.notificationBanner, {transform:this.state.pan.getTranslateTransform()}]}>
          <NotificationBannerView
            message={this.state.notificationBannerText}
            onPress={this._notificationBannerTapped.bind(this)}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notificationBanner: {
    position: 'absolute',
    height: 100,
    top: 0,
    left: 0,
    right: 0,
  },
});

export default NavigationContainer;
