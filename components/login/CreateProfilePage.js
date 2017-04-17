'use strict';

/*

This page is for a user who has not yet created a profile object.
*/

import React, {Component} from 'react';
import {
  findNodeHandle,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

import RectButton         from "../global/RectButton.js";
import GlobalStyles       from "../global/GlobalStyles.js";
import AuthErrors         from "./AuthErrors.js"
import ProfilePhotoPicker from "../settings/ProfilePhotoPicker.js";
import GlobalFunctions    from "../global/GlobalFunctions.js";
import LoginPage          from "./LoginPage.js";
import TagPage            from "../settings/TagPage.js";

const PageNames = require("../global/GlobalFunctions.js").pageNames();

class CreateProfilePage extends Component {

  constructor(props) {
    super(props);

    this.studentProfile = props.studentProfile || null;
    this.token = props.token || null;
    this.state = {
      firstName: this.studentProfile.firstName,
      lastName: this.studentProfile.lastName,
      description: '',
      major: this.studentProfile.major,
      photos: null,
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
      if (photos[i] != null && photos[i].large != null && photos[i].small != null && photos[i].large.length > 0) {
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
      if (photos[i] != null && photos[i].large != null && photos[i].small != null && photos[i].large.length > 0) {
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
      this.setState({photos});
    } else {
      Alert.alert(
        "Photo Error",
        "Something went wrong :( Contact team@jumbosmash.com and let us know that the incorrect number of photos were updated",
        [{text: 'OK', onPress: () => {}},],
      );
    }
  }

  _createAccount() {
    if (this._checkPropertiesAreValid()) {
      let url = "https://jumbosmash2017.herokuapp.com/profile/add/".concat(this.token);
      let body = {
        id: this.studentProfile._id,
        firstName: this.state.firstName,
        middleName: this.studentProfile.middleName,
        lastName: this.state.lastName,
        school: this.studentProfile.school,
        major: this.state.major,
        description: this.state.description,
        email: this.studentProfile.email,
        tags: this.props.myProfile.tags,
        photos: this._reArrangePhotos(),
      };
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((response) => {
        if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
          return response.json();
        } else {
          throw ("status" in response) ? response["status"] : "Unknown Error";
        }
      }).then((responseJson) => {
        // Authentication Process complete!
        this.props.setMyProfile(body);
        this.props.loadPage(PageNames.appHome);
      }).catch((error) => {
        Alert.alert("There's been an error, please quit the app and try again. If the problem persists, email us at team@jumbosmash.com");
      });
    } else {
      Alert.alert(
        "Account creation error",
        "Something went wrong :( Contact team@jumbosmash.com and let us know that we couldn't update your profile",
        [{text: 'OK', onPress: () => {}},],
      );
    }
  }

  _showTagPage() {
    this.props.navigator.push({name: TagPage})
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
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}
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
            onChangeText={(lastName) => this.setState({lastName})}
            value={this.state.lastName}
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
            onChangeText={(description) => this.setState({description})}
            value={this.state.description}
            multiline={true}
            maxLength={500}
            ref='description'
            onFocus={this._inputFocused.bind(this, 'description')}
          />
          <View style={styles.line}/>

          <Text style={[styles.header, GlobalStyles.text, styles.textListItem]}>Major</Text>

          <View style={styles.line}/>
          <TextInput style={[GlobalStyles.text, styles.textListItem, styles.textInput]}
            onChangeText={(major) => this.setState({major})}
            value={this.state.major}
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
            <Text style={[GlobalStyles.text, styles.textListItem, styles.tagText]}>{(this.props.myProfile && this.props.myProfile.tags && this.props.myProfile.tags.length > 0) ? this.props.myProfile.tags.join(", ") : "none (tap to add)"}</Text>
          </TouchableOpacity>
          <View style={styles.line}/>
          <RectButton
            style={[styles.rectButton, styles.createAccountButton]}
            onPress={this._createAccount.bind(this)}
            text="Create Account"
          />

          <View style={styles.bottom}>
            <Text style={styles.aboutText}>
            JumboSmash was brought to you by:{"\n"}
            Devs: {GlobalFunctions.developers()+"\n"}
            Designers: {GlobalFunctions.designers()+"\n\n"}
            Beta Testers:{"\n"+GlobalFunctions.betaTesters()}
            </Text>
          </View>
          <View style={styles.hiddenText}>
            <Text style={{textAlign: 'center'}}>🍆🍑</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
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
    color: "#919191",
  },
  line: {
    height: 1,
    left: 0,
    right: 0,
    backgroundColor: "#F8F5F5",
  },
  tagText: {
    alignItems: 'center',
    color: "#919191",
    paddingTop: 10,
    paddingBottom: 10,
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
  createAccountButton: {
    backgroundColor: 'cornflowerblue',
  },
  updateProfileButton: {
    backgroundColor: "cornflowerblue",
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

export default CreateProfilePage;
