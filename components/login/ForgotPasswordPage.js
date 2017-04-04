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
} from 'react-native';

import LoginPage              from './LoginPage.js';
import FormatInput            from './FormatInput.js';

const PageNames = require("../global/GlobalFunctions.js").pageNames();
const AuthStyle = require('./AuthStylesheet');

class ForgotPasswordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email_input: null,
    }
  }

  _forgotPassword() {
    if (!this.state.email_input) {
      Alert.alert("Please type in your email address");
    } else {
      this.props.setEmailInput(this.state.email_input);
      let email = FormatInput.email(this.state.email_input, this.props.email_ext);

      this.props.firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert("We've sent you an email to change your password. If you run into any additional issues, contact us team@jumbosmash.com");
          // this._goToLoginPage(); // TODO: why doesn't this function call work!
          this.props.navigator.replace({
            name: LoginPage
          });
        })
        .catch((error) => {
          throw error;
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

          <Button
            onPress={this._forgotPassword.bind(this)}
            title="I forgot my password!"
            accessibilityLabel="I forgot my password!"
          />

          <Button
            style={styles.button}
            onPress={this._goToLoginPage.bind(this)}
            title="I remember my password, go to Login"
            accessibilityLabel="I remember my password, go to login"
          />

        </View>
      </Image>
    );
  }
}

var styles = StyleSheet.create({
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

export default ForgotPasswordPage;
