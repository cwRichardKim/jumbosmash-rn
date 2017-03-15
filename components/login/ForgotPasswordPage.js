'use strict';

/*
This page is the current representation of a logged in user.
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

import LoginPage              from './LoginPage.js';
import FormatInput            from './FormatInput.js';

const PageNames = require("../global/GlobalFunctions.js").pageNames();

class forgotPasswordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email_input: null,
    }
  }

  forgotPassword() {
    if (!this.state.email_input) {
      Alert.alert("please type in your email address");
    } else {
      let email = FormatInput.email(this.state.email_input, this.props.email_ext);

      this.props.firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert("We've sent you an email with further instructions. Contact us @ ________________ if you think there's still an issue.");
          this.props.navigator.push({
            component: LoginPage
          });
        })
        .catch((error) => {
          throw error;
          Alert.alert("sorry, an error occured! Please contact us @ ________________.");
        })
    }
  }

  goToLoginPage() {
    this.props.navigator.push({
      component: LoginPage
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

          <Button
            onPress={this.forgotPassword.bind(this)}
            title="I forgot my password!"
            accessibilityLabel="I forgot my password!"
          />

          <Button
            style={styles.button}
            onPress={this.goToLoginPage.bind(this)}
            title="I remember my password, go to Login"
            accessibilityLabel="I remember my password, go to login"
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

export default forgotPasswordPage;
