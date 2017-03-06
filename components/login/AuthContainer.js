'use strict';

/*
This page handles the navigation for login, managing the transition between:
  
  SignupPage     --    Creating an account
  LoginPage      --    Signing into already created account
  AccountPage    --    Logged in Account Page
  
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

import SignupPage             from "./SignupPage.js";
import LoginPage              from "./LoginPage.js";
import AccountPage            from "./AccountPage.js";

class AuthContainer extends Component {    

  constructor(props){
    super(props);
    this.state = {
      component: null,
    };
  }
  
  render(){
    return (
      <Navigator
        initialRoute={{component: LoginPage}}    
        configureScene={() => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={(route, navigator) => {
          if(route.component){
            return React.createElement(route.component, 
              { navigator: navigator, 
                firebase: this.props.firebase,
                email_ext: "@tufts.edu" }); 
          }
        }}
      />
    );
  }
}

export default AuthContainer;