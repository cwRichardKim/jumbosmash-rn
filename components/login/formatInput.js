'use strict';

/*
This is the first page. It sets up the navigator for authentication, and then
pushes to LoginPage.
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
  Navigator,
} from 'react-native';

class FormatInput extends Component {

  constructor(props){
    super(props);
    this.state = {

    };
  }

  static email(email_input, ext) {
    let em = (email_input).toLowerCase().trim() + ext;
    return em;
  }

}

export default FormatInput;
