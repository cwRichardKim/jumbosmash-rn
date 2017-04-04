'use strict';

/*

This page handles the creation of an user.
It is mainly responsible for retreiving email and password 
from UI textinput boxes, and passing to firebase authentication.
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
  Image,
} from 'react-native';

import LoginPage              from './LoginPage.js';
import AuthErrors             from './AuthErrors.js';
import Verification           from './Verification.js';
import FormatInput            from './FormatInput.js';
import RectButton             from "../global/RectButton.js";

const AuthStyle = require('./AuthStylesheet');

class SignupPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email_input: '',
      password:'',
    }
  }

  async _signup() {
    if (!this.state.email_input) {
      Alert.alert("Please type in your email address");
    } else {
      this.props.setEmailInput(this.state.email_input);
      let email = FormatInput.email(this.state.email_input, this.props.email_ext);
      let password = this.state.password;

      let studentProfile = await Verification.getStudent(email);
      if (studentProfile){
        this._createAccount(email, password);
      } else {
        Verification.doesNotExist();
      }
    }
  }

  _createAccount(email, password) {
    /* Passing to firebase authentication function here */
    this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
      // Success case
      .then((user) => {
        Verification.sendEmail(user);
        this._goToLoginPage();
      })
      // Failure case: Signup Error
      .catch((error) => {
        AuthErrors.handleSignupError(error);
      })
  }

  _goToLoginPage() {
    this.props.navigator.replace({
      name: LoginPage
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
              placeholder={this.props.emailInput}
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

          <View style={AuthStyle.buttonContainer}>
            <RectButton 
              style={[AuthStyle.solidButton]}
              textStyle={AuthStyle.solidButtonText} 
              onPress={this._signup.bind(this)}
              text="SIGNUP!"
            />

            <RectButton 
              style={[AuthStyle.noBackgroundButton]}
              textStyle={AuthStyle.noBackgroundButtonText}  
              onPress={this._goToLoginPage.bind(this)}
              text="Already have an account?"
            />

          </View>
        </View>
      </Image>
    );
  }
}

var styles = StyleSheet.create({


})

export default SignupPage;
