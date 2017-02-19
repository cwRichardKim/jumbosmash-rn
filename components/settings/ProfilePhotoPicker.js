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
  Alert,
} from 'react-native';

import Button       from "./Button.js"
import ImagePicker  from 'react-native-image-crop-picker';
// import RNFetchBlob  from 'react-native-fetch-blob'

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

  _photoExists(index) {
    return this.props.photos && this.props.photos.length > index && this.props.photos[index];
  }

  _shouldRenderImageWithIndex(index, styles) {
    if (this._photoExists(index)) {
      return (
        <Image style={styles} source={{uri: this.props.photos[index]}}/>
      );
    } else {
      return (
        <View style={styles}/>
      )
    }
  }

  _changePhotoWithIndex(index, newPhoto) {
    if (this.props.updateProfile) {
      var photos = this.props.photos.slice();
      photos[index] = newPhoto;
      this.props.updateProfile({"photos": photos});
    } else {
      Alert.alert(
        'Something went wrong!',
        'We couldn\'t update your photo :( Try quitting the app and if the issue comes up again, let us know at team@jumbosmash.com',
        [
          {text: 'OK', onPress: () => {}},
        ],
      );
    }
  }

  _uploadPhotoToFirebase(image) {
    //TODO: @richard
    // https://github.com/CodeLinkIO/Firebase-Image-Upload-React-Native
    // https://jsapp.me/image-upload-in-react-native-with-firebase-storage-50e09ee0f6f8#.ol80aagoa
  }

  _photoButtonPressedForPhotoIndex(index) {
    if (this._photoExists(index)) {
      this._changePhotoWithIndex(index, null)
    } else {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true
      }).then(image => {
        //TODO: @richard some kind of size control
        this._uploadPhotoToFirebase(image);
      }).catch(error => {
        let userCancelled = error["code"].includes("CANCELLED");
        if (userCancelled) {
          // potentially handle cancelled condition
        }
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.majorPhotoView}>
          {this._shouldRenderImageWithIndex(0, [styles.majorPhoto, styles.photo])}
          <Button
            style={styles.majorButton}
            source={(this._photoExists(0)) ? require("./images/removeButton.png") : require("./images/addButton.png")}
            onPress={() => this._photoButtonPressedForPhotoIndex(0)}
          />
        </View>
        <View style={styles.minorPhotosContainer}>
          <View style={styles.minorPhotoViewTop}>
            {this._shouldRenderImageWithIndex(1, [styles.minorPhoto, styles.photo])}
            <Button
              style={[styles.minorButton, {top: SMALL_PHOTO_WIDTH - 15}]}
              source={(this._photoExists(1)) ? require("./images/removeButton.png") : require("./images/addButton.png")}
              onPress={() => this._photoButtonPressedForPhotoIndex(1)}
            />
          </View>
          <View style={styles.minorPhotoViewBottom}>
            {this._shouldRenderImageWithIndex(2, [styles.minorPhoto, styles.photo])}
            <Button
              style={[styles.minorButton, {bottom: - 4}]}
              source={(this._photoExists(2)) ? require("./images/removeButton.png") : require("./images/addButton.png")}
              onPress={() => this._photoButtonPressedForPhotoIndex(2)}
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
    right: 0,
  },
});

export default ProfilePhotoPicker;
