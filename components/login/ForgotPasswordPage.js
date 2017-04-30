'use strict';

/*

This page is handles when a user forgot their password.
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
} from 'react-native';

import LoginPage              from './LoginPage.js';
import FormatInput            from './FormatInput.js';
import RectButton             from "../global/RectButton.js";

const PageNames = require("../global/GlobalFunctions.js").pageNames();
const AuthStyle = require('./AuthStylesheet');

class ForgotPasswordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email_input: this.props.emailInput || null,
      isLoading: false,
    }
  }

  _forgotPassword() {
    if (!this.props.isConnected) {
      Alert.alert("Sorry, no connection :(");
    } else if (!this.state.email_input) {
        Alert.alert("Please type in your email address");
    } else {

      this.setState({isLoading: true});

      this.props.setEmailInput(this.state.email_input);
      let email = FormatInput.email(this.state.email_input, this.props.email_ext);

      this.props.firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert("We've sent you an email to reset your password. If you run into any additional issues, contact us team@jumbosmash.com");
          this.setState({isLoading: false});

          // this._goToLoginPage(); // TODO: why doesn't this function call work!
          this.props.navigator.replace({
            name: LoginPage
          });
        })
        .catch((error) => {
          this.setState({isLoading: false});
          Alert.alert("Sorry, an error occured. Contact us at team@jumbosmash.com with a summary of your issue.");
        })
    }
  }


  _goToLoginPage() {
    this.props.navigator.replace({
      name: LoginPage
    });
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
        <View style={[AuthStyle.container, AuthStyle.centerAlign]}>
          <View style={AuthStyle.logoContainer}>
            <View style={AuthStyle.logoTopMargin}>
            </View>
            <Image source={require('./img/logo.png')} style={AuthStyle.logo}/>
          </View>
          <View style={AuthStyle.body}>
            <Text style={AuthStyle.textTitles}> Tufts Email: </Text>
            <View style={AuthStyle.emailInputBorder}>
              <TextInput
                style={AuthStyle.emailInput}
                onChangeText={(text) => this.setState({email_input: text})}
                keyboardType="email-address"
                returnKeyType="done"
                value={this.state.email_input}
                placeholder={this.props.emailInput}
              />
              <Text style={AuthStyle.emailExt}> {this.props.email_ext} </Text>
            </View>

            <View style={styles.buttonContainer}>
              <RectButton
                style={[AuthStyle.solidButton, AuthStyle.buttonBlue]}
                textStyle={[AuthStyle.solidButtonText, AuthStyle.bold]}
                onPress={this._forgotPassword.bind(this)}
                text="Reset Password"
              />

              <RectButton
                style={[AuthStyle.noBackgroundButton]}
                textStyle={AuthStyle.noBackgroundButtonText}
                onPress={this._goToLoginPage.bind(this)}
                text="JK! Take me back to login"
              />
            </View>
          </View>
        </View>
        </Image>
      );
    }
  }
}

var styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 160,
  },

})

export default ForgotPasswordPage;
