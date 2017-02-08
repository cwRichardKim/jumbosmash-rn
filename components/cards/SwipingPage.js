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

// this is an example set of information
const Cards = [
  { _id: '588ba44d1abc3700118d5478',firstName: 'Elif (test)',middleName: '  ',lastName: 'Kinli',school: 'School of Arts and Sciences',major: 'Computer Science',email: 'elif.kinli@tufts.edu',id: '586edd82837823188a297767',matchList: [],dislikeList: [],likeList: [],notList: [],photos: [],tags: [] },
  { _id: '588f7db44a557100113d2183',firstName: 'Richard (test)',middleName: 'R.',lastName: 'Kim',school: 'College of Liberal Arts',major: 'Computer Science',email: 'richard.kim@tufts.edu',id: '586edd82837823188a297932',description: 'korean as fuck',matchList: [],dislikeList: [],likeList: [],notList: [],photos: [],tags: [] },
  { _id: '588f7e504a557100113d2184',firstName: 'Jared (test)',middleName: 'T.',lastName: 'Moskowitz',school: 'School of Engineering',major: 'Computer Science',email: 'jared.moskowitz@tufts.edu',id: '586edd82837823188a297810',description: 'whatever',matchList: [],dislikeList: [],likeList: [],notList: [],photos: [],tags: [] },
  { _id: '588f7e864a557100113d2185',firstName: 'Jade (test)',middleName: 'Y.',lastName: 'Chan',school: 'College of Liberal Arts',major: 'Computer Science',email: 'jade.chan@tufts.edu',id: '586edd82837823188a2976e7',description: 'whatever',matchList: [],dislikeList: [],likeList: [],notList: [],photos: [],tags: [] }
];

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
