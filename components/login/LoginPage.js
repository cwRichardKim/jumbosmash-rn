'use strict';

/*
This file is the parent file for the entire swiping mechanism. It should control
the data, make the requests, and delegate the UI / swiping to DeckView
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';

import Swiper from 'react-native-swiper'; /* find one FROM facebook */

const onButtonPress = () => {
  // Alert.alert('Button has been pressed!');
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      isGood: false, //
    }
  }

  render() {
    return (
      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide}>
        <Text style={styles.text}>Let's get you set up.</Text>
        </View>
        <View style={styles.slide}>
          <TextInput style={styles.name}
            placeholder="First Name"
            onChangeText={(text) => this.setState({firstName})}
          />
          <TextInput style={styles.name}
            placeholder="Last Name"
            onChangeText={(text) => this.setState({lastName})}
          />
        </View>
        <View style={styles.slide}>
          <Text style={styles.text}>Smile! Upload a photo: </Text>
        </View>
        <View style={styles.slide}>
          <Text style={styles.text}>You're all set! </Text>
          <Button
            onPress={onButtonPress}
            title="Let's start"
            color="#841584"
            accessibilityLabel="JumboSmash account creation completed!"
            enabled={this.state.isGood} //
          />
        </View>
      </Swiper>
    );
  }
}
/*
Questions:
  - overall setup of each card --> get that right, how should i separate?
    Should each slide be its own js that renders a slide specifically?
  - CSS --> cleaned up? Can one item have multiple classes? can they be nested?
  - Cleaner way of doing things
*/

// <Text style={styles.text}>Gender:</Text>
// <Text style={styles.text}>Description:</Text>

var styles = StyleSheet.create({
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 20,
  },
  name: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 160,
  }
})

export default LoginPage;
