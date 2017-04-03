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
    if (route.name == LoginPage){
      return (
        <LoginPage
          navigator = {navigator} 
          routeNavigator = {this.props.routeNavigator}
          firebase = {this.props.firebase}
          
          setEmailInput = {(emailInput) => {this.emailInput = emailInput}}
          emailInput = {this.emailInput}
          email_ext = "@tufts.edu"

          setStudentProfile = {(studentProfile) => this.studentProfile = studentProfile}
          setToken = {(token) => this.token = token}
          loadPage = {this.props.loadPage.bind(this)}
        />
      )
    } else if (route.name == ForgotPasswordPage) {
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

          studentProfile = {this.studentProfile}
          token = {this.token}
          setMyProfile = {(myProfile) => this.myProfile = myProfile}
          loadPage = {this.props.loadPage.bind(this)}
        />
      )
    } else {
      return (
        <LoginPage
          navigator = {navigator} 
          routeNavigator = {this.props.routeNavigator}
        />
      )
    }
  }

  render(){
    let initialAuthPage = LoginPage;

    return (
      <Navigator
        initialRoute={{name: initialAuthPage }}
        renderScene={this._renderAuthScenes.bind(this)}
            // return React.createElement(route.component,
            //   { navigator: navigator,
            //     routeNavigator: this.props.routeNavigator,
            //     firebase: this.props.firebase,
            //     setEmail: (email) => {this.setState({email})},
            //     email: this.state.email,
            //     setStudentProfile: this.setStudentProfile.bind(this),
            //     studentProfile: this.studentProfile,
            //     setMyProfile: this.setMyProfile.bind(this),
            //     myProfile: this.props.myProfile,
            //     loadPage: this.props.loadPage.bind(this),
            //     email_ext: "@tufts.edu" });
      />
    );
  }
}

export default AuthNavigator;
