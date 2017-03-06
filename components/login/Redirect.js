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

