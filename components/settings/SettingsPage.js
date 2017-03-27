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
  Keyboard,
} from 'react-native';

import ProfilePhotoPicker from "./ProfilePhotoPicker.js";
import SaveButton         from "./SaveButton.js";
import RectButton         from "../global/RectButton.js";
import GlobalStyles       from "../global/GlobalStyles.js";
import AuthErrors         from "../login/AuthErrors.js"


const GlobalFunctions = require('../global/GlobalFunctions.js');
const PageNames = GlobalFunctions.pageNames();
const SaveButtonState = GlobalFunctions.saveButtonStates();
let Mailer = require('NativeModules').RNMail;

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.keyboardHeight = 0;

    this.state = {
      firstName: props.firstName,
      lastName: props.lastName,
      description: props.description,
      major: props.major,
      photos: props.photos,
      saveButtonState: SaveButtonState.hide,
    }
  }

  componentWillMount () {
    this.keyboardFrameWillChangeListener = Keyboard.addListener('keyboardWillChangeFrame', this._keyboardWillChangeFrame.bind(this));
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

  // after the request is made, this function sets the new states correctly from the server
  _updateStates(newProfile) {
    this.setState({
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
      description: newProfile.description,
      major: newProfile.major,
      photos: newProfile.photos,
    })
  }

  _allPhotosAreNull(photos) {
    for (var i in photos) {
      if (photos[i] != null && photos[i].large != null && photos[i].small != null) {
        return false;
      }
    }
    return true;
  }

  // returns the photos pushed to the front eg: [null, x, y] -> [x, y, null]
  // returns false if all photos are null
  _reArrangePhotos() {
    let photos = this.state.photos;
    var newPhotos = [];
    for (var i in photos) {
      if (photos[i] != null && photos[i].large != null && photos[i].small != null) {
        newPhotos.push(photos[i]);
      }
    }
    while (newPhotos.length < photos.length) {
      newPhotos.push(null);
    }
    return newPhotos;
  }

  // returns true if all checks are met, returns false and calls proper
  // errors if not
  _checkPropertiesAreValid () {
    if (this._allPhotosAreNull(this.state.photos)) {
      Alert.alert(
        "Must have at least 1 photo!",
        "Please add at least 1 photo before saving",
        [{text: 'OK', onPress: () => {}},],
      );
    } else if (this.state.firstName.length < 1) {
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
    if (this.props.updateProfile) {
      if (this._checkPropertiesAreValid()) {
        this.setState({
          saveButtonState: SaveButtonState.saving,
        });
        this.props.updateProfile({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          description: this.state.description,
          major: this.state.major,
          photos: this._reArrangePhotos(),
        }).then((newProfileResponse) => { // success
          this._updateStates(newProfileResponse);
          this.refs.saveButton.animateOut(() => {
            this._changesSuccessfullyUpdated();
          });
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
      this._changeWasMade(()=>{this.setState({photos})});
    } else {
      Alert.alert(
        "Photo Error",
        "Something went wrong :( Contact team@jumbosmash.com and let us know that the incorrect number of photos were updated",
        [{text: 'OK', onPress: () => {}},],
      );
    }
  }

  _changeWasMade(changeStateFunc) {
    this.setState({saveButtonState:SaveButtonState.show})
    if (this.props.setHasUnsavedSettings){
      this.props.setHasUnsavedSettings(true);
    }
    if (changeStateFunc) {
      changeStateFunc();
    }
  }

  _changesSuccessfullyUpdated() {
    this.setState({saveButtonState: SaveButtonState.hide});
    if (this.props.setHasUnsavedSettings){
      this.props.setHasUnsavedSettings(false);
    }
  }

  _sendMail() {
    if (Mailer && Mailer.mail) {
      Mailer.mail({
        subject: 'Help / Feedback',
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

  _logout() {
    this.props.firebase.auth().signOut()
      .then(() => {
        this.props.routeNavigator.replace({name: PageNames.auth});
      })
      .catch((error) => {
        AuthErrors.handleLogoutError(error);
        throw error;
      }
    );
  }

  render() {
    return (
      <View style={[styles.container, {marginTop: this.props.navBarHeight, height: this.props.pageHeight}]}>
        <ScrollView ref='scrollView'>
          <ProfilePhotoPicker
            photos={this.state.photos}
            updatePhotos={this._updatePhotos.bind(this)}
            firebase={this.props.firebase}
          />
          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Preferred First Name</Text>

          <View style={styles.line}/>
          <TextInput style={[GlobalStyles.text, styles.textListItem, styles.textInput]}
            onChangeText={(firstName) => {this._changeWasMade(()=>{this.setState({firstName})})}}
            value={this.state.firstName}
            color="#C3C1C1"
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
            onChangeText={(lastName) => {this._changeWasMade(()=>{this.setState({lastName})})}}
            value={this.state.lastName}
            color="#C3C1C1"
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
            onChangeText={(description) => {this._changeWasMade(()=>{this.setState({description})})}}
            value={this.state.description}
            color="#C3C1C1"
            multiline={true}
            maxLength={500}
            ref='description'
            onFocus={this._inputFocused.bind(this, 'description')}
          />
          <View style={styles.line}/>

          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Major</Text>

          <View style={styles.line}/>
          <TextInput style={[GlobalStyles.text, styles.textListItem, styles.textInput]}
            onChangeText={(major) => {this._changeWasMade(()=>{this.setState({major})})}}
            value={this.state.major}
            color="#C3C1C1"
            maxLength={100}
            ref='major'
            onFocus={this._inputFocused.bind(this, 'major')}
            returnKeyType="done"
          />
          <View style={styles.line}/>
          <RectButton
            style={[styles.rectButton, styles.logoutButton]}
            onPress={this._logout.bind(this)}
            text="Logout"
          />
          <RectButton
            style={[styles.rectButton, styles.supportButton]}
            onPress={this._sendMail.bind(this)}
            text="Help / Feedback"
          />
          <View style={styles.bottom}>
            <Text style={styles.aboutText}>
              JumboSmash was brought to you by:{"\n"}
              Devs: Elif Kinli, Richard Kim, Jared Moskowitz,{"\n"}
              Jade Chan{"\n"}
              Designers: Shanshan Duan, Bruno Olmedo{"\n\n"}
              Beta Testers:{"\n"}
              Zoe Baghdoyan, Josh Beri, Frankie Caiazzo, Tafari Duncan, Orlando Economos, Jason Fan, Derek Fieldhouse, Shana Gallagher, Lucy Gerhart, Ryan Gill, Cori Jacoby, Nishant Joshi, Dhruv Khurana, Rebecca Larson, Ian Leaman, Ann Lin, Emily Lin, Brian McGough, Jordan Meisel, Mackenzie Merriam, Sylvia R. Ofama, Isha Patnaik, Luis Rebollar, Joaquin Rodgriguez, Ben Sack, Maya Salcido White, Katie Saviano, Kabir Singh, Clare Stone, Lilly Tahmasebi, Aubrey Tan, Mudit Tandon, Joshua Terry, Nicholas Turiano, Harry Weissman, Gideon Wulfsohn
            </Text>
          </View>
          <View style={styles.hiddenText}>
            <Text style={{textAlign: 'center'}}>🍆🍑</Text>
          </View>
        </ScrollView>
        <SaveButton
          ref="saveButton"
          onPress={this.saveButtonPressed.bind(this)}
          saveButtonState={this.state.saveButtonState}
          keyboardHeight={this.keyboardHeight}
        />
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
  },
  textInput: {
    height: 42,
  },
  line: {
    height: 1,
    left: 0,
    right: 0,
    backgroundColor: "#F8F5F5",
  },
  bottom: {
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
  },
  rectButton: {
    height: 70,
    marginTop: 20,
    backgroundColor: '#F2585A',
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#C5C3C3',
  },
  supportButton: {
    backgroundColor: '#F2585A',
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
