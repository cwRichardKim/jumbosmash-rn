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
      email_input: '',
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

    var email = this.state.email_input + this.props.email_ext;
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
          <View style={styles.textinput}>
            <TextInput
              style={styles.first}
              onChangeText={(text) => this.setState({email_input: text})}
              value={this.state.email_input}
              placeholder={"Enter your username"}
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
