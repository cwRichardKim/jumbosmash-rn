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
} from 'react-native';

import ProfilePhotoPicker from "./ProfilePhotoPicker.js"
import SaveButton         from "./SaveButton.js"
const SaveButtonState = require('../global/GlobalFunctions.js').saveButtonStates();

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.firstName,
      lastName: props.lastName,
      description: props.description,
      major: props.major,
      photos: props.photos,
      saveButtonState: SaveButtonState.hide,
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
      if (photos[i] != null) {
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
      if (photos[i] != null) {
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
          this.refs.saveButton.animateOut(() => {this.setState({saveButtonState: SaveButtonState.hide})});
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
  _saveButtonPressed() {
    this._asyncUpdatePropertiesRequest();
  }

  // Scroll a component into view. Just pass the component ref string.
  _inputFocused (refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(this.refs[refName]),
        50, //additionalOffset
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
      this.setState({
        photos: photos,
        saveButtonState: SaveButtonState.show,
      });
    } else {
      Alert.alert(
        "Photo Error",
        "Something went wrong :( Contact team@jumbosmash.com and let us know that the incorrect number of photos were updated",
        [{text: 'OK', onPress: () => {}},],
      );
    }
  }

  render() {
    return (
      <View style={[styles.container, {height: this.props.pageHeight}]}>
        <ScrollView ref='scrollView'>
          <ProfilePhotoPicker
            photos={this.state.photos}
            updatePhotos={this._updatePhotos.bind(this)}
            firebase={this.props.firebase}
          />
          <Text style={[styles.header, styles.textListItem]}>Preferred First Name</Text>

          <View style={styles.line}/>
          <TextInput style={[styles.textListItem, styles.textInput]}
            onChangeText={(firstName) => {this.setState({firstName, saveButtonState:SaveButtonState.show})}}
            value={this.state.firstName}
            color="#C3C1C1"
            maxLength={80}
            ref='firstName'
            onFocus={this._inputFocused.bind(this, 'firstName')}
            onSubmitEditing={() => this._focusNextField('lastName')}
            returnKeyType="next"
          />
          <View style={styles.line}/>

          <Text style={[styles.header, styles.textListItem]}>Last Name</Text>

          <View style={styles.line}/>
          <TextInput style={[styles.textListItem, styles.textInput]}
            onChangeText={(lastName) => {this.setState({lastName, saveButtonState:SaveButtonState.show})}}
            value={this.state.lastName}
            color="#C3C1C1"
            maxLength={80}
            ref='lastName'
            onFocus={this._inputFocused.bind(this, 'lastName')}
            onSubmitEditing={() => this._focusNextField('description')}
            returnKeyType="next"
          />
          <View style={styles.line}/>

          <Text style={[styles.header, styles.textListItem]}>Bio</Text>

          <View style={styles.line}/>
          <TextInput style={[styles.textListItem, styles.textInput, {height: 100, paddingTop: 5, paddingBottom: 5}]}
            onChangeText={(description) => {this.setState({description, saveButtonState:SaveButtonState.show})}}
            value={this.state.description}
            color="#C3C1C1"
            multiline={true}
            maxLength={500}
            ref='description'
            onFocus={this._inputFocused.bind(this, 'description')}
          />
          <View style={styles.line}/>

          <Text style={[styles.header, styles.textListItem]}>Major</Text>

          <View style={styles.line}/>
          <TextInput style={[styles.textListItem, styles.textInput]}
            onChangeText={(major) => {this.setState({major, saveButtonState:SaveButtonState.show})}}
            value={this.state.major}
            color="#C3C1C1"
            maxLength={100}
            ref='major'
            onFocus={this._inputFocused.bind(this, 'major')}
            returnKeyType="done"
          />
          <View style={styles.line}/>
        </ScrollView>
        <SaveButton
          ref="saveButton"
          onPress={this._saveButtonPressed.bind(this)}
          saveButtonState={this.state.saveButtonState}
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
});

export default SettingsPage;
