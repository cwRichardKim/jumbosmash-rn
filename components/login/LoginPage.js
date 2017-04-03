'use strict';

/*

This page handles after a user has been created.
It ensures:
  - a user has signed up
  - user email is verified
  - account is created

Directes to appropriate page if not. 
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
} from 'react-native';

import AuthErrors             from './AuthErrors.js';
import FormatInput            from './FormatInput.js';
import Verification           from "./Verification.js";
import GlobalFunctions        from "../global/GlobalFunctions.js";

import ForgotPasswordPage     from './ForgotPasswordPage.js';
import SignupPage             from './SignupPage.js';
import CreateProfilePage      from './CreateProfilePage.js'

const PageNames = require("../global/GlobalFunctions.js").pageNames();

class LoginPage extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      email_input: this.props.emailInput || null,
      password:'',
    }
  }

  async _login(){

    var email = FormatInput.email(this.state.email_input, this.props.email_ext);
    var password = this.state.password;

    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user && !user.emailVerified) {
          Alert.alert("Please check your email, and verify your account before logging in. If you're experiencing issues, contact us at team@jumbosmash.com");
        } else if (user && user.emailVerified) {
          this.props.firebase.auth().currentUser
            .getToken(true)
            .then(async (token) => {
              let studentProfile = await Verification.getStudent(email);
              this.props.setToken(token);
              this.props.setStudentProfile(studentProfile);
              
              let url = "https://jumbosmash2017.herokuapp.com/profile/id/".concat(studentProfile._id).concat("/").concat(token);
              try {
                let response = await fetch(url);
                let responseJson = await response.json();

                if (responseJson) {
                  // Authentication Process complete!
                  this.props.loadPage(PageNames.appHome);
                } else {
                  this._goToCreateProfilePage();
                }
              } catch(error) {
                Alert.alert("there's been an error");
                throw error;
              }
            })
          }
        })
      .catch((error) => {
        AuthErrors.handleLoginError(error);
      })
    }

  _goToForgotPassword() {
    this.props.navigator.replace({
      name: ForgotPasswordPage
    })
  }

  _goToSignupPage() {
    this.props.navigator.replace({
      name: SignupPage
    });
  }

  _goToCreateProfilePage() {
    this.props.navigator.replace({
      name: CreateProfilePage
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.textinput}>
            <TextInput
              style={styles.first}
              onChangeText={(text) => this.setState({email_input: text})}
              value={this.state.email_input}
              placeholder={this.props.emailInput || "Enter your tufts email"}
            />
            <Text style={styles.last}> {this.props.email_ext} </Text>
          </View>

          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
          />

          <Button
            onPress={this._login.bind(this)}
            title="Login"
            accessibilityLabel="Login"
          />

          <Button
            onPress={this._goToSignupPage.bind(this)}
            title="New here? Go to Signup"
            accessibilityLabel="Go to signup page"
          />

          <Button
            onPress={this._goToForgotPassword.bind(this)}
            title="Forgot password?"
            accessibilityLabel="Forgot password?"
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center'
  },
  body: {
    flex: 9,
    alignItems: 'center',
  },
  first: {
    flex: 3/4,
  },
  last: {
    flex: 1/4,
    alignSelf: 'center',
  },
  textinput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    flexDirection: 'row',
  },
  button: {
  }
})

export default LoginPage;
