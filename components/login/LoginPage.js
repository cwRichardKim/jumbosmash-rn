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

import ForgotPasswordPage     from './ForgotPasswordPage.js';
import SignupPage             from './SignupPage.js';
import CreateProfilePage      from './CreateProfilePage.js'

const PageNames = require("../global/GlobalFunctions.js").pageNames();
const AuthStyle = require('./AuthStylesheet');

class LoginPage extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      email_input: this.props.emailInput || null,
      password:'',
    }
  }

  async _login(){

    if (!this.state.email_input) {
      Alert.alert("Please type in your email address");
    } else {
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
      <Image source={require("./img/bg.png")} style={AuthStyle.container}>
        <View style={AuthStyle.body}>
          <View style={AuthStyle.logoPadding}>
            <Image source={require('./img/logo.png')} style={AuthStyle.logo}/>
          </View>

          <View style={AuthStyle.textInputArea}>
            <Text style={AuthStyle.textTitles}> Tufts Email: </Text>
            <View style={AuthStyle.textinputBorder}>
              <TextInput
                style={AuthStyle.first}
                onChangeText={(text) => this.setState({email_input: text})}
                value={this.state.email_input}
                placeholder={this.props.emailInput}
              />
              <Text style={AuthStyle.last}> {this.props.email_ext} </Text>
            </View>
          </View>

          <View style={AuthStyle.textInputArea}>  
            <Text style={AuthStyle.textTitles}> Password: </Text>
            <View style={AuthStyle.textinputBorder}>
            <TextInput
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              secureTextEntry={true}
              placeholder={"Password"}
            />
            </View>
          </View>
          <Button
            style={AuthStyle.forgotPasswordButton}
            onPress={this._goToForgotPassword.bind(this)}
            title="Forgot password?"
            accessibilityLabel="Forgot password?"
          />

          <Button
            style={AuthStyle.button}
            onPress={this._login.bind(this)}
            title="Login"
            accessibilityLabel="Login"
          />

          <Button
            style={AuthStyle.button}
            onPress={this._goToSignupPage.bind(this)}
            title="New here? Go to Signup"
            accessibilityLabel="Go to signup page"
          />
        <Image/>
        </View>
      </Image>
    );
  }
}

var styles = StyleSheet.create({

})

export default LoginPage;
