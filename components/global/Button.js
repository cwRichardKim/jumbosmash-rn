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
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
} from 'react-native';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      springValue: new Animated.Value(1.0),
      pan: new Animated.ValueXY({x:0, y:0}),
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
    if (!this.props.shouldNotAnimate) {
      this.state.springValue.setValue(0.9);
      Animated.timing(
        this.state.springValue,
        {toValue: 0.8}
      ).start()
    }
  }

  _onPress() {
    if (this.props.onPress && !this.props.isLoading) {
      this.props.onPress();
    }
    if (!this.props.shouldNotAnimate) {
      Animated.spring(
        this.state.springValue,
        {
          toValue: 1.0,
          friction: 3,
        }
      ).start();
    }
  }

  _shouldRenderImageOrLoadingIndicator () {
    if (!this.props.isLoading) {
      return(
        <Image
          style={[styles.image]}
          source={this.props.source ? this.props.source : null}
        />
      );
    } else {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true}/>
        </View>
      )
    }
  }

  render() {
    let translate = this.state.pan.getTranslateTransform();
    return(
      <Animated.View
        style={[styles.container,
                this.props.style ? this.props.style : {},
                {transform:[{scale: this.state.springValue},
                            translate[0],
                            translate[1]]}]}
      >
        <TouchableWithoutFeedback
          style={styles.touchArea}
          onPress={this._onPress.bind(this)}
          onPressIn={this._onPressIn.bind(this)}
        >
          {this._shouldRenderImageOrLoadingIndicator()}
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
  }
});

export default Button;
