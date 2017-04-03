'use strict';

/*
This page is the current representation of a logged in user.
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
import LoginPage          from "./LoginPage.js"

const PageNames = require("../global/GlobalFunctions.js").pageNames();

class AccountPage extends Component {

  constructor(props) {
    super(props);

    this.studentProfile = props.studentProfile || null;
    this.token = {val: null};
    this.state = {
      firstName: props.firstName,
      lastName: props.lastName,
      description: props.description,
      major: props.major,
      photos: props.photos || null,
    }
  }

  componentDidMount() {
    if (this.studentProfile) {
      this._updateStates(this.studentProfile);
    } else {
      // going to login page
      Alert.alert("you're not logged in yet, go to loginpage");
      this.props.navigator.push({
        component: LoginPage
      });
    }

    if (this.props.firebase.auth().currentUser) {
      this.props.firebase.auth()
        .currentUser
        .getToken(true)
        .then(function(idToken) {
          this.token.val = idToken;
          this._doesProfileAlreadyExist(idToken);
        }.bind(this))
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  _doesProfileAlreadyExist(idToken) {
    // check if account has already been created
    let url = "https://jumbosmash2017.herokuapp.com/profile/id/".concat(this.studentProfile._id).concat("/").concat(this.token.val);

    fetch(url)
      .then((response) => {
        if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
          return response.json();
        } else {
          throw ("status" in response) ? response["status"] : "Unknown Error";
        }
      }).then((responseJson) => {
        if (responseJson) {
          this.props.setMyProfile(responseJson);
          // account already exists
          Alert.alert("You already have a profile.")
          this._authCompleted();
        }
      }).catch((error) => {
        throw error; //TODO @richard show error thing
      });
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
      let url = "https://jumbosmash2017.herokuapp.com/profile/add/".concat(this.token.val);
      let body = {
        id: this.studentProfile._id,
        firstName: this.state.firstName,
        middleName: this.studentProfile.middleName,
        lastName: this.state.lastName,
        school: this.studentProfile.school,
        major: this.state.major,
        description: this.state.description,
        email: this.studentProfile.email,
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
        Alert.alert("Your account has been created.");
        this.props.setMyProfile(body);
        this._authCompleted();
      }).catch((error) => {
        throw error; //TODO @richard show error thing
      });
    } else {
      Alert.alert(
        "Update Error",
        "Something went wrong :( Contact team@jumbosmash.com and let us know that we couldn't update your profile",
        [{text: 'OK', onPress: () => {}},],
      );
    }
  }

  _authCompleted() {
    this.props.loadPage(PageNames.appHome);
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
    color: "#C3C1C1",
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

//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.body}>
//           <Text> {this.getCurrentLoggedInUser() } </Text>

//           <Button
//             onPress={this.logout.bind(this)}
//             title="Logout"
//             accessibilityLabel="Logout"
//           />
//           <Button
//             onPress={this._authCompleted.bind(this)}
//             title="go to app"
//             accessibilityLabel="go to app"
//           />
//         </View>
//       </View>
//     );
//   }
// }

// var styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems:'center'
//   },
//   body: {
//     flex: 9,
//     alignItems: 'center',
//   },
//   textinput: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     margin: 10,
//     flexDirection: 'row',
//   },
//   button: {
//   }
// })


export default AccountPage;
