'use strict';

/*
This file is the parent file for the entire swiping mechanism. It should control
the data, make the requests, and delegate the UI / swiping to DeckView
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import DeckView     from './DeckView.js';

let TABBAR_HEIGHT = (Platform.OS === 'ios') ? 49 : 49; // TODO: check the android tabbar height
let PAGE_HEIGHT = Dimensions.get('window').height - TABBAR_HEIGHT;
let CARD_REFRESH_BUFFER = 2 // There should always be at least this many cards left, else fetch more

class SwipingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    }
    this._addMoreCardsAsync();
  }

  _addMoreCardsAsync () {
    return fetch('https://jumbosmash2017.herokuapp.com/profile')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          cards: this.state.cards.concat(responseJson),
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _handleRightSwipe (card) {
    console.log("swiped right func in swiping page");
  }

  _handleLeftSwipe (card) {
    console.log("swiped left func in swiping pages");
  }

  // This function is called after the card was swiped and before the next card
  // is loaded.  It is responsible for making sure the array of cards has enough
  // content in it
  _handleCardWasRemoved (index) {
    if (this.state.cards.length - index <= CARD_REFRESH_BUFFER + 1) {
      console.log(`There are only ${this.state.cards.length - index - 1} cards left.`);
      this._addMoreCardsAsync();
    }
  }

  render() {
    return (
      <View style={{height:PAGE_HEIGHT}}>
        <DeckView
          cards={this.state.cards}
          handleRightSwipe={this._handleRightSwipe.bind(this)}
          handleLeftSwipe={this._handleLeftSwipe.bind(this)}
          handleCardWasRemoved={this._handleCardWasRemoved.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default SwipingPage;
