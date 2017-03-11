'use strict';

/*
This page handles all communication with the firebase database: STUDENT
*/

import React, {Component} from 'react';
import {
  Alert,
} from 'react-native';

class StudentDatabase extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static async validateTuftsSenior(email) {
    let url = "https://jumbosmash2017.herokuapp.com/student/email/" + email;
    let isFound = false;
  
    try {
      let response = await fetch(url);
      let responseJson = await response.json(); 
      (responseJson) ? isFound = true : isFound = false;
      return isFound;
    } catch (error) {
      throw error;
      Alert.alert("there's been an error!");
    }

  }

}

export default StudentDatabase;
