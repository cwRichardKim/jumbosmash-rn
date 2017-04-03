'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    width: null,
    height: null,
  },
  body: {
    flex: 9,
    alignItems: 'center',
  },
  logo: {
  	height: 100,
  	width: 94,
  },
  logoPadding: {
  	paddingBottom: 60,
  },
  textinputBorder: {
    height: 40,
    borderColor: 'white',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    width: 300,
  },
  first: {
    flex: 3/4,
  },
  last: {
    flex: 1/4,
    alignSelf: 'center',
    color: 'white',
  },
  textTitles: {
  	color: 'white',
  	paddingTop: 30,
  	fontSize: 15,
  },
  forgotPasswordButton: {
  	color: 'white',
  	fontSize: 12,
    paddingTop: 50,
  }

});