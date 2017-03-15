'use strict';

/*
page that shows after the app is finished / the server shut down
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import RectButton             from "../global/RectButton.js";
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

class ThankYouPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.buttonContainer}>
          </View>
          <RectButton
            style={[styles.button, styles.dummyButton]}
            text="load with dummy data"
            textStyle={{fontWeight:"600"}}
            onPress={()=>{}}
          />
          <RectButton
            style={[styles.button, styles.smashButton]}
            text="continue smashing"
            textStyle={{fontWeight:"600"}}
            onPress={()=>{}}
          />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    minHeight: 180,
    width: WIDTH,
    justifyContent: 'center',
  },
  button: {
    width: WIDTH - 40,
    height: 60,
  },
  dummyButton: {
    backgroundColor: "gray",
  },
  smashButton: {
    backgroundColor: "gray",
  },
});

  export default ThankYouPage;
