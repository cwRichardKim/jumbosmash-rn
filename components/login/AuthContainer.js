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
import forgotPasswordPage     from './ForgotPasswordPage.js';

class AuthContainer extends Component {

  constructor(props){
    super(props);
    this.state = {
      component: LoginPage, // default is not logged in
    };
  }

  // Checks if user is already logged in, and verified
  componentWillMount() {
    var user = this.props.firebase.auth().currentUser;
    if (user && user.emailVerified) {
      this.setState( {component: AccountPage})
    }
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
                email_ext: "@tufts.edu" });
          }
        }}
      />
    );
  }
}

export default AuthContainer;
