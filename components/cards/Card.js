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
  Image
} from 'react-native';

class Card extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{uri: (this.props.photos && this.props.photos.length >= 1) ? this.props.photos[0] : 'https://img2.greatnotions.com/StockDesign/XLarge/King_Graphics/m0410.jpg'}} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{this.props.firstName}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: '#DDDDDD',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 1,
    flex: 1,
  },
  thumbnail: {
    flex: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  }
});

Card.propTypes = {
  //TODO: add the expected property types (name, email, picture, etc)
};

Card.defaultProps = {
  //TODO: create default prop types when some stuff is screwed up
};

export default Card;
