'use strict';

/*
This page handles the firebase authentication errors that might be thrown.
It is used by:
	- LoginPage.js
	- AccountPage.js
	- SignupPage.js
*/

import React, {Component} from 'react';
import {
	Alert,
} from 'react-native';

import LoginPage              from './LoginPage.js';
import AccountPage            from './AccountPage.js';
import SignupPage             from './SignupPage.js';

class Redirect extends Component {

  // updatesLoginStatus() {
  //   this.props.firebase.auth().onAuthStateChanged(function(user) {
  //     if (user) {

  //       // user is signed in
  //       var email = user.email;
  //       user.getToken()
  //         .then((accessToken) => {
  //           Alert.alert("access token", accessToken);
  //           this.goToAccountPage();
  //         })
  //         .catch((error) => {
  //           Alert.alert("there's been an error getting the token?!"); 
  //         })
  //     } else {
  //       // user is not logged in
  //       Alert.alert("you're not logged in");
  //       this.goToSignupPage();
  //     }
  //   });
  // }

  static goToLoginPage(){
    this.props.navigator.push({
      component: LoginPage
    });
  }

  static goToSignupPage(){
    this.props.navigator.push({
      component: SignupPage
    });
  }

  static goToAccountPage(){
    this.props.navigator.push({
      component: AccountPage
    });
  }

}

export default Redirect;

