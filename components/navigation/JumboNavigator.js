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
  Alert,
} from 'react-native';

import SwipingPage            from "../cards/SwipingPage.js";
import ChatPage               from "../chat/ChatPage.js";
import ConversationPage       from "../chat/ConversationPage.js"
import AuthContainer          from "../login/AuthContainer.js";
// import SignupPage             from "../login/SignupPage.js";
import SettingsPage           from "../settings/SettingsPage.js";
import ProfileCardView        from '../cards/ProfileCardView.js';
import MatchView              from './MatchView.js'
import NotificationBannerView from "./NotificationBannerView.js"

const PageNames = require("../global/GlobalFunctions").pageNames();

const NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 64; // TODO: check the android tabbar height
const PAGE_HEIGHT = Dimensions.get('window').height - NAVBAR_HEIGHT;

class JumboNavigator extends Component {
  constructor(props) {
    super(props);

    this.currentPage = this.props.initialRoute ? this.props.initialRoute.name : PageNames.cardsPage;

    this.state = {
      // WAIT. before you add anything here, remember that this is the UI of the
      // navigator, only add things that pertain to UI
      chatNotifCount: 0,
      hasUnsavedSettings: false,
      showProfile: false,
      showMatchView: false,
      matchedProfile: null, // profile of the person you matched with for MatchView
    };
  }

  componentDidMount() {
    // example notification calling function
    // this.notificationBanner.showWithMessage("test", ()=>{
    //   this.changePage(PageNames.chatPage);
    // });
    //
    // setTimeout(() => {
    //   this.notificationBanner.showWithMessage("next message arrived", ()=>{
    //     this.changePage(PageNames.chatPage);
    //   });
    // }, 2000);

    this._notifyUserOfMatchWith(this.props.myProfile)
  }

  // Public function, changes which page is showing (swiping, settings, etc),
  // This is used to replace the current page with another page, not to push a
  // new page on top of the current one.
  changePage(pageName) {
    let currentlyOnSettings = this.currentPage == PageNames.settingsPage;
    let leavingSettings = currentlyOnSettings && pageName != PageNames.settingsPage;
    if (leavingSettings && this.state.hasUnsavedSettings) {
      Alert.alert(
        "Leaving unsaved changes",
        "Save your changes with the circular 'save' button at the bottom-right!",
        [{text: "OK", onPress:( ) => {
          this.navigator.replace({name: pageName});
        }}]
      );
    } else {
      this.navigator.replace({name: pageName});;
    }
  }

  // Returns the content that the navigator should show.  Since route.name is "TabBar"
  // by default, it will show the TabBar.  In order to "push" a view on top of this view,
  // You have to give it its own route name and use navigator.push({name: route name})
  _renderNavigatorScene (route, navigator) {
    this.currentPage = route.name;
    if (route.name == PageNames.settingsPage) {
      return (
        <SettingsPage
          {...this.props.myProfile}
          pageHeight={PAGE_HEIGHT}
          navBarHeight={NAVBAR_HEIGHT}
          updateProfile={this.props.updateProfile}
          firebase={this.props.firebase}
          setHasUnsavedSettings={(hasUnsavedSettings) => {this.setState({hasUnsavedSettings})}}
        />
      );
    } else if (route.name == PageNames.cardsPage) {
      return (
        <SwipingPage
          ref={(elem) => {this.swipingPage = elem}}
          navigator={navigator}
          profiles={this.props.profiles}
          myProfile={this.props.myProfile}
          fetchProfiles={this.props.fetchProfiles}
          navBarHeight={NAVBAR_HEIGHT}
          pageHeight={PAGE_HEIGHT}
          removeSeenCards={this.props.removeSeenCards}
          notifyUserOfMatchWith={this._notifyUserOfMatchWith.bind(this)}
          openProfileCard={this._openProfileCard.bind(this)}
        />
      );
    } else if (route.name == PageNames.chatPage) {
      return (
        <ChatPage
          navigator={navigator}
          myProfile={this.props.myProfile}
          navBarHeight={NAVBAR_HEIGHT}
          pageHeight={PAGE_HEIGHT}
        />
      );
    } else if (route.name == PageNames.loginPage) {
      return (
        <AuthContainer
          firebase={this.props.firebase}
        />
      );
    } else if (route.name == PageNames.conversation) {
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

  _renderNavBarLeftButton(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      return (
        <TouchableHighlight onPress={() => {navigator.pop();}}>
          <Text>Back</Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight onPress={() => {
          this.changePage(PageNames.settingsPage);
        }}>
          <Text>Account</Text>
        </TouchableHighlight>
      );
    }
  }

  _renderNavBarRightButton(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      return null;
    } else {
      return (
        <TouchableHighlight onPress={() => {
          this.changePage(PageNames.chatPage);
        }}>
          <Text>Chat</Text>
        </TouchableHighlight>
      );
    }
  }

  _renderNavBarCenter(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      return (
        <View style={styles.navigationBarTitleContainer}>
          <Image style={styles.avatarPhoto} source={this.state.currentParticipant ? {uri: this.state.currentParticipant.photo} : null}/>
          <Text style={styles.navigationBarTitleText}>
            {this.state.currentParticipant ? this.state.currentParticipant.firstName : null}
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableHighlight onPress={() => {
            this.changePage(PageNames.cardsPage);
          }}>
            <Text>Swipe!</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            this.changePage(PageNames.loginPage);
          }}>
            <Text>Login (temp)</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  // returns UI element of the navigation bar
  _renderNavigationBar() {
    return (
      <Navigator.NavigationBar style={styles.navigationBarContainer}
        routeMapper={{
          LeftButton: this._renderNavBarLeftButton.bind(this),
          RightButton: this._renderNavBarRightButton.bind(this),
          Title: this._renderNavBarCenter.bind(this),
        }}>
      </Navigator.NavigationBar>
    );
  }

  // Profile card UI

  _shouldRenderProfileView() {
    if (this.state.showProfile && this.swipingPage.state.cardIndex < this.props.profiles.length) {
      return(
        <View style={styles.coverView}>
          <ProfileCardView {...this.props.profiles[this.swipingPage.state.cardIndex]}
            pageHeight={PAGE_HEIGHT + NAVBAR_HEIGHT}
            exitFunction={this._closeProfileCard.bind(this)}
          />
        </View>
      );
    }
  }

  _openProfileCard() {
    this.setState({
      showProfile: true,
    })
  }

  _closeProfileCard() {
    this.setState({
      showProfile: false,
    })
  }

  // Match View UI

  _shouldRenderMatchView() {
    if (this.state.showMatchView && this.currentPage == PageNames.cardsPage && this.props.profiles.length > 1) {
      return (
        <View style={styles.coverView}>
          <MatchView
            myProfile={this.props.myProfile}
            matchProfile={this.state.matchProfile}
            onClose={() => this.setState({showMatchView: false})}
            onSuccess={() => this.changePage(PageNames.chatPage)}
          />
        </View>
      );
    }
  }

  // shows the correct notification for matching
  // if on the swiping page, then shows full match view, else shows a banner notif
  _notifyUserOfMatchWith(profile) {
    if (profile != null && this.currentPage == PageNames.cardsPage) {
      this.setState({
        matchProfile: profile,
        showMatchView: true,
      });
    } else if (profile != null) {
      this.setState({
        matchProfile: profile,
      });
      this.notificationBanner.showWithMessage("New Match! Say Hello to " + profile.firstName, ()=>{
        this.changePage(PageNames.chatPage);
      });
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Navigator
          ref={(elem)=>{this.navigator = elem}}
          initialRoute={this.props.initialRoute ? this.props.initialRoute : { name: PageNames.cardsPage }}
          renderScene={this._renderNavigatorScene.bind(this)}
          navigationBar={this._renderNavigationBar()}
        />
        {this._shouldRenderProfileView()}
        {this._shouldRenderMatchView()}
        <NotificationBannerView ref={(elem) => {this.notificationBanner = elem}}/>
      </View>
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
  coverView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});


export default JumboNavigator;
