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
  ScrollView,
} from 'react-native';

import ProfilePhotoPicker from "./ProfilePhotoPicker.js"

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <ScrollView>
        <ProfilePhotoPicker photos={this.props.profile.photos}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
});

export default SettingsPage;
