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
} from 'react-native';

import ProfilePhotoPicker from "./ProfilePhotoPicker.js"
import Button             from "./Button.js"

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.firstName,
      lastName: props.lastName,
      description: props.description,
      major: props.major,
      photos: props.photos,
      showSaveButton: false,
    }
  }

  // This function updates the current information to the server
  _saveButtonPressed() {
    if (this.props.updateProfile) {
      this.props.updateProfile({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        description: this.state.description,
        major: this.state.major,
        photos: this.state.photos,
      });
      //TODO @richard load / error case
      this.setState({
        showSaveButton: false,
      })
    }
    //TODO: @richard add loading / error cases
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

  _renderSaveButton() {
    if (this.state.showSaveButton) {
      return (
        <View style={styles.saveButtonContainer}>
          <Button
            style={styles.saveButton}
            source={require("./images/saveButton.png")}
            onPress={this._saveButtonPressed.bind(this)}
            activeOpacity={0.4}
          />
        </View>
      );
    }
  }

  _focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  // allows ProfilePhotoPicker to adjust the photos
  _updatePhotos(photos) {
    if (photos && photos.length == 3) {
      this.setState({
        photos: photos,
        showSaveButton: true,
      });
    } else {
      Alert.alert(
        "Photo Error",
        "Something went wrong :( Contact team@jumbosmash.com and let them know that the incorrect number of photos were updated",
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
          />
          <Text style={[styles.header, styles.textListItem]}>Preferred First Name</Text>

          <View style={styles.line}/>
          <TextInput style={[styles.textListItem, styles.textInput]}
            onChangeText={(firstName) => {this.setState({firstName, showSaveButton:true})}}
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
            onChangeText={(lastName) => {this.setState({lastName, showSaveButton:true})}}
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
            onChangeText={(description) => {this.setState({description, showSaveButton:true})}}
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
            onChangeText={(major) => {this.setState({major, showSaveButton:true})}}
            value={this.state.major}
            color="#C3C1C1"
            maxLength={100}
            ref='major'
            onFocus={this._inputFocused.bind(this, 'major')}
            returnKeyType="done"
          />
          <View style={styles.line}/>
        </ScrollView>
        {this._renderSaveButton()}
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
  saveButtonContainer: {
    position: 'absolute',
    bottom: 20,
    height: 50,
    width: 70,
    right: 0,
  },
  saveButton: {
    width: 50,
    height: 50,
    borderRadius: 25,

    // android shadow
    elevation: 3,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
  line: {
    height: 1,
    left: 0,
    right: 0,
    backgroundColor: "#F8F5F5",
  },
});

export default SettingsPage;
