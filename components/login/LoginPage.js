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
  ActivityIndicator,
  ScrollView,
  findNodeHandle,
  Platform,
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
const IS_ANDROID = Platform.OS === 'android';

class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.studentProfile = null;
    this.email = "";
    this.state = {
      emailInput: this.props.emailInput || null,
      password:'',
      isLoading: false,
    }
  }

  /* Handles current text input
     Called before Login and Signup
  */

  _inputValidation() {
    if (!this.props.isConnected) {
      Alert.alert("Sorry, no connection :(");
    } else if (!this.state.emailInput) {
        Alert.alert("Please type in your email address");
    } else {

      this.setState({isLoading: true});

      this.props.setEmailInput(this.state.emailInput);
      var email = FormatInput.email(this.state.emailInput, this.props.email_ext);
      this.email = email;
      var password = this.state.password;
    }
  }

  /*************************** Login ***************************/
  async _login() {
    await this._inputValidation();
    let email = this.email;
    let password = this.state.password;


    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user && !user.emailVerified) {
          this.setState({isLoading: false});
          Alert.alert("Please check your email, and verify your account before logging in. If you're experiencing issues, contact us at team@jumbosmash.com");
        } else if (user && user.emailVerified) {
          this.props.firebase.auth().currentUser
            .getToken(true)
            .then(async (token) => {

              // First checks if taken from signup
              let studentProfile = this.studentProfile;
              if (!studentProfile) {
                studentProfile = await Verification.getStudent(email);
              }

              this.props.setStudentProfile(studentProfile);
              this.props.setToken(token);

              let url = "https://jumbosmash2017.herokuapp.com/profile/id/".concat(studentProfile._id).concat("/").concat(token);
              try {
                let response = await fetch(url);
                let responseJson = await response.json();

                this.setState({isLoading: false});
                if (responseJson) {
                  // Authentication Process complete!
                  this.props.setMyProfile(responseJson);
                  this.props.loadPage(PageNames.appHome);
                } else {
                  this._goToCreateProfilePage();
                }
              } catch(error) {
                this.setState({isLoading: false});
                Alert.alert("There's been an error. Please try again, and if it persists, please email us at team@jumbosmash.com");
                throw error;
              }
            })
          }
        })
      .catch((error) => {
        this.setState({isLoading: false});
        AuthErrors.handleLoginError(error);
      })
  }

  /*************************** Signup ***************************/
  async _signup() {
    await this._inputValidation();
    let email = this.email;
    let password = this.state.password;

    let studentProfile = await Verification.getStudent(email);

    if (studentProfile){
      this.studentProfile = studentProfile;
      this._createAccount(email, password);
      // isloading gets set to false in createAccount
    } else {
      this.setState({isLoading: false});
      Verification.doesNotExist();
    }
  }

  _createAccount(email, password) {
    /* Passing to firebase authentication function here */
    this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
      // Success case
      .then((user) => {
        Verification.sendEmail(user);
        this.setState({isLoading: false});
      })
      // Failure case: Signup Error
      .catch((error) => {
        this.setState({isLoading: false});
        AuthErrors.handleSignupError(error);
      })
  }

  /*************************** Forgot Password ***************************/

  _forgotPassword() {
    this.props.setEmailInput(this.state.emailInput);
    this._goToForgotPassword();
  }

  /***************************** Navigation *****************************/

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

/******************** Handles Textinput Scrolling ********************/

  _inputFocused(refName) {
    setTimeout(() => {
    let scrollResponder = this.refs.scrollView.getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      findNodeHandle(this.refs[refName]),
      150, //additionalOffset
      true
    );
    }, 70);
  }

  _dismissFocus(refName) {
    setTimeout(() => {
    let scrollResponder = this.refs.scrollView.getScrollResponder();
    scrollResponder.scrollResponderScrollTo(
    )
  }, 0);
  }
  render() {
    if (this.state.isLoading) {
      return(
        <Image source={require("./img/bg.png")} style={AuthStyle.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color="white"/>
        </View>
        </Image>
      );
    } else {
      return (
        <Image source={require("./img/bg.png")} style={AuthStyle.container}>
        <ScrollView ref="scrollView" style={AuthStyle.container} contentContainerStyle={AuthStyle.centerAlign}>
          <View style={AuthStyle.logoContainer}>
            <Image source={require('./img/logo.png')} style={AuthStyle.logo}/>
          </View>
          <View style={AuthStyle.body}>
            <Text style={AuthStyle.textTitles}> Tufts Email: </Text>
            <View style={AuthStyle.emailInputBorder}>
                <TextInput
                  ref="emailInput"
                  style={AuthStyle.emailInput}
                  underlineColorAndroid="white"
                  keyboardType="email-address"
                  onChangeText={(text) => this.setState({emailInput: text})}
                  value={this.state.emailInput}
                  returnKeyType={"next"}
                  onFocus={this._inputFocused.bind(this, "emailInput")}
                  onBlur={this._dismissFocus.bind(this, "emailInput")}
                  onSubmitEditing={(event) => {
                    this.refs.passwordInput.focus();
                  }}
                />
              <Text style={AuthStyle.emailExt}> {this.props.email_ext} </Text>
            </View>

            <Text style={AuthStyle.textTitles}> Password: </Text>
            <View style={AuthStyle.passwordInputBorder}>
            <TextInput
              ref="passwordInput"
              style={AuthStyle.passwordInput}
              underlineColorAndroid="white"
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              secureTextEntry={true}
              returnKeyType={"done"}
              onFocus={this._inputFocused.bind(this, "passwordInput")}
              onBlur={this._dismissFocus.bind(this, "passwordInput")}
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
        </ScrollView>
        </Image>
      );
    }
  }
}

var styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 30,
  },
})

export default LoginPage;
