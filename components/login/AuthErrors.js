'use strict';

/*
This page handles the firebase authentication errors that might be thrown.
It is used by:
	- LoginPage.js
	- AccountPage.js
*/

import React, {Component} from 'react';
import {
	Alert,
} from 'react-native';

class AuthErrors extends Component {

	static handleSignupError(error) {
		var errorCode = error.code;
		switch(errorCode) {
      case "auth/email-already-in-use":
        Alert.alert("The email is already in use. Retrieve password.");
        break;
      case "auth/invalid-email":
        Alert.alert("The email is not valid.");
        break;
      case "auth/operation-not-allowed":
        Alert.alert("Email account is not enabled.");
        break;
      case "auth/weak-password":
        Alert.alert("The password you've chosen is not strong enough.");
        break;
      default:
        Alert.alert("Error. Please try again.");
        break;
    }
  }

  static handleLoginError(error) {
  	var errorCode = error.code;
    switch(errorCode) {
      case "auth/invalid-email":
        Alert.alert("The email is not valid.");
        break;
      case "auth/user-disabled":
        Alert.alert("User has been disabled. Please email team@jumbosmash.com");
        break;
      case "auth/user-not-found":
        Alert.alert("User not found. Create an account!");
        break;
      case "auth/wrong-password":
        Alert.alert("Incorrect password.");
        break;
      default:
        throw error;
        Alert.alert("Error. Please try again.");
        break;
    }
  }

  // TODO: Figure this out?
  static handleLogoutError(error) {
    Alert.alert("there's been an error in logging you out! Contact us at team@jumbosmash.com");
  }
}

export default AuthErrors;

