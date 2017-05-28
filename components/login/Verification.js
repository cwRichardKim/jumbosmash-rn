'use strict';

/*
This page is responsible for verifying:
  - user has verified email
  - user exists in student database
*/

import React, {Component} from 'react';
import {
  Alert,
} from 'react-native';

class Verification extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static async getStudent(email) {
    let url = "https://jumbosmash2017.herokuapp.com/student/email/" + email;

    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      return responseJson || null;
    } catch (error) {
      Alert.alert("There's been an error. Please try again, and if it persists, please email us at team@jumbosmash.com");
    }
  }

  static doesNotExist(email) {
    Alert.alert("I'm sorry, you're not in our database as a Tufts Senior. Contact team@jumbosmash.com if you think this is a mistake");
  }

  static sendEmail(user) {
    user.sendEmailVerification()
      .then(() => {
        Alert.alert("We've sent you a verification email. Please login after verifying your account.");
      })
      .catch((error) => {
        Alert.alert("There's an error with verifying your email. Please email us at team@jumbosmash.com");
      })
  }

}

export default Verification;
