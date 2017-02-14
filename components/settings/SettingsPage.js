'use strict';

/*
This file is the main settings page. It is responsible for providing the relevant
data to the subcomponents
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: props.photos ? props.photos : [],
      firstName: props.firstName ? props.firstName : "",
      lastName: props.lastName ? props.lastName : "",
      description: props.description ? props.description : "",
      major: props.major ? props.major : "",
    }
  }

  render() {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text>Soon to be Settings</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default SettingsPage;
