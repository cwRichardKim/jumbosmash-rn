'use strict';

/*
This is the UI file for the Navigator, Nav Bar, and for passing
relevant props to correct pages
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Navigator,
  TouchableHighlight,
} from 'react-native';

import SwipingPage            from "../cards/SwipingPage.js";
import ChatPage               from "../chat/ChatPage.js";
import ConversationPage       from "../chat/ConversationPage.js"
import AuthContainer          from "../login/AuthContainer.js";
// import SignupPage             from "../login/SignupPage.js";
import SettingsPage           from "../settings/SettingsPage.js"

const TabNames = require("../global/GlobalFunctions").tabNames();

const NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 64; // TODO: check the android tabbar height
const PAGE_HEIGHT = Dimensions.get('window').height - NAVBAR_HEIGHT;

class JumboNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // WAIT. before you add anything here, remember that this is the UI of the
      // navigator, only add things that pertain to UI
      chatNotifCount: 0,
    };
  }

  // Returns the content that the navigator should show.  Since route.name is "TabBar"
  // by default, it will show the TabBar.  In order to "push" a view on top of this view,
  // You have to give it its own route name and use navigator.push({name: route name})
  _renderNavigatorScene (route, navigator) {
    if (route.name == "Account") {
      return (
        <SettingsPage
          {...this.props.myProfile}
          pageHeight={PAGE_HEIGHT}
          navBarHeight={NAVBAR_HEIGHT}
          updateProfile={this.props.updateProfile}
          firebase={this.props.firebase}
          setHasUnsavedSettings={this.props.setHasUnsavedSettings}
        />
      );
    } else if (route.name == "Swiping") {
      return (
        <SwipingPage
          navigator={navigator}
          profiles={this.props.profiles}
          myProfile={this.props.myProfile}
          fetchProfiles={this.props.fetchProfiles}
          navBarHeight={NAVBAR_HEIGHT}
          pageHeight={PAGE_HEIGHT}
          removeSeenCards={this.props.removeSeenCards}
          notifyUserOfMatchWith={this.props.notifyUserOfMatchWith}
        />
      );
    } else if (route.name == "Chat") {
      return (
        <ChatPage
          navigator={navigator}
          myProfile={this.props.myProfile}
          navBarHeight={NAVBAR_HEIGHT}
          pageHeight={PAGE_HEIGHT}
        />
      );
    } else if (route.name == "Auth") {
      return (
        <AuthContainer
          firebase={this.props.firebase}
        />
      );
    } else if (route.name == 'Conversation') {
      return(
        <ConversationPage
          navigator={navigator}
          chatroomId={route.chatroomId}
          participants={route.participants}
          userId={route.userId}
          setCurrentParticipant={this.props.setCurrentParticipant}
          firebase={this.props.firebase}
        />
      );
    }
  }

  // returns UI element of the navigation bar
  _renderNavigationBar() {
    if (this.state.showNavigator || true) {
      return (
        <Navigator.NavigationBar style={styles.navigationBarContainer}
          routeMapper={{
            LeftButton: (route, navigator, index, navState) => {
              return (
                <TouchableHighlight onPress={() => {
                  navigator.replace({name: "Account"});
                }}>
                  <Text>Account</Text>
                </TouchableHighlight>
              );
            },
            RightButton: (route, navigator, index, navState) => {
              return (
                <TouchableHighlight onPress={() => {
                  navigator.replace({name: "Chat"});
                }}>
                  <Text>Chat</Text>
                </TouchableHighlight>
              );
            },
            Title: (route, navigator, index, navState) => {
              return (
                <View>
                  <TouchableHighlight onPress={() => {
                    navigator.replace({name: "Swiping"});
                  }}>
                    <Text>Swipe!</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => {
                    navigator.replace({name: "Auth"});
                  }}>
                    <Text>Login (temp)</Text>
                  </TouchableHighlight>
                </View>
              );
            },
          }}>
        </Navigator.NavigationBar>
      );
    } else {
      return (
        <Navigator.NavigationBar style={styles.navigationBarContainer}
          routeMapper={{
            LeftButton: (route, navigator, index, navState) =>
            {
              return(<TouchableHighlight onPress={() => {navigator.pop();}}>
                <Text>Back</Text>
              </TouchableHighlight>);
            },
            RightButton: (route, navigator, index, navState) =>
             { return null; },
           Title: (route, navigator, index, navState) =>
             { return (
               <View style={styles.navigationBarTitleContainer}>
                 <Image style={styles.avatarPhoto} source={this.state.currentParticipant ? {uri: this.state.currentParticipant.photo} : null}/>
                 <Text style={styles.navigationBarTitleText}>
                   {this.state.currentParticipant ? this.state.currentParticipant.firstName : null}
                 </Text>
               </View>); },}}>
          <View style={styles.navigationBarSeparator}/>
        </Navigator.NavigationBar>
      );
    }
  }

  // Function for generating the tab items.  This includes the icon at the bottom
  // and the content that is displayed
  _renderTabBarItem(unselectedIcon, selectedIcon, tabName, content) {
    return (
      <TabBarIOS.Item
        icon={unselectedIcon}
        selectedIcon={selectedIcon}
        renderAsOriginal
        selected={this.props.selectedTab === tabName}
        onPress={() => {
          this.props.changeTab(tabName);
        }}
      >
        {content}
      </TabBarIOS.Item>
    );
  }

  render() {
    return (
      <Navigator
        ref={(elem)=>{this.navigator = elem}}
        initialRoute={this.props.initialRoute ? this.props.initialRoute : { name: 'Swiping' }}
        renderScene={this._renderNavigatorScene.bind(this)}
        navigationBar={this._renderNavigationBar()}
      />
    );
  }
}

const styles = StyleSheet.create({
  avatarPhoto: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  navigationBarContainer: {
    backgroundColor: 'white',

    // android shadow
    elevation: 3,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 14,
    shadowOpacity: 0.06,
  },
  navigationBarTitleContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationBarTitleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#CAC4C4',
    fontFamily: 'Avenir Next',
  },
  navigationBarSeparator: {
    flex: 1,
    height: 40,
    backgroundColor: '#E1E1E1',
  },
});


export default JumboNavigator;
