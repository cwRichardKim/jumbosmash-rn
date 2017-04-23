'use strict';

/*
This file is simply a react native Image that shows a gray background
with a loading indicator when the image hasn't loaded yet.

props
source: (same as image source)
_key: for image reuse, "key" is reserved, so must use "_key"
style: JSX style class for image container view
imageStyle: style for image (necessary for android because no overflow: hidden)
backgroundStyle: style for loading background (necessary for android because no overflow: hidden)
circleClippingStyle: JSX style class necessary for Android since it doesn't respect Overflow
*/

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
    Animated,
} from 'react-native';

import GlobalStyles     from "../global/GlobalStyles.js";
import GlobalFunctions  from "../global/GlobalFunctions.js";

const IS_ANDROID = Platform.OS === 'android';

class LoadableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImageLoading: true,
      thumbnailOpacity: new Animated.Value(0),
      isThumbnailLoading: true,
    }
  }

  _photoFetchError() {
    // TODO @richard fix / replace this with better image or something
    console.log("image failed to load: ".concat(this.props.source));
  }

  _thumbnailLoadStart() {
    this.setState({isThumbnailLoading: true});
  }

  _thumbnailLoadEnd() {
    this.setState({isThumbnailLoading: false});
    if (this.state.isImageLoading) {
      Animated.timing(
        this.state.thumbnailOpacity,
        {
          toValue: 1,
          duration: 200,
        }
      ).start();
    }
  }

  _imageLoadEnd() {
    this.setState({isImageLoading: false}, ()=>{
      Animated.timing(
        this.state.thumbnailOpacity,
        {
          toValue: 0,
          duration: 200,
        }
      ).start();
    })
  }

  _shouldRenderThumbnail() {
    if (this.props.thumbnail) {
      return(
        <Animated.Image
          style={[GlobalStyles.absoluteCover, styles.thumbnail, {opacity: this.state.thumbnailOpacity}, this.props.imageStyle]}
          source={this.props.thumbnail}
          onLoadStart={this._thumbnailLoadStart.bind(this)}
          onLoadEnd={this._thumbnailLoadEnd.bind(this)}
          onError={this._photoFetchError.bind(this)}
          key={this.props._key ? this.props._key+"small" : ""}
        />
      );
    }
  }

  _shouldRenderFixCircleClipping () {
    if (IS_ANDROID && this.props.circleClippingStyle) {
      return (
        <View style={this.props.circleClippingStyle}/>
      );
    } else {
      return null;
    }
  }

  // neither have loaded
  // thumbnail loads and then photo loads
  // photo loads and then thumbnail loads, don't show thumbnail

  render() {
    let propsLoading = this.props.isImageLoading;
    let thumbnailExists = this.props.thumbnail;
    let thumbnailLoading = this.state.isThumbnailLoading;
    let imageLoading = this.state.isImageLoading;

    let hideImage = propsLoading || imageLoading;

    let shouldAnimate = hideImage || (thumbnailExists && thumbnailLoading);
    return (
      <View style={[this.props.style, styles.container]}>
        <View style={[GlobalStyles.absoluteCover, styles.loadingPage, this.props.backgroundStyle]}>
          <ActivityIndicator animating={shouldAnimate}/>
        </View>
        <Image
          style={[styles.image, {opacity: hideImage ? 0.0 : 1.0}, this.props.imageStyle]}
          source={this.props.source}
          defaultSource={require("./images/error.png")}
          onLoadStart={()=>{this.setState({isImageLoading: true})}}
          onLoadEnd={this._imageLoadEnd.bind(this)}
          onError={this._photoFetchError.bind(this)}
          key={this.props._key ? this.props._key : ""}
        />
        {this._shouldRenderThumbnail()}
        {this._shouldRenderFixCircleClipping()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: IS_ANDROID ? null: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  thumbnail: {
    resizeMode: 'cover',
  },
  loadingPage: {
    backgroundColor: GlobalFunctions.style().lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default LoadableImage;
