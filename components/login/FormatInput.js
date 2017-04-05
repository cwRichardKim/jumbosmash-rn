'use strict';

/*
This class handles input validation and formatting. 
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

  static email(email_input, ext) {
    let em = (email_input).toLowerCase().trim() + ext;
    return em;
  }

}

export default FormatInput;
