'use strict';

/*
styles used globally
usage example:
import GlobalStyles from './GlobalStyles.js'
*/

import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';

module.exports = StyleSheet.create({
  absoluteCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  basicShadow: {
    // android shadow
    elevation: 3,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 14,
    shadowOpacity: 0.06,
  },
  buttonShadow: {
    // android shadow
    elevation: 3,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
  lowButtonShadow: {
    // android shadow
    elevation: 2,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.05,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Avenir Next',
  },
});
