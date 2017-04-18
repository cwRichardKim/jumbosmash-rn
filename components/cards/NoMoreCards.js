'use strict';

/*
page that shows after the app is finished / the server shut down
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Clipboard,
  Alert,
  Dimensions,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js";
import RectButton             from "../global/RectButton.js";

const PAGE_WIDTH = Dimensions.get('window').width;

class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }

  _copyShareLink() {
    Clipboard.setString('jumbosmash.com/share');
    Alert.alert(
      "URL Copied!",
      "Jumbosmash URL copied to your clipboard",
      [{text:"OK",onPress:()=>{}}]
    )
  }

  render() {
    return (
      <View style={styles.view}>
        <Text style={[GlobalStyles.text, styles.text]}>Sooo... It looks like you kind of swiped right on everyone. Good job? ¯\_(ツ)_/¯{"\n"}Come back in a bit and we might have new users</Text>
        <RectButton
          style={[styles.button, styles.button]}
          textStyle={styles.buttonText}
          text="Share Download Link"
          onPress={this._copyShareLink.bind(this)}
        />
        <RectButton
          style={[styles.button, styles.button]}
          textStyle={styles.buttonText}
          text="Reload"
          onPress={this.props.reload}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    padding: 20,
  },
  buttonText: {
    color: "white",
    fontWeight:"600",
  },
  button: {
    width: PAGE_WIDTH - 100,
    height: 60,
    marginBottom: 15,
    opacity: 1,
    backgroundColor: GlobalFunctions.style().color,
  },
});

export default NoMoreCards;
