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
  BackAndroid,
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
import TagPage                from "../settings/TagPage.js";

let Mailer = require('NativeModules').RNMail;

const REPORT_AS = 'Report';
const SHOW_PROFILE_AS = 'Show profile';
const UNMATCH_AS = 'Unsmatch';
const actionSheetButtons = ['Cancel', SHOW_PROFILE_AS, UNMATCH_AS, REPORT_AS];
const CANCEL_INDEX = 0;

const Analytics = require('react-native-firebase-analytics');
const global = require('../global/GlobalFunctions.js');
const PushNotifications = require('../global/PushNotifications.js');
const PageNames = require("../global/GlobalFunctions").pageNames();

const IS_ANDROID = Platform.OS === 'android'
const NAVBAR_HEIGHT = (IS_ANDROID) ? 54 : 64; // TODO: check the android tabbar height
const PAGE_HEIGHT = Dimensions.get('window').height - NAVBAR_HEIGHT;
const PAGE_WIDTH = Dimensions.get('window').width;
const NAVBAR_SELECTOR_WIDTH = PAGE_WIDTH * 0.2;
const NAVBAR_SELECTOR_HEIGHT = 2;
const HEADER_TITLE_LEFT_MARGIN = (Platform.OS === 'ios') ? 0 : (Navigator.NavigationBar.Styles.Stages.Left.Title.marginLeft || 0);
const SAVE_BUTTON_STATE = global.saveButtonStates();
const NAVIGATOR_BACKHANDLER = "NAVIGATOR_BACKHANDLER"

class JumboNavigator extends Component {
  constructor(props) {
    super(props);

    this.pushNotificationsHandler = require('react-native-push-notification');
    this.currentPage = this.props.initialRoute ? this.props.initialRoute.name : PageNames.cardsPage;

    this.conversationParticipantBasic = null; // what is used in chat schema
    this.conversationParticipant = null;
    this.conversationId = null;

    this.state = {
      // WAIT. before you add anything here, remember that this is the UI of the
      // navigator, only add things that pertain to UI
      chatNotifCount: 0,
      hasUnsavedSettings: false,
      profileToShow: null,
      showMatchView: false,
      matchProfile: null, // profile of the person you matched with for MatchView
      selectorBarPan: new Animated.ValueXY({x:0, y:0}),
      isSharedTags: false,
      profileIndex: -1,
    };
  }

  componentDidMount() {
    // example notification calling function
    // this.notificationBanner.showWithMessage("dev", ()=>{
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
    this._configureBackAndroid();
  }

  _configureBackAndroid () {
    if (IS_ANDROID) {
      BackAndroid.addEventListener(NAVIGATOR_BACKHANDLER, function() {
        if (this) {
          if (this.state.showMatchView) {
            this._closeMatchView();
          } else if (this.state.profileToShow !== null) {
            this._closeProfileCard();
          } else if (this.currentPage === PageNames.conversation || this.currentPage === PageNames.tagPage) {
            this.navigator.pop();
          } else if (this.currentPage === PageNames.cardsPage) {
            return false;
          } else {
            this.changePage(PageNames.cardsPage);
          }

          return true;
        }
        return false;
      }.bind(this));
    }
  }

  _configureNotifications () {
    this.pushNotificationsHandler.configure({

        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function(token) {
            PushNotifications.onRegister(token,
              {authToken: this.props.token.val,
               profile: this.props.myProfile});
        }.bind(this),

        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
            let message = "";
            if (Platform.OS === 'android') {
              message = notification.message;
            } else {
              message = notification.message.body;
            }
            PushNotifications.onNotification(message,
              {banner: this.notificationBanner,
               onPress: () => {this.changePage(PageNames.chatPage)},
               firebase: this.props.firebase,
               chatPage: this.chatPage,});
        }.bind(this),

        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is needed to receive remote push notifications)
        senderID: "559975994653",

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
    if (route.name == PageNames.settingsPage) {
      return (
        <SettingsPage
          navigator={navigator}
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
          hasLogout={true}
          hasStaticSaveButton={false}
        />
      );
    } else if (route.name == PageNames.tagPage) {
      return (
        <TagPage
          ref={(elem)=>{this.tagPage=elem}}
          myProfile={this.props.myProfile}
          token={this.props.token}
        />
      )
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
          openProfileCard={this._showProfileCardForProfile.bind(this)}
          shouldUseDummyData={this.props.shouldUseDummyData}
          noMoreCards={this.props.noMoreCards}
          removeDuplicateProfiles={this.props.removeDuplicateProfiles}
          addRecentLikes={this.props.addRecentLikes}
        />
      );
    } else if (route.name == PageNames.chatPage) {
      return (
        <ChatPage
          ref={(elem) => {this.chatPage = elem}}
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
          ref={(elem) => {this.conversationPage = elem}}
          navigator={navigator}
          chatroomId={route.chatroomId}
          participants={route.participants}
          conversation={route.conversation}
          myProfile={this.props.myProfile}
          firebase={this.props.firebase}
          token={this.props.token}
          pushNotificationsHandler={this.pushNotificationHandler}
        />
      );
    }
  }

  _renderNavBarLeftButton(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      return (
        <TouchableOpacity style={styles.buttonArea} onPress={() => {
          if (this.chatPage) {
            this.chatPage.refresh();
          }
          navigator.pop();
        }}>
          <View style={styles.convoNavBarContainer}>
            <Image
              source={require("./images/back-icon.png")}
              style={styles.convoNavBarIcon}
            />
          </View>
        </TouchableOpacity>
      );
    } else if (route.name === PageNames.tagPage) {
      return (
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 80}}
          onPress={this._tagCancelOnPress.bind(this)}
        >
          <Text style={{color: global.style().color,}}>Cancel</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={[styles.buttonArea]}
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
      let other = global.otherParticipants(route.participants, this.props.myProfile.id);
      let len = other ? other.length : 0;
      this.conversationParticipantBasic = len > 0 ? other[0] : null;
      this.conversationId = route.chatroomId;
      return (
        <TouchableOpacity style={styles.buttonArea} onPress={() => {this.ActionSheet.show()}}>
          <View style={styles.convoNavBarContainer}>
            <Image
              source={require("./images/options-icon.png")}
              style={styles.convoNavBarIcon}
            />
          </View>
        </TouchableOpacity>
      );
    } else if (route.name === PageNames.tagPage) {
      return (
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 80}}
          onPress={this._tagDoneOnPress.bind(this)}
        >
          <Text style={{fontWeight: '600', color: global.style().color,}}>Done</Text>
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

  _renderSelectorBar() {
    if (IS_ANDROID) {
      return null;
    } else {
      return (
        <Animated.Image
          source={require("./images/selector-bar.png")}
          style={[styles.navBarSelector, {transform: this.state.selectorBarPan.getTranslateTransform()}]}
        />
      );
    }
  }

  _renderNavBarCenter(route, navigator, index, navState) {
    if (route.name == PageNames.conversation) {
      let participants = global.otherParticipants(route.participants, this.props.myProfile.id);
      return (
        <View style={IS_ANDROID ? [styles.androidCenterButton, {paddingTop: 7}] : null}>
          <TouchableOpacity
            onPress={() => {this._showConversationProfile()}}>
            <View style={styles.navigationBarTitleContainer}>
              <Image style={styles.avatarPhoto} source={participants ? {uri: participants[0].photo} : null}/>
              <Text style={styles.navigationBarTitleText}>
                {participants? participants[0].firstName : null}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (route.name === PageNames.tagPage) {
      return (null);
    } else {
      return (
        <View style={[styles.buttonArea, IS_ANDROID ? styles.androidCenterButton : null]}>
          <TouchableOpacity onPress={() => {
            this.changePage(PageNames.cardsPage);
          }}>
            <Image
              source={this.currentPage == PageNames.cardsPage ? require("./images/heart-select.png") : require("./images/heart-unselect.png")}
              style={styles.navBarIcon}
            />
          </TouchableOpacity>
          {this._renderSelectorBar()}
        </View>
      );
    }
  }

  // returns UI element of the navigation bar
  _renderNavigationBar() {
    return (
      <Navigator.NavigationBar style={[GlobalStyles.weakShadow, styles.navigationBarContainer]}
        routeMapper={{
          Title: this._renderNavBarCenter.bind(this),
          LeftButton: this._renderNavBarLeftButton.bind(this),
          RightButton: this._renderNavBarRightButton.bind(this),
        }}>
      </Navigator.NavigationBar>
    );
  }

  // Tag stuff

  _tagCancelOnPress() {
    this.navigator.pop();
  }

  _tagDoneOnPress() {
    if (this.props.updateMyProfile) {
      let newTags = this.tagPage.extractTags();
      this.props.updateMyProfile({tags: newTags})
    }
    this.navigator.pop();
    this.setState({hasUnsavedSettings: true});
    this.settingsPage.setState({
      saveButtonState: SAVE_BUTTON_STATE.show,
    })
  }

  // Action Sheet

  // return UI element for action sheet
  _renderActionSheet() {
    return(
      <ActionSheet
        ref={(ref) => this.ActionSheet = ref}
        options={actionSheetButtons}
        cancelButtonIndex={CANCEL_INDEX}
        tintColor={global.style().color}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    );
  }

  async _handleActionSheetPress(index) {
    if (actionSheetButtons[index] == REPORT_AS) {
      this._sendReport();
      return;
    }

    if (actionSheetButtons[index] == SHOW_PROFILE_AS) {
      this._showConversationProfile();
    } else if (actionSheetButtons[index] == UNMATCH_AS) {
      await this.unmatchProfile(this.conversationParticipantBasic.profileId);
      await this.conversationPage ? this.conversationPage.onUnmatch() : () => {}; // remove from firebase
      this.navigator.pop();
    }
  }


  _sendReport() {
    if (Mailer && Mailer.mail) {
      let firstName = this.conversationParticipantBasic ? this.conversationParticipantBasic.firstName : "";
      let profileId = this.conversationParticipantBasic ? "["+this.conversationParticipantBasic.profileId+"]" : "";
      Mailer.mail({
        subject: 'Report',
        recipients: ['team@jumbosmash.com'],
        body: "Report: "+firstName+" "+profileId,
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

  async _showConversationProfile() {
    if (this.conversationParticipant == null) {
      this.conversationParticipant = await this.fetchProfile(this.conversationParticipantBasic.profileId);
    } else if (this.conversationParticipantBasic.profileId != this.conversationParticipant.id) {
      this.conversationParticipant = await this.fetchProfile(this.conversationParticipantBasic.profileId);
    }
    this._showProfileCardForProfile(this.conversationParticipant, true);
  }

  fetchProfile(profileId) {
    let myId = (this.props.myProfile && this.props.myProfile.id) ? this.props.myProfile.id : "";
    let url = "https://jumbosmash2017.herokuapp.com/profile/common/".concat(myId).concat("/").concat(profileId).concat("/").concat(this.props.token.val);
    return fetch(url)
      .then((response) => {
        if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
          return response.json();
        } else {
          throw ("status" in response) ? response["status"] : "Unknown Error";
        }
      })
      .then((profile) => {
        return profile;
      })
      .catch((error) => {
        console.error("ERROR " + error);
      });
  }

  unmatchProfile(profileId) {
    let url = "https://jumbosmash2017.herokuapp.com/chat/unmatch/".concat(this.conversationId).concat("/").concat(this.props.myProfile.id).concat("/").concat(this.conversationParticipantBasic.profileId).concat("/").concat(this.props.token.val);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: "",
    }).then((response) => {
      if (this.chatPage) {
        this.chatPage.refresh();
      }
    }).catch((error) => {
      let errorString = "Sorry, we could not unmatch you and " + this.conversationParticipantBasic.firstName + " please try again later";
      Alert.alert('Error', errorString);
      console.log(error);
      //DO NOTHING (user doesn't really need to know this didn't work)
    });
  }

  // Profile card UI

  // given a profile, shows the profile over the navigator
  _shouldRenderProfileView() {
    if (this.state.profileToShow !== null) {
      let marginTopAndroid = IS_ANDROID ? NAVBAR_HEIGHT : 0
      let profileStyles = IS_ANDROID ? GlobalStyles.absoluteCover : [GlobalStyles.absoluteCover, styles.coverView]
      return(
        <View style={profileStyles}>
          <ProfileCardView {...(this.state.profileToShow)}
            pageHeight={PAGE_HEIGHT + NAVBAR_HEIGHT}
            exitFunction={this._closeProfileCard.bind(this)}
            isSharedTags={this.state.isSharedTags}
            style={{marginTop: marginTopAndroid}}
            blockUserWithIndex={this.props.blockUserWithIndex}
            index={this.state.profileIndex}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  // called to show a profile card. if no card is set, it will show
  // the card with the current index
  _showProfileCardForProfile(profile, isSharedTags, profileIndex) {
    let profileToShow = profile;
    if (profile === null && this.swipingPage.state.cardIndex < this.props.profiles.length) {
      profileToShow = this.props.profiles[this.swipingPage.state.cardIndex];
    }
    this.setState({
      profileToShow: profileToShow,
      isSharedTags: isSharedTags,
      profileIndex: profileIndex,
    })
  }

  _closeProfileCard() {
    this.setState({
      profileToShow: null,
      isSharedTags: false,
      profileIndex: -1,
    })
  }

  // Match View UI

  _closeMatchView() {
    this.setState({showMatchView: false})
  }

  _shouldRenderMatchView() {
    if (this.state.showMatchView && this.currentPage == PageNames.cardsPage && this.props.profiles.length > 1) {
      let matchStyles = IS_ANDROID ? GlobalStyles.absoluteCover : [GlobalStyles.absoluteCover, styles.coverView]
      return (
        <View style={matchStyles}>
          <MatchView
            myProfile={this.props.myProfile}
            matchProfile={this.state.matchProfile}
            onClose={this._closeMatchView.bind(this)}
            onSuccess={() => this.changePage(PageNames.chatPage)}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  // shows the correct notification for matching
  // if on the swiping page, then shows full match view, else shows a banner notif
  _notifyUserOfMatchWith(profile) {
    let notificationType = "";
    if (profile != null && this.currentPage == PageNames.cardsPage) {
      this.setState({
        matchProfile: profile,
        showMatchView: true,
      });
      notificationType = "match-page";
    } else if (profile != null) {
      this.setState({
        matchProfile: profile,
      });
      this.notificationBanner.showWithMessage("New Match! Say Hello to " + profile.firstName, ()=>{
        this.changePage(PageNames.chatPage);
      });
      notificationType = "banner"
    }
    Analytics.logEvent('show_match', {
      'type': notificationType
    });
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
    height: 38,
    width: 38,
    borderRadius: 19,
  },
  navigationBarContainer: {
    backgroundColor: 'white',
  },
  navigationBarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationBarTitleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#474747',
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
  androidCenterButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: HEADER_TITLE_LEFT_MARGIN,
  },
  navBarIcon: {
    height: 20,
    resizeMode: 'contain',
  },
  convoNavBarContainer: {
    alignItems: 'center',
    padding: 13,
  },
  convoNavBarIcon: {
    height: 18,
    width: 25,
    resizeMode: 'contain',
  },
  navBarSelector: {
    position: 'absolute',
    bottom: 0,
    width: NAVBAR_SELECTOR_WIDTH,
    backgroundColor: 'black',
    height: NAVBAR_SELECTOR_HEIGHT,
    resizeMode: 'cover',
  }
});


export default JumboNavigator;
