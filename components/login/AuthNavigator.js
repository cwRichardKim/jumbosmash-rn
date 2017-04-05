'use strict';

/*
  This serves as the navigator for authentication pages. 
  Communicating between:
    - LoginPage
    - ForgotPasswordPage
    - SignupPage
    - CreateProfilepage

  It passes:
    - emailInput (ForgotPasswordPage => LoginPagebetween, SignupPage => LoginPage)
    - Student Object (between Login & CreateProfile) // NOT YET
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Button,
  Navigator,
} from 'react-native';

import LoginPage              from "./LoginPage.js";
import CreateProfilePage      from "./CreateProfilePage.js";
import SignupPage             from "./SignupPage.js";
import ForgotPasswordPage     from './ForgotPasswordPage.js';

const StorageKeys = require("../global/GlobalFunctions").storageKeys();
const PageNames = require("../global/GlobalFunctions.js").pageNames();

class AuthNavigator extends Component {

  constructor(props){
    super(props);
    this.emailInput = null;
    this.studentProfile = null;
    this.token = null;

    this.myProfile = null;
  }
  
  _renderAuthScenes(route, navigator) {
    if (route.name == ForgotPasswordPage) {
      return(
        <ForgotPasswordPage
          navigator = {navigator} 
          routeNavigator = {this.props.routeNavigator}
          firebase = {this.props.firebase}
          
          setEmailInput =  {(emailInput) => {this.emailInput = emailInput}}
          emailInput = {this.emailInput}
          email_ext = "@tufts.edu"
        />
      )
    } else if (route.name == SignupPage) {
      return(
        <SignupPage
          navigator = {navigator} 
          routeNavigator = {this.props.routeNavigator}
          firebase = {this.props.firebase}

          setEmailInput =  {(emailInput) => {this.emailInput = emailInput}}
          emailInput = {this.emailInput}
          email_ext = "@tufts.edu"
        />
      )
    } else if (route.name == CreateProfilePage) {
      return(
        <CreateProfilePage
          navigator = {navigator} 
          routeNavigator = {this.props.routeNavigator}
          firebase = {this.props.firebase}
          email_ext = "@tufts.edu"

          setMyProfile = {this.props.setMyProfile}
          studentProfile = {this.studentProfile}
          token = {this.token}
          loadPage = {this.props.loadPage.bind(this)}
        />
      )
    } else {
      // Default is LoginPage
      return (
        <LoginPage
          navigator = {navigator} 
          routeNavigator = {this.props.routeNavigator}
          firebase = {this.props.firebase}
          
          setEmailInput = {(emailInput) => {this.emailInput = emailInput}}
          emailInput = {this.emailInput}
          email_ext = "@tufts.edu"

          setStudentProfile = {(studentProfile) => this.studentProfile = studentProfile}
          setMyProfile = {this.props.setMyProfile}
          setToken = {(token) => this.token = token}
          loadPage = {this.props.loadPage.bind(this)}
        />
      )
    }
  }

  render(){
    let initialAuthPage = "LoginPage";

    return (
      <Navigator
        initialRoute={{name: initialAuthPage }}
        renderScene={this._renderAuthScenes.bind(this)}
      />
    );
  }
}

export default AuthNavigator;
