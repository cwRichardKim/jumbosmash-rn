'use strict';

/*
This file is responsible for the UI of a single card. Parent class should be
able to give it text and images and it should be able to lay it out correctly.
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

class Card extends Component {
  render() {
    return (
      <TouchableWithoutFeedback style={styles.touchArea}
        onPress={this.props.onPress}>
        <View style={styles.shadowView}>
          <View style={styles.card}>
            <Image style={styles.thumbnail} source={{uri: (this.props.photos && this.props.photos.length >= 1) ? this.props.photos[0] : 'https://img2.greatnotions.com/StockDesign/XLarge/King_Graphics/m0410.jpg'}} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{this.props.firstName}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

let borderRadius = 20;

const styles = StyleSheet.create({
  touchArea: {
    flex: 1,
  },
  shadowView: {
    flex: 1,
    borderRadius: borderRadius,

    // android shadow
    elevation: 3,
    shadowColor: '#000000',

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 14,
    shadowOpacity: 0.06,
  },
  card: {
    borderRadius: borderRadius,
    overflow: 'hidden',
    backgroundColor: 'white',
    flex: 1,
  },
  thumbnail: {
    flex: 1,
  },
  textContainer: {
    justifyContent: "center",
    minHeight: 60,
  },
  text: {
    padding: 20,
    fontSize: 20,
  }
});

Card.propTypes = {
  //TODO: add the expected property types (name, email, picture, etc)
};

Card.defaultProps = {
  //TODO: create default prop types when some stuff is screwed up
};

export default Card;
