'use strict';

/*
Responsible for the icon that appears when the user swipes left
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

class Button extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <TouchableOpacity style={this.props.style} onPress={this.props.onPress}>
        <Image
          style={styles.image}
          source={this.props.source}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    flex: 1,
  }
});

export default Button;
