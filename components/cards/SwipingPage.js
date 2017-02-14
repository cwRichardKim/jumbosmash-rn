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
    }
  }

  _addMoreCardsAsync () {
    this.props.fetchProfiles();
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
    if (this.props.profiles.length - index <= CARD_REFRESH_BUFFER + 1) {
      console.log(`There are only ${this.props.profiles.length - index - 1} cards left.`);
      this._addMoreCardsAsync();
    }
  }

  render() {
    return (
      <View style={{height:PAGE_HEIGHT}}>
        <DeckView
          profiles={this.props.profiles}
          handleRightSwipe={this._handleRightSwipe.bind(this)}
          handleLeftSwipe={this._handleLeftSwipe.bind(this)}
          handleCardWasRemoved={this._handleCardWasRemoved.bind(this)}
          pageHeight={PAGE_HEIGHT}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default SwipingPage;
