'use strict';

/*
This file is simply a react native Image that shows a gray background
with a loading indicator when the image hasn't loaded yet.

props
source: (same as image source)
_key: for image reuse, "key" is reserved, so must use "_key"
style: JSX style class
*/

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
    Alert,
    Animated,
} from 'react-native';

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
          style={[styles.thumbnail, {opacity: this.state.thumbnailOpacity}]}
          source={this.props.thumbnail}
          onLoadStart={this._thumbnailLoadStart.bind(this)}
          onLoadEnd={this._thumbnailLoadEnd.bind(this)}
          onError={this._photoFetchError.bind(this)}
          key={this.props._key ? this.props._key+"small" : ""}
        />
      );
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
        <View style={[styles.loadingPage]}>
          <ActivityIndicator animating={shouldAnimate}/>
        </View>
        <Image
          style={[styles.image, {opacity: hideImage ? 0.0 : 1.0}]}
          source={this.props.source}
          defaultSource={require("./images/turtle.jpg")}
          onLoadStart={()=>{this.setState({isImageLoading: true})}}
          onLoadEnd={this._imageLoadEnd.bind(this)}
          onError={this._photoFetchError.bind(this)}
          key={this.props._key ? this.props._key : ""}
        />
      {this._shouldRenderThumbnail()}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  thumbnail: {
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  loadingPage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F0F0F0",
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default LoadableImage;
