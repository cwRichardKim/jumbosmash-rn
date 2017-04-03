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
      throw error;
      Alert.alert("there's been an error!");
    }
  }

  static doesNotExist(email) {
    Alert.alert("I'm sorry, you're not in our database as a Tufts Senior. Contact _______________ if you think this is a mistake");
  }

  static sendEmail(user) {
    user.sendEmailVerification()
      .then(() => {
        Alert.alert("We've sent you an email, please verify your email account.");
      })
  }

}

export default Verification;
