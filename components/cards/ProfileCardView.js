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

import LoadableImage  from '../global/LoadableImage.js';
import GlobalStyles   from "../global/GlobalStyles.js";

let Carousel = require('react-native-carousel');

const BORDER_RADIUS = 10;
const CLOSE_SCROLL_DISTANCE = 100;
const WIDTH = Dimensions.get('window').width;

class ProfileCardView extends Component {
  constructor(props) {
    super(props);
  }

  _closeProfileCard() {
    if (this.props.exitFunction) {
      this.props.exitFunction();
    }
  }

  _shouldRenderImageWithIndex(index) {
    if (this.props.photos && this.props.photos.length > index && this.props.photos[index] && this.props.photos[index].large) {
      let imageContainerHeight = this.props.pageHeight * 3 / 4;
      let source = this.props.photos[index].large;
      return (
        <TouchableWithoutFeedback style={{flex:1}} onPress={this._closeProfileCard.bind(this)}>
        <View style={[styles.imageView, {height: imageContainerHeight}]}>
          <LoadableImage
            style={[styles.image, {height: imageContainerHeight}]}
            imageStyle={{width: WIDTH, height: imageContainerHeight}}
            source={{uri: source}}
            _key={(index == 0) ? this.props.id : ""}
          />
          <Image style={styles.topGradient} source={require('./images/topGradient.png')}/>
        </View>
        </TouchableWithoutFeedback>
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

  _shouldRenderSafeNameText() {
    let lName = this.props.lastName.toLowerCase();
    let fName = this.props.firstName.toLowerCase();
    let email = this.props.email.toLowerCase();

    if (fName.length <= 2 || lName.length <=2 || !(email.includes(lName) || email.includes(fName))) {
      let emailName = email.split("@")[0];
      emailName = emailName.split(".");
      if (emailName.length >= 2) {
        emailName = emailName[0] +"."+emailName[1][0];
      } else {
        emailName = emailName[0];
      }
      return(
        <Text style={styles.safetyNameText}>
          ({emailName})
        </Text>
      );
    }
  }

  _shouldRenderCheck(isTeamMember) {
    if (isTeamMember) {
      return (
        <Image
          source={require("./images/check.png")}
          style={styles.check}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    let isTeamMember = this.props.teamMember === true;
    let pageHeight = this.props.pageHeight;
    let _scrollView: ScrollView;
    return (
      <View style={{flex: 1}}>

        <Animated.View style={{flex: 1}}>
          <View style={[GlobalStyles.absoluteCover, styles.background]}/>
        </Animated.View>

        <Animated.View style={[GlobalStyles.absoluteCover]}>
          <ScrollView style={styles.touchArea}
            ref={(scrollView) => { _scrollView = scrollView; }}
          >
            <View style={[styles.card, {minHeight: pageHeight + BORDER_RADIUS}]}>
              {this._renderImages()}
              <TouchableWithoutFeedback style={{flex:1}} onPress={this._closeProfileCard.bind(this)}>
                <View style={styles.textContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={[GlobalStyles.boldText, styles.title]}>{this.props.firstName} {this.props.lastName} {this._shouldRenderSafeNameText()}</Text>
                    {this._shouldRenderCheck(isTeamMember)}
                  </View>
                  <Text style={[GlobalStyles.subtext, styles.subTitle]}>{this.props.major}</Text>
                  <Text style={[GlobalStyles.text, styles.text]}>{this.props.description}</Text>
                </View>
              </TouchableWithoutFeedback>
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
    opacity: 0.8,
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
  titleContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 7,
  },
  title: {
  },
  check: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginLeft: 3,
    marginBottom: 4,
  },
  subTitle: {
    paddingLeft: 20,
    paddingBottom: 15,
  },
  text: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  safetyNameText: {
    opacity: 0.5,
    fontSize: 15,
    fontWeight: "100",
  }
});

export default ProfileCardView;
