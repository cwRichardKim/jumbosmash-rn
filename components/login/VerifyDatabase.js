'use strict';

/*
This page handles all communication with the firebase database: STUDENT
*/

import React, {Component} from 'react';
import {
  Alert,
} from 'react-native';

class VerifyDatabase extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static async doesStudentExist(email) {
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

}

export default VerifyDatabase;
