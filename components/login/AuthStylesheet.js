'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    width: null,
    height: null,
  },
  logo: {
    height: 100,
    width: 94,
  },
  logoContainer: {
    top: 100,
  },
  body: {
    alignItems: 'center',
    marginTop: 150,
  },
  emailInputBorder: {
    height: 40,
    borderColor: 'white',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    width: 300,
  },
  emailInput: {
    flex: 3/4,
  },
  emailExt: {
    flex: 1/4,
    alignSelf: 'center',
    color: 'white',
  },
  passwordInputBorder: {
    height: 40,
    borderColor: 'white',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    width: 300,
  },
  passwordInput: {
    flex: 1,
  },
  textTitles: {
  	color: 'white',
  	paddingTop: 30,
  	fontSize: 15,
    alignSelf: 'flex-start',
  },
  forgotPasswordButton: {
  	color: 'white',
  	fontSize: 12,
    paddingTop: 50,
  }

});