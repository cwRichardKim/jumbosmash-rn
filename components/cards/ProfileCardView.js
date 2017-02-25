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
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

import LoadableImage  from '../global/LoadableImage.js'

let Carousel = require('react-native-carousel');

const BORDER_RADIUS = 10;
const CLOSE_SCROLL_DISTANCE = 100;
const WIDTH = Dimensions.get('window').width;

//TODO: @richard Make a carousel on the photos
class ProfileCardView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollDistance: 0,
      pan: new Animated.ValueXY({x:0, y:0}),
      opacity: new Animated.Value(1),
    }
  }

  _handleScroll(event: Object) {
    this.setState({
      scrollDistance: event.nativeEvent.contentOffset.y
    });
  }

  _calculateOpacity() {
    const pullBuffer = 50;
    const maximumOpacity = 0.9;
    const minimumOpacity = 0.5;
    let distancePulled = this.state.scrollDistance;
    if (distancePulled < 0) {
      let opacityChange = maximumOpacity - minimumOpacity;
      let newOpacity = minimumOpacity + opacityChange * (CLOSE_SCROLL_DISTANCE + Math.min(distancePulled + pullBuffer, 0)) / CLOSE_SCROLL_DISTANCE;
      return newOpacity;
    }
    return maximumOpacity;
  }

  _closeProfileCard() {
    const animDuration = 300;
    Animated.parallel([
      Animated.timing(this.state.pan, {
        toValue: {x:0, y: this.props.pageHeight},
        duration: animDuration,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: animDuration,
      }),
    ]).start(function onComplete(){
      if (this.props.exitFunction) {
        this.props.exitFunction();
      }
    }.bind(this));
  }

  _releasedScrollView() {
    //TODO: implement closing via scrolling
  }

  _shouldRenderImageWithIndex(index) {
    if (this.props.photos && this.props.photos.length > index) {
      let imageContainerHeight = this.props.pageHeight * 3 / 4;
      let source = this.props.photos[index];
      return (
        <View style={[styles.imageView, {height: imageContainerHeight}]}>
          <LoadableImage
            style={[styles.image, {height: imageContainerHeight}]}
            source={{uri: source}}
            _key={(index == 0) ? this.props.id : ""}
          />
          <Image style={styles.topGradient} source={require('./images/topGradient.png')}/>
        </View>
      );
    }
  }

  _renderImages() {
    let imageContainerHeight = this.props.pageHeight * 3 / 4;
    return (
      <Carousel style={[styles.carousel, {height: imageContainerHeight}]}
        loop={false}
        animate={false}
        indicatorOffset={imageContainerHeight - 65}
        indicatorColor="rgba(220,220,220,1)"
        inactiveIndicatorColor="rgba(160,160,160,0.6)"
        indicatorSize={40}
      >
        {this._shouldRenderImageWithIndex(0)}
        {this._shouldRenderImageWithIndex(1)}
        {this._shouldRenderImageWithIndex(2)}
      </Carousel>
    );
  }

  render() {
    let pageHeight = this.props.pageHeight;
    let _scrollView: ScrollView;
    return (
      <View style={{flex: 1}}>

        <Animated.View style={{flex: 1, opacity: this.state.opacity}}>
          <View style={[styles.background, {opacity: this._calculateOpacity()}]}/>
        </Animated.View>

        <Animated.View style={{ position: 'absolute', top:0,bottom:0,left:0,right:0, transform:this.state.pan.getTranslateTransform() }}>
          <ScrollView style={styles.touchArea}
            ref={(scrollView) => { _scrollView = scrollView; }}
            onScroll={this._handleScroll.bind(this)}
            scrollEventThrottle={16}
            onResponderRelease={this._releasedScrollView.bind(this)}
          >
            <View style={[styles.card, {minHeight: pageHeight + BORDER_RADIUS}]}>
              {this._renderImages()}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{this.props.firstName} {this.props.lastName}</Text>
                <Text style={styles.text}>{this.props.description}</Text>
              </View>
              <Image style={styles.bottomGradient} source={require('./images/bottomGradient.png')}/>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={this._closeProfileCard.bind(this)}>
                <Image style={styles.closeButtonView} source={require('./images/x.png')}/>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonView: {
    resizeMode: "contain",
    height: 15,
    width: 15,
    flex: 1,
  },
  topGradient: {
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    height: 71,
    width: WIDTH,
    opacity: 0.8,
  },
  bottomGradient: {
    position: 'absolute',
    resizeMode: 'cover',
    bottom: 0,
    height: 53,
    width: WIDTH,
    opacity: 0.6,
  },
  background: {
    backgroundColor: 'black',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  touchArea: {
    flex: 1,
  },
  card: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#FBFBFB',
    elevation: 2,
    flex: 1,
  },
  carousel: {
    flex: 1,
    width: WIDTH,
  },
  imageView: {
    overflow: 'hidden',
    width: WIDTH,
  },
  image: {
    width: WIDTH,
  },
  textContainer: {
    backgroundColor: 'white',
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 20,
  },
  text: {
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
});

ProfileCardView.propTypes = {
  //TODO: add the expected property types (name, email, picture, etc)
};

ProfileCardView.defaultProps = {
  //TODO: create default prop types when some stuff is screwed up
};

export default ProfileCardView;
