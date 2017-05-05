'use strict';

/*
This file is the main settings page. It is responsible for providing the relevant
data to the subcomponents
*/

import React, {Component} from 'react';
import {
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  AsyncStorage,
  Keyboard,
  Linking,
} from 'react-native';

import ActionSheet        from 'react-native-actionsheet';
import ProfilePhotoPicker from "./ProfilePhotoPicker.js";
import SaveButton         from "./SaveButton.js";
import RectButton         from "../global/RectButton.js";
import GlobalStyles       from "../global/GlobalStyles.js";
import AuthErrors         from "../login/AuthErrors.js"

const Analytics = require('react-native-firebase-analytics');
const GlobalFunctions = require('../global/GlobalFunctions.js');
const StorageKeys = GlobalFunctions.storageKeys();
const PageNames = GlobalFunctions.pageNames();
const ACTION_SHEET_BUTTONS = ['Cancel', "Feedback", "Report Bug", "Block / Avoid User (no questions asked)", "Terms of Service / Privacy Policy", "Other"];
const SaveButtonState = GlobalFunctions.saveButtonStates();
let Mailer = require('NativeModules').RNMail;

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.keyboardHeight = 0;
    this.oldProfile = props.myProfile;

    this.state = {
      saveButtonState: SaveButtonState.hide,
    }
  }

  componentWillMount () {
    this.keyboardFrameWillChangeListener = Keyboard.addListener('keyboardWillChangeFrame', this._keyboardWillChangeFrame.bind(this));
  }

  componentDidMount () {
    Analytics.logEvent('open_settings_page', {});
  }

  componentWillUnmount () {
    this.keyboardFrameWillChangeListener.remove();
  }

 _keyboardWillChangeFrame (keyboard) {
   let keyboardAppeared = keyboard.startCoordinates.screenY > keyboard.endCoordinates.screenY;
   this.keyboardHeight = keyboardAppeared ? keyboard.endCoordinates.height : 0;
   if (this.refs.saveButton) {
     this.refs.saveButton.keyboardHeightWillChange(this.keyboardHeight);
   }
}

  _allPhotosAreNull(photos) {
    for (var i in photos) {
      if (photos[i] != null && photos[i].large != null && photos[i].small != null && photos[i].large.length > 0) {
        return false;
      }
    }
    return true;
  }

  // returns true if all checks are met, returns false and calls proper
  // errors if not
  _checkPropertiesAreValid () {
    if (this._allPhotosAreNull(this.props.myProfile.photos)) {
      Alert.alert(
        "Must have at least 1 photo!",
        "Please add at least 1 photo before saving",
        [{text: 'OK', onPress: () => {}},],
      );
    } else if (this.props.myProfile.firstName.length < 1) {
      Alert.alert(
        "Must include your name!",
        "",
        [{text: 'OK', onPress: () => {}},],
      );
    } else {
      return true;
    }
    return false;
  }

  async _asyncUpdatePropertiesRequest () {
    if (this.props.updateProfileToServer) {
      if (this._checkPropertiesAreValid()) {
        this.setState({
          saveButtonState: SaveButtonState.saving,
        });
        this.props.updateProfileToServer()
          .then((newProfileResponse) => { // success
            if (this.refs.saveButton) {
              this.refs.saveButton.animateOut(() => {
                this._changesSuccessfullyUpdated();
              });
            }
        }).catch((error) => {
          Alert.alert(
            "Update Error",
            "Something went wrong :( It's probably a connection error, but contact team@jumbosmash.com if this keeps happening",
            [{text: 'OK', onPress: () => {}},],
          );
          throw error;
        });
      }
    } else {
      Alert.alert(
        "Update Error",
        "Something went wrong :( Contact team@jumbosmash.com and let us know that we couldn't update your profile",
        [{text: 'OK', onPress: () => {}},],
      );
    }
  }

  // This function updates the current information to the server
  // public: can be called by JumboNavigator
  saveButtonPressed() {
    Analytics.logEvent('save_settings_button', {});
    this._asyncUpdatePropertiesRequest();
  }

  // Scroll a component into view. Just pass the component ref string.
  _inputFocused (refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(this.refs[refName]),
        90, //additionalOffset
        true
      );
    }, 50);
  }

  _focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  // allows ProfilePhotoPicker to adjust the photos
  _updatePhotos(photos) {
    if (photos && photos.length >= 3) {
      this._changeWasMade({"photos":photos});
    } else {
      Alert.alert(
        "Photo Error",
        "Something went wrong :( Contact team@jumbosmash.com and let us know that the incorrect number of photos were updated",
        [{text: 'OK', onPress: () => {}},],
      );
    }
  }

  _changeWasMade(changes) {
    this.setState({saveButtonState:SaveButtonState.show});
    if (this.props.setHasUnsavedSettings) {
      this.props.setHasUnsavedSettings(true);
    }
    if (changes) {
      this.props.updateMyProfile(changes);
    }
  }

  _changesSuccessfullyUpdated() {
    this.setState({saveButtonState: SaveButtonState.hide});
    if (this.props.setHasUnsavedSettings) {
      this.props.setHasUnsavedSettings(false);
    }
  }

  _handleActionSheetPress(index) {
    if (index === 1) {
      this._sendMail("Feedback");
    } else if (index === 2) {
      this._sendMail("Bug Report");
    } else if (index === 3) {
      this._sendMail("Block Request: ", "Please have the following people removed from my list: [first / last name]");
    } else if (index === 4) {
      GlobalFunctions.openTOS();
    } else if (index === 5) {
      this._sendMail("Feedback: Other");
    }
  }

  _renderActionSheet() {
    return (
      <ActionSheet
        ref={(ref) => this.ActionSheet = ref}
        options={ACTION_SHEET_BUTTONS}
        cancelButtonIndex={0}
        tintColor={GlobalFunctions.style().color}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    )
  }

  _sendMail(title, message) {
    Analytics.logEvent('feedback_button', {
      'option': title
    });
    if (Mailer && Mailer.mail) {
      Mailer.mail({
        subject: title,
        recipients: ['team@jumbosmash.com'],
        body: "["+(this.props.myProfile.email || "tufts email: ")+"]\n\n"+(message||""),
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

  _logout() {
    Analytics.logEvent('logout_button', {});
    this.props.firebase.auth().signOut()
      .then(() => {
        for (var key in StorageKeys) {
          try {
            AsyncStorage.removeItem(StorageKeys[key]);
          } catch (error) {
            throw "Error: Remove from storage: " + error;
          }
        }
        this.props.routeNavigator.replace({name: PageNames.auth});
      })
      .catch((error) => {
        AuthErrors.handleLogoutError(error);
        throw error;
      }
    );
  }

  _viewProfile() {
    Analytics.logEvent('view_profile_button', {});
    this.props.showProfileCardForProfile(this.props.myProfile);
  }

  _showTagPage() {
    this.props.navigator.push({name: PageNames.tagPage})
  }

  _shouldRenderShowProfileButton() {
    if (this.props.showProfileCardForProfile) {
      return (
        <RectButton
          style={[styles.rectButton]}
          textStyle={styles.buttonText}
          onPress={this._viewProfile.bind(this)}
          text="View Profile"
        />
      );
    } else {
      return null;
    }
  }

  _shouldRenderLogoutButton() {
    if (this.props.hasLogout === true) {
      return (
        <RectButton
          style={[styles.rectButton]}
          textStyle={styles.buttonText}
          onPress={this._logout.bind(this)}
          text="Logout"
        />
      );
    } else {
      return null;
    }
  }

  _shouldRenderStaticSaveButton() {
    if (this.props.hasStaticSaveButton === true) {
      return (
        <RectButton
          style={[styles.rectButton]}
          textStyle={styles.buttonText}
          onPress={this.saveButtonPressed.bind(this)}
          text="Save"
        />
      );
    } else {
      return null;
    }
  }

  _shouldRenderDynamicSaveButton() {
    if (this.props.hasStaticSaveButton !== true) {
      return (
        <SaveButton
          ref="saveButton"
          onPress={this.saveButtonPressed.bind(this)}
          saveButtonState={this.state.saveButtonState}
          keyboardHeight={this.keyboardHeight}
        />
      );
    } else {
      return null;
    }
  }

  _shouldRenderCloseButton() {
    if (this.props.closeOnPress) {
      return (
        <RectButton
          style={[styles.rectButton]}
          textStyle={styles.buttonText}
          onPress={this.props.closeOnPress}
          text="Close"
        />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={[styles.container, {marginTop: this.props.navBarHeight, height: this.props.pageHeight}]}>
        <ScrollView ref='scrollView'>
          <ProfilePhotoPicker
            photos={this.props.myProfile.photos}
            updatePhotos={this._updatePhotos.bind(this)}
            firebase={this.props.firebase}
          />
          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Preferred First Name</Text>

          <View style={styles.line}/>
          <TextInput style={[GlobalStyles.text, styles.textListItem, styles.textInput]}
            underlineColorAndroid="transparent"
            onChangeText={(firstName) => {this._changeWasMade({"firstName":firstName})}}
            value={this.props.myProfile.firstName}
            maxLength={80}
            ref='firstName'
            onFocus={this._inputFocused.bind(this, 'firstName')}
            onSubmitEditing={() => this._focusNextField('lastName')}
            returnKeyType="next"
          />
          <View style={styles.line}/>

          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Last Name</Text>

          <View style={styles.line}/>
          <TextInput style={[GlobalStyles.text, styles.textListItem, styles.textInput]}
            underlineColorAndroid="transparent"
            onChangeText={(lastName) => {this._changeWasMade({"lastName":lastName})}}
            value={this.props.myProfile.lastName}
            maxLength={80}
            ref='lastName'
            onFocus={this._inputFocused.bind(this, 'lastName')}
            onSubmitEditing={() => this._focusNextField('description')}
            returnKeyType="next"
          />
          <View style={styles.line}/>

          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Bio</Text>

          <View style={styles.line}/>
          <TextInput style={[GlobalStyles.text, styles.textListItem, styles.textInput, {height: 100, paddingTop: 5, paddingBottom: 5}]}
            underlineColorAndroid="transparent"
            onChangeText={(description) => {this._changeWasMade({"description":description})}}
            value={this.props.myProfile.description}
            multiline={true}
            maxLength={500}
            ref='description'
            onFocus={this._inputFocused.bind(this, 'description')}
          />
          <View style={styles.line}/>

          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Major</Text>

          <View style={styles.line}/>
          <TextInput style={[GlobalStyles.text, styles.textListItem, styles.textInput]}
            underlineColorAndroid="transparent"
            onChangeText={(major) => {this._changeWasMade({"major":major})}}
            value={this.props.myProfile.major}
            maxLength={100}
            ref='major'
            onFocus={this._inputFocused.bind(this, 'major')}
            returnKeyType="done"
          />
          <View style={styles.line}/>
          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Tags / Interests</Text>
          <View style={styles.line}/>
          <TouchableOpacity
            style={styles.tagButton}
            onPress={this._showTagPage.bind(this)}
          >
            <Text style={[GlobalStyles.text, styles.textListItem, styles.tagText]}>{(this.props.myProfile.tags && this.props.myProfile.tags.length > 0) ? this.props.myProfile.tags.join(", ") : "none (tap to add)"}</Text>
          </TouchableOpacity>
          <View style={styles.line}/>
          {this._shouldRenderStaticSaveButton()}
          {this._shouldRenderCloseButton()}
          {this._shouldRenderShowProfileButton()}
          {this._shouldRenderLogoutButton()}
          <RectButton
            style={[styles.rectButton]}
            textStyle={styles.buttonText}
            onPress={() => {this.ActionSheet.show()}}
            text="Help / Feedback / More"
          />
          <View style={styles.bottom}>
            <Text style={styles.aboutText}>
              JumboSmash was brought to you by:{"\n"}
              Devs: {GlobalFunctions.developers()+"\n"}
              Designers: {GlobalFunctions.designers()+"\n\n"}
              Help From:{"\n"+GlobalFunctions.helpers()}
            </Text>
          </View>
          <View style={styles.hiddenText}>
            <Text style={{textAlign: 'center'}}>🍆🍑</Text>
          </View>
        </ScrollView>
        {this._shouldRenderDynamicSaveButton()}
        {this._renderActionSheet()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  textListItem: {
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 15,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 9,
    fontWeight: '600',
  },
  textInput: {
    height: 42,
    color: GlobalFunctions.style().darkGray,
  },
  tagText: {
    alignItems: 'center',
    color: GlobalFunctions.style().darkGray,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tagButton: {
  },
  line: {
    height: 1,
    left: 0,
    right: 0,
    backgroundColor: GlobalFunctions.style().lightGray,
  },
  bottom: {
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
  },
  rectButton: {
    height: 60,
    marginTop: 15,
    backgroundColor: GlobalFunctions.style().color,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight:"600",
  },
  aboutText: {
    textAlign: 'center',
    opacity: 0.5,
  },
  hiddenText: {
    position: 'absolute',
    bottom: -150,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsPage;
