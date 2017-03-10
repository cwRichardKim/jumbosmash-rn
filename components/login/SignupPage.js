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
  Button,
  Navigator
} from 'react-native';

import AccountPage            from './AccountPage.js';
import AuthErrors             from './AuthErrors.js';
import Redirect               from './Redirect.js';

class SignupPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email_input: '',
      password:'',
    }
  }

  signup() {

    var firebase_auth = this.props.firebase.auth(); // TODO: global(?)

    var email = this.state.email_input + this.props.email_ext; 
    var password = this.state.password;

    /* Passing to firebase authentication function here */
    firebase_auth.createUserWithEmailAndPassword(email, password)
      // Success case
      .then(() => {
        this.goToAccountPage();
      })
      // Failure case: Signup Error
      .catch((error) => {
        AuthErrors.handleSignupError(error);
      })

    // TODO: Think about email confirmation? => right now i can create an account for *any* email address
  }

  // TODO: move to redirect
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
              placeholder={"Enter your tufts email"}
            />
            <Text style={styles.last}> {this.props.email_ext} </Text>
          </View>

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
            onPress={Redirect.goToLoginPage.bind(this)}
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

export default SignupPage;