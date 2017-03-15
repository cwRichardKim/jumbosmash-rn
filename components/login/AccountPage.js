'use strict';

/*
This page is the current representation of a logged in user.
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  AsyncStorage,
  Button,
} from 'react-native';

import LoginPage              from './LoginPage.js';
import AuthErrors             from './AuthErrors.js';

const PageNames = require("../global/GlobalFunctions.js").pageNames();

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  logout(){
    this.props.firebase.auth().signOut()
      .then(() => {
        Alert.alert("You've been logged out. Bye!");
        this.props.navigator.push({
          component: LoginPage
        });
      })
      .catch((error) => {
        AuthErrors.handleLogoutError(error);
      })
  }

  getCurrentLoggedInUser() {
    var user = this.props.firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if(user) {
      // name = user.displayName;
      email = user.email;
      // photoUrl = user.photoURL;
      // emailVerified = user.emailVerified;
      // uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
      //                 // this value to authenticate with your backend server, if
      //                 // you have one. Use User.getToken() instead.
      return "Hello " + email
    } else {
      return "NO ONE'S LOGGED IN!"
    }
  }

  _authCompleted() {
    this.props.routeNavigator.replace({name: PageNames.appHome});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Text> You're logged in! </Text>
          <Text> {this.getCurrentLoggedInUser() } </Text>
          <Button
            onPress={this.logout.bind(this)}
            title="Logout"
            accessibilityLabel="Logout"
          />
          <Button
            onPress={this._authCompleted.bind(this)}
            title="go to app"
            accessibilityLabel="go to app"
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center'
  },
  body: {
    flex: 9,
    alignItems: 'center',
  },
})


export default AccountPage;
