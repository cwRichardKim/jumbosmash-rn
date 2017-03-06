'use strict';

/*
This page handles account creation, mainly responsible for retreiving email and 
password from UI textinput boxes, and passing to firebase authentication.
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
  Navigator
} from 'react-native';

import LoginPage              from './LoginPage.js';
import AccountPage            from './AccountPage.js';

class SignupPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password:'',
    }
  }

  // TOOD: move error handling to different interface
  handleSignupError(error) {
    var errorCode = error.code;
        switch(errorCode) {
          case "auth/email-already-in-use":
            Alert.alert("The email is already in use. Retrieve password.");
            break;
          case "auth/invalid-email":
            Alert.alert("The email is not valid.");
            break;
          case "auth/operation-not-allowed":
            Alert.alert("Email account is not enabled.");
            break;
          case "auth/weak-password":
            Alert.alert("The password you've chosen is not strong enough.");
            break;
          default:
            Alert.alert("Error. Please try again.");
            break;
        }
  }

  signup() {

    var firebase_auth = this.props.firebase.auth(); // TODO: global(?)

    var email = this.state.email;  // TODO: enforce that email has to be @tufts.edu
    var password = this.state.password;

    /* Passing to firebase authentication function here */
    firebase_auth.createUserWithEmailAndPassword(email, password)
      // Success case
      .then(() => {
        this.goToAccountPage();
      })
      // Failure case: Signup Error
      .catch((error) => {
        this.handleSignupError(error);
      })

    // TODO: Think about email confirmation? => right now i can create an account for *any* email address
  }

  // TODO: Move these functions 
  goToLoginPage(){
    this.props.navigator.push({
      component: LoginPage
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
            placeholder={"Enter your email address"}
          />

          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Choose a password"}
          />

          <Button
            style={styles.button}
            onPress={this.signup.bind(this)}
            title="Signup"
            accessibilityLabel="Signup, creating an account"
          />

          <Button
            style={styles.button}
            onPress={this.goToLoginPage.bind(this)}
            title="Got an account, go to Login"
            accessibilityLabel="Already got an account, go to login"
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

export default SignupPage;
