'use strict';

/*
This page handles all communication with the firebase database: STUDENT
*/

import React, {Component} from 'react';
import {
  Alert,
} from 'react-native';

class VerifyEmailActivation extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static sendEmail(user) {

    user.sendEmailVerification()
      .then(() => {
        Alert.alert("we've sent you an email, please verify your email account.");
      })
  }

}

export default VerifyEmailActivation;
