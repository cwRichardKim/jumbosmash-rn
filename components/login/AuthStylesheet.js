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
    height: 40,
    alignSelf: 'flex-end',
  },
  forgotPasswordButtonText: {
    color: 'white',
    fontWeight: '400'
  },
  buttonContainer: {
    marginTop: 30,
  },
  solidButton: {
    height: 40,
    width: 180,
    marginTop: 15,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  solidButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  noBackgroundButton: {
    marginTop: 10,
    height: 40,
    width: 180,
  },
  noBackgroundButtonText: {
    color: 'white',
    fontWeight: '400'
  }
});