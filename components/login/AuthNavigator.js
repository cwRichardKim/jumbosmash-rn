'use strict';

/*
  This serves as the navigator for authentication pages.
  Communicating between:
    - LoginPage
    - ForgotPasswordPage
    - CreateProfilepage
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
import ForgotPasswordPage     from './ForgotPasswordPage.js';
import TagPage                from "../settings/TagPage.js";

const StorageKeys = require("../global/GlobalFunctions").storageKeys();
const PageNames = require("../global/GlobalFunctions.js").pageNames();

class AuthNavigator extends Component {

  constructor(props){
    super(props);
    this.emailInput = null;
    this.studentProfile = null;
    this.token = null;
  }

  _renderAuthScenes(route, navigator) {
    if (route.name == ForgotPasswordPage) {
      return(
        <ForgotPasswordPage
          navigator = {navigator}
          routeNavigator = {this.props.routeNavigator}
          firebase = {this.props.firebase}
          isConnected = {this.props.isConnected}

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

          setMyProfile = {this.props.updateMyProfile /* updateMyProfile does the same thing as setmyprofile but safer (it preservers the previous myProfile information)*/}
          myProfile = {this.props.myProfile}
          studentProfile = {this.studentProfile}
          token = {this.token}
          loadPage = {this.props.loadPage.bind(this)}
        />
      )
    } else if (route.name == TagPage) {
      return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <TagPage
            navigator={navigator}
            myProfile={this.props.myProfile}
            token={{val: this.token}}
            showNavBar={true}
            setTags={(tags) => {this.props.updateMyProfile({tags:tags})}}
          />
        </View>
      )
    } else {
      // Default is LoginPage
      return (
        <LoginPage
          navigator = {navigator}
          routeNavigator = {this.props.routeNavigator}
          firebase = {this.props.firebase}
          isConnected = {this.props.isConnected}

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
