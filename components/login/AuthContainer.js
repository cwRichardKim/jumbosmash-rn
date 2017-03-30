'use strict';

/*
This is the first page. It sets up the navigator for authentication, and then
pushes to LoginPage.
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
  Navigator,
} from 'react-native';

import LoginPage              from "./LoginPage.js";
import AccountPage            from "./AccountPage.js";
import SignupPage             from "./SignupPage.js";
import ForgotPasswordPage     from './ForgotPasswordPage.js';

const StorageKeys = require("../global/GlobalFunctions").storageKeys();

class AuthContainer extends Component {

  constructor(props){
    super(props);
    this.studentProfile = null; // student object of the user (not the profile object)
    this.state = {
      component: LoginPage, // default is not logged in
      email: null,
    };
  }

  // Checks if user is already logged in, and verified
  componentWillMount() {
    var user = this.props.firebase.auth().currentUser;
    if (user && user.emailVerified) {
      this.setState( {component: AccountPage})
    }
  }

  setStudentProfile(profile) {
    this.studentProfile = profile;
  }

  setMyProfile(profile) {
    this.props.setMyProfile(profile);
  }

  render(){
    return (
      <Navigator
        initialRoute={{component: this.state.component}}
        configureScene={() => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={(route, navigator) => {
          if(route.component){
            return React.createElement(route.component,
              { navigator: navigator,
                routeNavigator: this.props.routeNavigator,
                firebase: this.props.firebase,
                setEmail: (email) => {this.setState({email})},
                email: this.state.email,
                setStudentProfile: this.setStudentProfile.bind(this),
                studentProfile: this.studentProfile,
                setMyProfile: this.setMyProfile.bind(this),
                myProfile: this.props.myProfile,
                loadPage: this.props.loadPage.bind(this),
                email_ext: "@tufts.edu" });
          }
        }}
      />
    );
  }
}

export default AuthContainer;
