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

import GlobalStyles from "../global/GlobalStyles.js"

const DELAY_TIME = 4000;
const LOADING_TEXT = [
  "Optimizing Smashability",
  "Sorting by chill-to-pull",
  "Filtering out your ex",
  "Don't forget to call your mom",
  "Quenching thirst 💧",
  "Remember, drinking and driving is not cool",
  "Hmmm...",
  "Errrr...",
  "Still loading",
  "idk go read a book or something",
];

class LoadingCards extends Component {
  constructor(props) {
    super(props);
    this._mounted = false;
    this.state = {
      text: "Loading"
    }
  }

  componentDidMount () {
    this._mounted = true;
    setTimeout(this._changeText.bind(this), DELAY_TIME);
  }

  componentWillUnmount () {
    this._mounted = false;
  }

  _changeText () {
    if (this && this._mounted === true) {
      let index = Math.floor(Math.random() * LOADING_TEXT.length);
      index = Math.max(0, index);
      index = Math.min(index, LOADING_TEXT.length - 1);
      this.setState({
        text: LOADING_TEXT[index]
      })
      setTimeout(this._changeText.bind(this), DELAY_TIME)
    }
  }

  render() {
    return (
      <View style={styles.view}>
        <ActivityIndicator style={styles.activityIndicator}/>
        <Text style={[GlobalStyles.subtext, {textAlign: 'center'}]}>{this.state.text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 22,
  },
  activityIndicator: {
    paddingBottom: 10,
  }
})

export default LoadingCards;
