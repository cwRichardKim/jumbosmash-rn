'use strict';

/*
This file handles if you already have an account, and want to login.
This is also the first page that AuthContainer pushes to. It has
the authlistener attached, and checks if user should be seeing
AccountPage or LoginPage.
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

import SignupPage             from './SignupPage.js'
import AccountPage            from './AccountPage.js';
import AuthErrors             from './AuthErrors.js';

class LoginPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      email_input: '',
      password:'',
    }
  }

  componentWillMount() {
    // Adding listener here
    this.unsubscribe = this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user.emailVerified) {
          this.props.navigator.push({
            component: AccountPage
          });
        } else {
          Alert.alert("Please verify your email.");
        }
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe(); // Removing listener
  }


  login(){

    var email = this.state.email_input + this.props.email_ext;
    var password = this.state.password;

    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
      // Listener should take care of re-directing, we only
      // need to catch errors
      .catch((error) => {
        AuthErrors.handleLoginError(error);
      })
  }

  goToSignupPage() {
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
            onPress={this.goToSignupPage.bind(this)}
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
