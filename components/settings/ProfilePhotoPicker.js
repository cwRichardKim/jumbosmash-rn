'use strict';

/*
This file is the view for the photo picking section of the app in the settings
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';

import Button from "./Button.js"

let PHONE_WIDTH = Dimensions.get('window').width;
let PHONE_HEIGHT = Dimensions.get('window').height;
let LARGE_PHOTO_WIDTH = PHONE_WIDTH * 0.592;
let SMALL_PHOTO_WIDTH = PHONE_WIDTH * 0.267;

class ProfilePhotoPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.majorPhotoView}>
          <Image
            style={[styles.majorPhoto, styles.photo]}
            source={{uri: (this.props.photos && this.props.photos.length > 0) ? this.props.photos[0] : ''}}
          />
          <Button
            style={styles.majorButton}
            source={(this.props.photos && this.props.photos.length > 0) ? require("./images/removeButton.png") : require("./images/addButton.png")}
            onPress={() => {}}
          />
        </View>
        <View style={styles.minorPhotosContainer}>
          <View style={styles.minorPhotoViewTop}>
            <Image
              style={[styles.minorPhoto, styles.photo]}
              source={{uri: (this.props.photos && this.props.photos.length > 1) ? this.props.photos[1] : ''}}
            />
            <Button
              style={[styles.minorButton, {top: SMALL_PHOTO_WIDTH - 15}]}
              source={(this.props.photos && this.props.photos.length > 1) ? require("./images/removeButton.png") : require("./images/addButton.png")}
              onPress={() => {}}
            />
          </View>
          <View style={styles.minorPhotoViewBottom}>
            <Image
              style={[styles.minorPhoto, styles.photo]}
              source={{uri: (this.props.photos && this.props.photos.length > 2) ? this.props.photos[2] : ''}}
            />
            <Button
              style={[styles.minorButton, {bottom: - 4}]}
              source={(this.props.photos && this.props.photos.length > 2) ? require("./images/removeButton.png") : require("./images/addButton.png")}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    padding: 15,
    flexDirection: 'row',
  },
  majorPhotoView: {
  },
  photo: {
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  majorPhoto: {
    width: LARGE_PHOTO_WIDTH,
    height: LARGE_PHOTO_WIDTH,
    marginRight: PHONE_WIDTH * 0.053,
  },
  minorPhoto: {
    width: SMALL_PHOTO_WIDTH,
    height: SMALL_PHOTO_WIDTH,
  },
  minorPhotosContainer: {
    flexDirection: 'column',
  },
  minorPhotoViewTop: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  minorPhotoViewBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  majorButton: {
    position: 'absolute',
    height: 35,
    width: 35,
    left: LARGE_PHOTO_WIDTH - 28,
    bottom: -7,
  },
  minorButton: {
    position: 'absolute',
    height: 21,
    width: 21,
    right: -2,
  },
});

export default ProfilePhotoPicker;
