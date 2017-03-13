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

import LoginPage              from './LoginPage.js';
import AuthErrors             from './AuthErrors.js';
import VerifyDatabase         from './VerifyDatabase.js';
import VerifyEmailActivation  from './VerifyEmailActivation.js'

class SignupPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email_input: '',
      password:'',
    }
  }

  async signup() {

    let email = this.formatEmail();
    let password = this.state.password;

    (await VerifyDatabase.doesStudentExist(email)) ? this.createAccount(email, password) : VerifyDatabase.doesNotExist();

  }

  formatEmail() {
    let em = (this.state.email_input).toLowerCase().trim() + this.props.email_ext;
    return em;
  }

  createAccount(email, password) {
    /* Passing to firebase authentication function here */
    this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
      // Success case
      .then((user) => {
        VerifyEmailActivation.sendEmail(user);
      })
      // Failure case: Signup Error
      .catch((error) => {
        AuthErrors.handleSignupError(error);
      })
  }

  goToLoginPage() {
    this.props.navigator.push({
      component: SignupPage
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
