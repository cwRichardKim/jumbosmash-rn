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
  TouchableOpacity,
  Alert,
  Animated,
  Image,
} from 'react-native';
import ActionSheet        from 'react-native-actionsheet';

import SwipingPage            from "../cards/SwipingPage.js";
import ChatPage               from "../chat/ChatPage.js";
import ConversationPage       from "../chat/ConversationPage.js"
import SettingsPage           from "../settings/SettingsPage.js";
import ProfileCardView        from '../cards/ProfileCardView.js';
import MatchView              from './MatchView.js';
import NotificationBannerView from "./NotificationBannerView.js";
import GlobalStyles           from "../global/GlobalStyles.js";

let Mailer = require('NativeModules').RNMail;

const REPORT_AS = 'Report';
const SHOW_PROFILE_AS = 'Show profile';
const UNMATCH_AS = 'Unsmatch';
const actionSheetButtons = ['Cancel', SHOW_PROFILE_AS, UNMATCH_AS, REPORT_AS];
const CANCEL_INDEX = 0;

const global = require('../global/GlobalFunctions.js');
const pushNotifications = require('../global/PushNotifications.js');
const PageNames = require("../global/GlobalFunctions").pageNames();

const NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54; // TODO: check the android tabbar height
const PAGE_HEIGHT = Dimensions.get('window').height - NAVBAR_HEIGHT;
const PAGE_WIDTH = Dimensions.get('window').width;
const NAVBAR_SELECTOR_WIDTH = PAGE_WIDTH * 0.2;

class JumboNavigator extends Component {
  constructor(props) {
    super(props);

    this.pushNotificationsHandler = require('react-native-push-notification');
    this.currentPage = this.props.initialRoute ? this.props.initialRoute.name : PageNames.cardsPage;

    this.state = {
      // WAIT. before you add anything here, remember that this is the UI of the
      // navigator, only add things that pertain to UI
      chatNotifCount: 0,
      hasUnsavedSettings: false,
      profileToShow: null,
      showMatchView: false,
      matchedProfile: null, // profile of the person you matched with for MatchView
      selectorBarPan: new Animated.ValueXY({x:0, y:0}),
    };
  }

  componentDidMount() {
    // example notification calling function
    // this.notificationBanner.showWithMessage("test", ()=>{
    //   this.changePage(PageNames.chatPage);
    // });
    //
    // setTimeout(() => {
    //   this.notificationBanner.showWithMessage("next message arrived this is a longer message, 2 things and ore things here we go", ()=>{
    //     this.changePage(PageNames.chatPage);
    //   });
    // }, 2000);

    // this._notifyUserOfMatchWith(this.props.myProfile)
    this._configureNotifications();
  }

  _configureNotifications () {
    this.pushNotificationsHandler.configure({

        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function(token) {
            pushNotifications.onRegister(token,
              {authToken: this.props.token,
               profile: this.props.myProfile});
        }.bind(this),

        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
            pushNotifications.onNotification(notification,
              {banner: this.notificationBanner,
               onPress: () => {this.changePage(PageNames.chatPage)},
               firebase: this.props.firebase});
        }.bind(this),

        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
        senderID: "YOUR GCM SENDER ID",

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        requestPermissions: false,
    });
  }

  _animateSelectorBarTo(pageName) {
    let destinationX = 0;
    if (pageName == PageNames.settingsPage) {
      destinationX = - (PAGE_WIDTH - NAVBAR_SELECTOR_WIDTH) / 2;
    } else if (pageName == PageNames.chatPage) {
      destinationX = PAGE_WIDTH / 2 - NAVBAR_SELECTOR_WIDTH / 2;
    }

    Animated.spring (
      this.state.selectorBarPan,
      {
        toValue: {x: destinationX, y: 0},
        speed: 40,
        bounciness: 7,
      }
    ).start();
  }

  // Public function, changes which page is showing (swiping, settings, etc),
  // This is used to replace the current page with another page, not to push a
  // new page on top of the current one.
  changePage(pageName) {
    let currentlyOnSettings = this.currentPage == PageNames.settingsPage;
    let leavingSettings = currentlyOnSettings && pageName != PageNames.settingsPage;
    if (leavingSettings && this.state.hasUnsavedSettings) {
      Alert.alert(
        "Unsaved Changes",
        "Would you like to save or discard the changes you've made?",
        [
          {
            text: "Save", onPress: () => {
              if (this.settingsPage) {
                this.settingsPage.saveButtonPressed();
              }
            }
          }, {
            text: "Discard", onPress: () => {
              if (this.settingsPage && this.settingsPage.oldProfile) {
                this.props.updateMyProfile(this.settingsPage.oldProfile);
              }
              this._animateSelectorBarTo(pageName);
              this.navigator.replace({name: pageName});
            }
          }
        ]
      );
    } else {
      this._animateSelectorBarTo(pageName);
      this.navigator.replace({name: pageName});;
    }
  }

  // Returns the content that the navigator should show.  Since route.name is "TabBar"
  // by default, it will show the TabBar.  In order to "push" a view on top of this view,
  // You have to give it its own route name and use navigator.push({name: route name})
  _renderNavigatorScene (route, navigator) {
    this.currentPage = route.name;
    Analytics.logEvent('open_page', {
      'type': 'app_home_subpage',
      'name': route.name
    });
    if (route.name == PageNames.settingsPage) {
      return (
        <SettingsPage
          myProfile={this.props.myProfile}
          ref={(elem) => {this.settingsPage = elem}}
          pageHeight={PAGE_HEIGHT}
          navBarHeight={NAVBAR_HEIGHT}
          updateProfileToServer={this.props.updateProfileToServer}
          firebase={this.props.firebase}
          setHasUnsavedSettings={(hasUnsavedSettings) => {this.setState({hasUnsavedSettings})}}
          routeNavigator={this.props.routeNavigator}
          showProfileCardForProfile={this._showProfileCardForProfile.bind(this)}
          updateMyProfile={this.props.updateMyProfile}
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
          firebase={this.props.firebase}
          token={this.props.token}
          updateProfileToServer={this.props.updateProfileToServer}
          pushNotificationsHandler={this.pushNotificationsHandler}
          removeSeenCards={this.props.removeSeenCards}
          notifyUserOfMatchWith={this._notifyUserOfMatchWith.bind(this)}
          openProfileCard={()=>{this._showProfileCardForProfile(null)}}
          shouldUseDummyData={this.props.shouldUseDummyData}

        />
      );
    } else if (route.name == PageNames.chatPage) {
      return (
        <ChatPage
          navigator={navigator}
          myProfile={this.props.myProfile}
          navBarHeight={NAVBAR_HEIGHT}
          pageHeight={PAGE_HEIGHT}
          pushNotificationsHandler={this.pushNotificationHandler}
          token={this.props.token}
          shouldUseDummyData={this.props.shouldUseDummyData}
        />
      );
    } else if (route.name == PageNames.conversation) {
      return(
        <ConversationPage
          navigator={navigator}
          chatroomId={route.chatroomId}
          participants={route.participants}
          conversation={route.conversation}
          myProfile={this.props.myProfile}
          firebase={this.props.firebase}
          token={this.props.token}
          pushNotificationsHandler={this.pushNotificationHandler}
          showProfileCardForProfile={this._showProfileCardForProfile.bind(this)}
        />
      );
    }
  }

  _renderNavBarLeftButton(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      return (
        <TouchableOpacity onPress={() => {navigator.pop();}}>
          <Text>Back</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.buttonArea}
          onPress={() => {
            this.changePage(PageNames.settingsPage);
          }}
        >
          <Image
            source={this.currentPage == PageNames.settingsPage ? require("./images/settings-select.png") : require("./images/settings-unselect.png")}
            style={styles.navBarIcon}
          />
        </TouchableOpacity>
      );
    }
  }

  _renderNavBarRightButton(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      return (
        <TouchableOpacity onPress={() => {this.ActionSheet.show()}}>
          <Text>options</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.buttonArea}
          onPress={() => {
            this.changePage(PageNames.chatPage);
          }}
        >
          <Image
            source={this.currentPage == PageNames.chatPage ? require("./images/chat-select.png") : require("./images/chat-unselect.png")}
            style={styles.navBarIcon}
          />
        </TouchableOpacity>
      );
    }
  }

  _renderNavBarCenter(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      let participants = global.otherParticipants(route.participants, this.props.myProfile.id);
      return (
        <View style={styles.navigationBarTitleContainer}>
          <Image style={styles.avatarPhoto} source={participants ? {uri: participants[0].photo} : null}/>
          <Text style={styles.navigationBarTitleText}>
            {participants? participants[0].firstName : null}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonArea}>
          <TouchableOpacity onPress={() => {
            this.changePage(PageNames.cardsPage);
          }}>
            <Image
              source={this.currentPage == PageNames.cardsPage ? require("./images/heart-select.png") : require("./images/heart-unselect.png")}
              style={styles.navBarIcon}
            />
          </TouchableOpacity>
          <Animated.Image
            source={require("./images/selector-bar.png")}
            style={[styles.navBarSelector, {transform: this.state.selectorBarPan.getTranslateTransform()}]}
          />
        </View>
      );
    }
  }

  // returns UI element of the navigation bar
  _renderNavigationBar() {
    return (
      <Navigator.NavigationBar style={[GlobalStyles.weakShadow, styles.navigationBarContainer]}
        routeMapper={{
          LeftButton: this._renderNavBarLeftButton.bind(this),
          RightButton: this._renderNavBarRightButton.bind(this),
          Title: this._renderNavBarCenter.bind(this),
        }}>
      </Navigator.NavigationBar>
    );
  }

  // Action Sheet

  // return UI element for action sheet
  _renderActionSheet() {
    return(
      <ActionSheet
        ref={(ref) => this.ActionSheet = ref}
        options={actionSheetButtons}
        cancelButtonIndex={CANCEL_INDEX}
        tintColor={'#E53B6E'}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    );
  }

  _handleActionSheetPress(index) {
    if (actionSheetButtons[index] == REPORT_AS) {
      this._sendReport();
    } else if (actionSheetButtons[index] == SHOW_PROFILE_AS) {
      //TODO: @jared show profile card
    } else if (actionSheetButtons[index] == UNMATCH_AS) {
      //TODO: @jared unmatch
    }
  }


  _sendReport() {
    if (Mailer && Mailer.mail) {
      Mailer.mail({
        subject: 'Report',
        recipients: ['team@jumbosmash.com'],
        body: '',
      }, (error, event) => {
        if(error) {
          Alert.alert('Error', 'Could not send mail. Try sending an email to team@jumbosmash.com through your mail client');
        }
      });
    } else {
      Alert.alert(
        "Unsupported Device",
        "Sorry, your device doesn't support in-app email :(\nSend your question / feedback to team@jumbosmash.com with your mail client",
        [{text:"OK", onPress:()=>{}}]
      )
    }
  }

  // Profile card UI


  // given a profile, shows the profile over the navigator

  _shouldRenderProfileView() {
    if (this.state.profileToShow !== null) {
      return(
        <View style={[GlobalStyles.absoluteCover, styles.coverView]}>
          <ProfileCardView {...(this.state.profileToShow)}
            pageHeight={PAGE_HEIGHT + NAVBAR_HEIGHT}
            exitFunction={this._closeProfileCard.bind(this)}
          />
        </View>
      );
    }
  }

  // called to show a profile card. if no card is set, it will show
  // the card with the current index
  _showProfileCardForProfile(profile) {
    let profileToShow = profile;
    if (profile === null && this.swipingPage.state.cardIndex < this.props.profiles.length) {
      profileToShow = this.props.profiles[this.swipingPage.state.cardIndex];
    }
    this.setState({
      profileToShow: profileToShow,
    })
  }

  _closeProfileCard() {
    this.setState({
      profileToShow: null,
    })
  }

  // Match View UI

  _shouldRenderMatchView() {
    if (this.state.showMatchView && this.currentPage == PageNames.cardsPage && this.props.profiles.length > 1) {
      return (
        <View style={[GlobalStyles.absoluteCover, styles.coverView]}>
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
        {this._renderActionSheet()}
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
  coverView: {
    zIndex: 100,
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: NAVBAR_SELECTOR_WIDTH,
  },
  navBarIcon: {
    height: 20,
    resizeMode: 'contain',
  },
  navBarSelector: {
    position: 'absolute',
    bottom: 0,
    width: NAVBAR_SELECTOR_WIDTH,
    backgroundColor: 'black',
    height: 2,
    resizeMode: 'contain',
  }
});


export default JumboNavigator;
