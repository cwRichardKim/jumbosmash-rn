'use strict';

/*
This file is responsible for providing the zoomed in card view after tapping on a card
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

//TODO: @richard Make a carousel on the photos
class ProfileCardView extends Component {
  render() {
    return (
      <TouchableWithoutFeedback style={styles.touchArea}
        onPress={this.props.onPress}>
        <View style={styles.card}>
          <Image style={styles.thumbnail} source={{uri: (this.props.photos && this.props.photos.length >= 1) ? this.props.photos[0] : 'https://img2.greatnotions.com/StockDesign/XLarge/King_Graphics/m0410.jpg'}} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{this.props.firstName}{"\n"}{this.props.description}{"\n"}[This is where the rest of the description would go]</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  touchArea: {
    flex: 1,
  },
  card: {
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    flex: 1,
  },
  thumbnail: {
    flex: 2,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  }
});

ProfileCardView.propTypes = {
  //TODO: add the expected property types (name, email, picture, etc)
};

ProfileCardView.defaultProps = {
  //TODO: create default prop types when some stuff is screwed up
};

export default ProfileCardView;
