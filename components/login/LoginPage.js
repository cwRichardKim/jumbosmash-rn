'use strict';

/*
This file handles if you already have an account, and want to login.
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

import SignupPage             from "./SignupPage.js";
import AccountPage            from "./AccountPage.js";

class LoginPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password:'',
    }
  }

  handleLoginError(error) {
    var errorCode = error.code;
    switch(errorCode) {
      case "auth/invalid-email":
        Alert.alert("The email is not valid.");
        break;
      case "auth/user-disabled":
        Alert.alert("User is not enabled.");
        break;
      case "auth/user-not-found":
        Alert.alert("User not found. Create an account!");
        break;
      case "auth/wrong-password":
        Alert.alert("Incorrect password.");
        break;
      default:
        Alert.alert("Error. Please try again.");
        break;
    }
  }

  login(){

    var firebase_auth = this.props.firebase.auth();

    var email = this.state.email; // same verification that email is Tufts(?)
    var password = this.state.password;

    firebase_auth.signInWithEmailAndPassword(email, password)
      // Success case
      .then(() => {
        this.goToAccountPage();
      })
      // Failure case: Login Error
      .catch((error) => {
        this.handleLoginError(error);
      })
  }


 // TODO: Move these functions 
  goToSignup(){
    this.props.navigator.push({
      component: SignupPage
    });
  }

  goToAccountPage() {
    this.props.navigator.push({
      component: AccountPage
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}
            placeholder={"Email Address"}
          />

          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
          />

          <Button
            onPress={this.login.bind(this)}
            title="Login"
            accessibilityLabel="Login"
          />

          <Button
            onPress={this.goToSignup.bind(this)}
            title="New here? Go to Signup"
            accessibilityLabel="Go to signup page"
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
  textinput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
  button: {
  }
})

export default LoginPage;
