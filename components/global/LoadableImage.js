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
} from 'react-native';

class LoadableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImageLoading: true,
    }
  }

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <Image
          style={styles.image}
          source={this.props.source}
          onLoadStart={()=>{this.setState({isImageLoading: true})}}
          onLoadEnd={()=>{this.setState({isImageLoading: false})}}
          key={this.props._key ? this.props._key : ""}
        />
        <View style={[styles.imageCover, {opacity: this.state.isImageLoading ? 1.0 : 0.0}]}>
          <ActivityIndicator animating={this.state.isImageLoading}/>
        </View>
      </View>
    )
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
  imageCover: {
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
