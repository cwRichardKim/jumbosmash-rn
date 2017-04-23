'use strict';

/*
button that animates slightly when touched.

Requires:
style: JSX style (required: width and height)
onPress: executed when pressed. will not run if isLoading is true (see below)
source: image source, will be "contained" if dimensions are not equal

optional:
shouldNotAnimate: whether the button should have a slight bounce on touch. default false
animateInFrom: dictionary {x, y} with number of pixels in the x / y axis to start an animate in from
  eg: {x:0, y:10} starts 10 pixels down and animates into view
isLoading: true / false, shows loading indicator. will not run onPress if true
disabled: should not animate and does not call onPress
hasShadow: shows shadow, reduces when disabled
hasStrongShadow: shows strong shadow
disabledOpacity: opacity the button animates to when it is disabled
disabledOnPress: function called when button is disabled
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';

import GlobalStyles from "./GlobalStyles.js";
const IS_ANDROID = Platform.OS === 'android';

class CircleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      springValue: new Animated.Value(1.0),
      pan: new Animated.ValueXY({x:0, y:0}),
      opacity: new Animated.Value(props.style.opacity || 1),
    }
  }

  componentWillMount() {
    if (this.props.animateInFrom) {
      let pan = this.props.animateInFrom;
      this.state.pan.setValue({x: pan.x, y: pan.y});
    }
  }

  componentDidMount() {
    if (this.props.componentDidMount) {
      this.props.componentDidMount();
    }
    this._updateOpacity();
    if (this.props.animateInFrom) {
      Animated.spring(
        this.state.pan,
        {
          toValue: {x: 0, y: 0},
          friction: 5,
        }
      ).start();
    }
  }

  _onPressIn() {
    if (!this.props.shouldNotAnimate && !this.props.disabled) {
      this.state.springValue.setValue(0.9);
      Animated.timing(
        this.state.springValue,
        {toValue: 0.8}
      ).start()
    }
  }

  _onPress() {
    if (this.props.onPress && !this.props.isLoading && !this.props.disabled) {
      this.props.onPress();
    } else if (this.props.disabled) {
      this.props.disabledOnPress();
    }
  }

  _onPressOut() {
    if (!this.props.shouldNotAnimate && !this.props.disabled) {
      Animated.spring(
        this.state.springValue,
        {
          toValue: 1.0,
          friction: 3,
        }
      ).start();
    }
  }

  _shouldRenderContentOrLoadingIndicator () {
    if (!this.props.isLoading) {
      if (this.props.source) {
        return(
          <Image
            style={[styles.image]}
            source={this.props.source ? this.props.source : null}
          />
        );
      } else if (this.props.text) {
        return(
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={[GlobalStyles.text, this.props.textStyle || {}]}>{this.props.text}</Text>
          </View>
        );
      } else {
        return(<View/>);
      }
    } else {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true}/>
        </View>
      )
    }
  }

  _updateOpacity() {
    let opacity = this.props.style.opacity || 1;
    if (this.props.disabled) {
      opacity = this.props.disabledOpacity || 0.5;
    }
    if (opacity != this.state.opacity._value) {
      Animated.timing(
        this.state.opacity,
        {
          toValue: opacity,
          duration: IS_ANDROID ? 0 : 200,
        }
      ).start();
    }
  }

  componentDidUpdate () {
    this._updateOpacity();
  }

  render() {
    let translate = this.state.pan.getTranslateTransform();
    let shadow = {};
    if (this.props.hasShadow && !this.props.disabled && this.props.hasLowShadow !== true) {
      if (this.props.hasStrongShadow) {
        shadow = GlobalStyles.strongShadow;
      } else {
        shadow = GlobalStyles.buttonShadow;
      }
    } else if (this.props.hasShadow || this.props.hasLowShadow) {
      shadow = (IS_ANDROID && this.props.disabled) ? null : GlobalStyles.weakShadow;
    }
    return(
      <Animated.View
        style={[styles.container,
                this.props.style ? this.props.style : {},
                {opacity: this.state.opacity},
                shadow,
                {transform:[{scale: this.state.springValue},
                            translate[0],
                            translate[1]]}]}
      >
        <TouchableWithoutFeedback
          style={styles.touchArea}
          onPress={this._onPress.bind(this)}
          onPressIn={this._onPressIn.bind(this)}
          onPressOut={this._onPressOut.bind(this)}
        >
          {this._shouldRenderContentOrLoadingIndicator()}
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  touchArea: {
    position: 'absolute',
    overflow: 'hidden',
  }
});

export default CircleButton;
