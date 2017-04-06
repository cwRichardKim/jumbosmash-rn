'use strict';

/*
This file is responsible for the view when there are no more cards left
*/

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
} from 'react-native';

class LoadingCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.view}>
        <ActivityIndicator
          style={styles.view}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noMoreCardsText: {
    fontSize: 22,
  }
})

export default LoadingCards;
