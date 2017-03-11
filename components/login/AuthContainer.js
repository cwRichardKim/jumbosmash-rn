'use strict';

/*
This is the parent page of everything. 
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
  // AppState,
} from 'react-native';

import SignupPage             from "./SignupPage.js";
import LoginPage              from "./LoginPage.js";
import AccountPage            from "./AccountPage.js";

class AuthContainer extends Component {    

  constructor(props){
    super(props);
    this.state = {
      component: LoginPage, // default is not logged in
    };
  }

  // state = {
  //   appState: AppState.currentState
  // }
  
  // // Loads initial page
  // // If user is logged in => AccountPage
  // // user is not logged in => LoginPage
  // componentDidMount(){
  //   AppState.addEventListener('change', this._handleAppStateChange)

  // }

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
                firebase: this.props.firebase,
                email_ext: "@tufts.edu" }); 
          }
        }}
      />
    );
  }
}

export default AuthContainer;