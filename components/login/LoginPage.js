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
  Image,
} from 'react-native';

import AuthErrors             from './AuthErrors.js';
import FormatInput            from './FormatInput.js';
import Verification           from "./Verification.js";
import GlobalFunctions        from "../global/GlobalFunctions.js";
import RectButton             from "../global/RectButton.js";

import ForgotPasswordPage     from './ForgotPasswordPage.js';
import CreateProfilePage      from './CreateProfilePage.js'

const PageNames = require("../global/GlobalFunctions.js").pageNames();
const AuthStyle = require('./AuthStylesheet');

class LoginPage extends Component {
  
  constructor(props) {
    super(props);
    this.email = "";
    this.state = {
      email_input: this.props.emailInput || null,
      password:'',
    }
  }

  /* Before any button is pressed, the current text input is saved 
     Called before Login and Signup
  */
  _beforeButtonPress() {
    if (!this.state.email_input) {
      Alert.alert("Please type in your email address");
    } else {
      this.props.setEmailInput(this.state.email_input);
      var email = FormatInput.email(this.state.email_input, this.props.email_ext);
      this.email = email;

      var password = this.state.password;
    }
  }

  /*************************** Login ***************************/
  async _login() {
    await this._beforeButtonPress();
    let email = this.email;
    let password = this.state.password;

    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user && !user.emailVerified) {
          Alert.alert("Please check your email, and verify your account before logging in. If you're experiencing issues, contact us at team@jumbosmash.com");
        } else if (user && user.emailVerified) {
          this.props.firebase.auth().currentUser
            .getToken(true)
            .then(async (token) => {
              let studentProfile = await Verification.getStudent(email);
              this.props.setStudentProfile(studentProfile);
              this.props.setToken(token);

              let url = "https://jumbosmash2017.herokuapp.com/profile/id/".concat(studentProfile._id).concat("/").concat(token);
              try {
                let response = await fetch(url);
                let responseJson = await response.json();

                if (responseJson) {
                  // Authentication Process complete!
                  this.props.setMyProfile(responseJson);
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

  /*************************** Signup ***************************/
  async _signup() {
    await this._beforeButtonPress();
    let email = this.email;
    let password = this.state.password;
    
    let studentProfile = await Verification.getStudent(email);
    if (studentProfile){
      this._createAccount(email, password);
    } else {
      Verification.doesNotExist();
    }
  }

  _createAccount(email, password) {
    /* Passing to firebase authentication function here */
    this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
      // Success case
      .then((user) => {
        Verification.sendEmail(user);
      })
      // Failure case: Signup Error
      .catch((error) => {
        AuthErrors.handleSignupError(error);
      })
  }

  /*************************** Forgot Password ***************************/

  _forgotPassword() {
    this.props.setEmailInput(this.state.email_input);
    this._goToForgotPassword();
  }

  /*************************** Navigation ***************************/

  _goToForgotPassword() {
    this.props.navigator.replace({
      name: ForgotPasswordPage
    })
  }

  _goToCreateProfilePage() {
    this.props.navigator.replace({
      name: CreateProfilePage
    });
  }

  render() {
    return (
      <Image source={require("./img/bg.png")} style={AuthStyle.container}>
        <View style={AuthStyle.logoContainer}>
          <Image source={require('./img/logo.png')} style={AuthStyle.logo}/>
        </View>
        <View style={AuthStyle.body}>
          <Text style={AuthStyle.textTitles}> Tufts Email: </Text>
          <View style={AuthStyle.emailInputBorder}>
            <TextInput
              style={AuthStyle.emailInput}
              onChangeText={(text) => this.setState({email_input: text})}
              value={this.state.email_input}
            />
            <Text style={AuthStyle.emailExt}> {this.props.email_ext} </Text>
          </View>

          <Text style={AuthStyle.textTitles}> Password: </Text>
          <View style={AuthStyle.passwordInputBorder}>
          <TextInput
            style={AuthStyle.passwordInput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
          />
          </View>
          <RectButton
              style={[AuthStyle.forgotPasswordButton]}
              textStyle={AuthStyle.forgotPasswordButtonText}  
              onPress={this._forgotPassword.bind(this)}
              text="Forgot Password?"
          />

          <View style={styles.buttonContainer}>
            <RectButton
              style={[AuthStyle.solidButton, AuthStyle.buttonBlue]}
              textStyle={[AuthStyle.solidButtonText, AuthStyle.bold]}
              onPress={this._login.bind(this)}
              text="LOGIN"
            />

            <RectButton
              style={[AuthStyle.solidButton, AuthStyle.buttonPink]}
              textStyle={AuthStyle.solidButtonText}
              onPress={this._signup.bind(this)}
              text="SIGNUP!"
            />
          </View>
        <Image/>
        </View>
      </Image>
    );
  }
}

var styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 30,
  },
})

export default LoginPage;
