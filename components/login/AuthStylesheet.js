'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Dimensions,
} = React;

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems:'center',
    width: width,
    height: height,
  },
  logoContainer: {
    height: height * (1/3),
    flexDirection: 'column'
  },
  logo: {
    marginTop: ((height / 3)  - 100) * 0.5, 
    height: 100,
    width: 94,
    alignSelf: 'flex-end'
  },
  body: {
    height: height * (2/3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailInputBorder: {
    height: 40,
    borderColor: 'white',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    width: 270,
  },
  emailInput: {
    flex: 3/5,
    color: 'white',
  },
  emailExt: {
    flex: 2/5,
    alignSelf: 'center',
    color: 'white',
    letterSpacing: 2,
  },
  passwordInputBorder: {
    height: 40,
    borderColor: 'white',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    width: 270,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
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
    fontWeight: '400',
    opacity: 0.75,
    fontStyle: 'italic',
  },
  solidButton: {
    height: 40,
    width: 180,
    marginTop: 15,
    borderRadius: 5,
  },
  solidButtonText: {
    color: 'white',
  },
  noBackgroundButton: {
    marginTop: 10,
    height: 40,
    width: 180,
  },
  noBackgroundButtonText: {
    color: 'white',
    fontWeight: '400'
  },
  buttonBlue: {
    backgroundColor: '#8787B2',
  },
  buttonPink: {
    backgroundColor: '#A17990',
  },
  bold: {
    fontWeight: '600',
  },
});