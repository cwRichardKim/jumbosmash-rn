'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Dimensions,
  Platform,
} = React;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_ANDROID = Platform.OS === 'android';

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  centerAlign: {
    alignItems:'center',
  },
  logoContainer: {
    alignSelf:'center',
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
    borderColor: IS_ANDROID ? 'transparent' : 'white',
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
    justifyContent: 'flex-end',
    color: 'white',
    letterSpacing: 2,
  },
  passwordInputBorder: {
    height: 40,
    borderColor: IS_ANDROID ? 'transparent' : 'white',
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
