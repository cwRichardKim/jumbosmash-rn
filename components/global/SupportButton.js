'use strict';

/*
Button that pulls up email-support
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from 'react-native';

var Mailer = require('NativeModules').RNMail;

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      springValue: new Animated.Value(1.0),
    }
  }

  _onPressIn() {
    if (!this.props.shouldNotAnimate) {
      this.state.springValue.setValue(0.97);
      Animated.timing(
        this.state.springValue,
        {toValue: 0.95}
      ).start()
    }
  }

  _onPress() {
    this._sendMail(this.state.path);
    Animated.spring(
      this.state.springValue,
      {
        toValue: 1.0,
        friction: 3,
      }
    ).start();
  }

  _sendMail(path) {
    if (Mailer && Mailer.mail) {
      Mailer.mail({
        subject: 'Help / Feedback',
        recipients: ['team@jumbosmash.com'],
        body: '',
      }, (error, event) => {
        if(error) {
          AlertIOS.alert('Error', 'Could not send mail. Try sending an email to team@jumbosmash.com through your mail client');
        }
      });
    } else {
      Alert.alert(
        "Unsupported Device",
        "Sorry, your device doesn't support in-app email :(\nSend your question / feedback to team@jumbosmash.com with your mail client",
        [{text:"OK", onPress:()=>{}}]
      )
    }
  }

  render() {
    return(
      <Animated.View
        style={[styles.container,
                this.props.style ? this.props.style : {},
                {transform:[{scale: this.state.springValue}]}]}
      >
        <TouchableWithoutFeedback
          style={styles.touchArea}
          onPress={this._onPress.bind(this)}
          onPressIn={this._onPressIn.bind(this)}
        >
          <View style={styles.view}>
            <Text>Help / Feedback</Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  touchArea: {
    flex: 1,
  },
  view: {
    backgroundColor: '#F2585A',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 5,
  }
});

export default Button;
