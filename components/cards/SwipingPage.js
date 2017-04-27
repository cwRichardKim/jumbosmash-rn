'use strict';

/*
This file is the parent file for the entire swiping mechanism. It should control
the data, make the requests, and delegate the UI / swiping to Card.js

*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
  AsyncStorage,
  Platform,
} from 'react-native';

import SwipeButtonsView from './SwipeButtonsView.js'
import Card             from './Card.js';
import LoadingCards     from './LoadingCards.js';
import NoMoreCards      from './NoMoreCards.js';
import DummyData        from '../misc/DummyData.js'
const global = require('../global/GlobalFunctions.js');
const Analytics = require('react-native-firebase-analytics');

const CARD_REFRESH_BUFFER = 5; // There should always be at least this many cards left, else fetch more
const CARD_WIDTH = Dimensions.get('window').width - 40;
const DECK_SIZE = 3; // number of cards rendered at a time
const StorageKeys = global.storageKeys();
const MAX_SWIPES_REMEMBERED = 40;
const IS_ANDROID = Platform.OS === 'android';

class SwipingPage extends Component {
  constructor(props) {
    super(props);

    this.cards=[null, null, null];

    this.state = {
      cardIndex: 0,
      canUndoCount: 0,
      likePoints: [],
      likeCount: 0,
      dislikeCount: 0,
    }
  }

  componentDidMount() {
    this._shouldRetrieveLikePoints(true);
    Analytics.logEvent('open_swipe_page', {});
    this.props.pushNotificationsHandler.requestPermissions();
  }

  componentWillUnmount() {
    if (this.props.removeSeenCards) {
      this.props.removeSeenCards(this.state.cardIndex);
    }
    this.saveLikePoints();
  }

  // this function deals with the data (number of cards) and should have no impact on visuals
  // it is called after the card was swiped and before the next card
  // is loaded.  It is responsible for making sure the array of cards has enough
  // content in it
  _swipeDidComplete(cardIndex) {
    if (this.props.profiles.length - cardIndex <= CARD_REFRESH_BUFFER + 1) {
      console.log(`There are only ${this.props.profiles.length - cardIndex - 1} cards left.`);
      this.props.fetchProfiles();
    }
    this.setState({
      cardIndex: cardIndex + 1,
    });
  }

  // TODO: @richard remove this later. this is for dev purposes to see if double click bug is fixed
  _swipeErrorCheck(cardIndex, card) {
    let indexBroke = this.state.cardIndex != cardIndex; // expecting false
    let cardsArrayUpdated = this.cards[cardIndex %3] != null; // expecting true
    let cardArrayBroke = cardsArrayUpdated && card.firstName != this.cards[cardIndex % 3].props.firstName; // expecting false
    if (indexBroke || !cardsArrayUpdated || cardArrayBroke) {
      Alert.alert("App in unstable state","Not sure what happened, screenshot this and send it to Richard@jumbosmash.com. Also highly recommend quitting the app and starting again (" + indexBroke.toString() + " " + cardsArrayUpdated.toString() + " " + cardArrayBroke.toString() + ", "+this.state.cardIndex.toString() + " "+cardIndex.toString()+")",[{text:"OK", onPress:()=>{}}])
    }
  }

  // Has a random chance to show a dummy match if we in try mode
  _showDummyMatchWithId(swipeId) {
    if (Math.random() > 0.5) {
      let dummyProfs = DummyData.profiles;
      let prof;
      for(var i in dummyProfs) {
        if (dummyProfs[i].id == swipeId) {
          prof = dummyProfs[i];
        }
      }
      this.props.notifyUserOfMatchWith(prof);
    }
  }

  async _asyncUpdateLikeList(profId, swipeId) {
    if (this.props.shouldUseDummyData === true) {
      this._showDummyMatchWithId(swipeId);
      return;
    }
    let url = "https://jumbosmash2017.herokuapp.com/profile/like/".concat(profId).concat("/").concat(swipeId).concat("/").concat(this.props.token.val);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({profileId: profId, swipedId: swipeId}),
    }).then((response) => {
      if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
        return response.json();
      } else {
        throw ("status" in response) ? response["status"] : "Unknown Error";
      }
    }).then((responseJson) => {
      if (responseJson.code == "MATCH") {
        if (this.props.notifyUserOfMatchWith) {
          this.props.notifyUserOfMatchWith(responseJson.swipedProfile)
        }
      }
    }).catch((error) => {
      throw error; //TODO @richard show error thing
    });
  }

  // increments the count and stores it
  _incrementSwipeCount (isLike) {
    var queue = this.state.likePoints;
    queue.push(isLike);
    var wasLike = null;
    if (queue.length > MAX_SWIPES_REMEMBERED) {
      wasLike = queue.shift();
    }
    let newLikeCount = this.state.likeCount;
    let newDislikeCount = this.state.dislikeCount;

    if (isLike) {
      newLikeCount += 1;
    } else {
      newDislikeCount += 1;
    }

    if (wasLike === true) {
      newLikeCount -= 1;
    } else if (wasLike === false && wasLike !== null) {
      newDislikeCount -= 1;
    }

    this.setState({
      likePoints: queue,
      likeCount: newLikeCount,
      dislikeCount: newDislikeCount,
    });
  }

  // public function, saves the array to storage
  saveLikePoints () {
    if (this) {
      try {
        AsyncStorage.setItem(StorageKeys.likePoints, this.state.likePoints.toString());
      } catch (error) {
        throw error;
      }
    }
  }

  // retrieves the like and dislike counts and sets them to state
  async _shouldRetrieveLikePoints (isLike) {
    var likePoints = 0;
    try {
      likePoints = await AsyncStorage.getItem(StorageKeys.likePoints);

      // successfully retrieved something
      if (likePoints !== null && typeof(likePoints) !== "undefined") {
        likePoints = likePoints.split(",");
      } else {
        likePoints = [];
      }
      // error accessing storage
    } catch (error) {
      throw error;
    }

    let likeCount = 0;
    let dislikeCount = 0;

    for (var i in likePoints) {
      let boolVal = likePoints[i] === "true";
      if (boolVal) {
        likeCount += 1;
      } else {
        dislikeCount += 1;
      }
      likePoints[i] = boolVal;
    }

    this.setState({
      likePoints,
      likeCount,
      dislikeCount,
    });
  }

  async _handleRightSwipeForIndex(cardIndex) {
    //TODO: @jared have first pop-up and also check to see if asked before notifications

    let profile = this.props.profiles[cardIndex];
    this._asyncUpdateLikeList(this.props.myProfile.id, profile.id);
    this._swipeErrorCheck(cardIndex, profile);
    if (this.props.addRecentLikes && profile.id) {
      this.props.addRecentLikes(profile.id);
    }
    this.setState({canUndoCount: 0});
    this.props.removeDuplicateProfiles(cardIndex);
    this._incrementSwipeCount(true);
    Analytics.logEvent('swipe_right', {});
  }

  _handleLeftSwipeForIndex(cardIndex) {
    let card = this.props.profiles[cardIndex];
    this._swipeErrorCheck(cardIndex, card);
    this.setState({canUndoCount: this.state.canUndoCount + 1});
    this._incrementSwipeCount(false);
    Analytics.logEvent('swipe_left', {});
  }

  _undo() {
    if (this.state.canUndoCount > 0 && this.state.cardIndex > 0) {
      this.setState({
        cardIndex: this.state.cardIndex - 1,
        canUndoCount: this.state.canUndoCount - 1,
      });
      Analytics.logEvent('undo_button', {});
    }
  }

  _cardsExist() {
    let bufferDeckLoaded = this.cards && this.cards[0] != null;
    let profilesLoaded = this.props.profiles && this.props.profiles.length > 0 && typeof(this.props.profiles[0]) != "undefined";
    return bufferDeckLoaded && profilesLoaded;
  }

  // handles button push, delegates animation and logic to card
  _swipeRightButtonPressed() {
    if (this._cardsExist()) {
      this.cards[this.state.cardIndex % DECK_SIZE].programmaticSwipeRight();
      Analytics.logEvent('right_button', {});
    }
  }

  _swipeLeftButtonPressed() {
    if (this._cardsExist()  ) {
      this.cards[this.state.cardIndex % DECK_SIZE].programmaticSwipeLeft();
      Analytics.logEvent('left_button', {});
    }
  }

  // renders single card
  _renderCard(cardIndex) {
    let positionInDeck = global.mod((cardIndex - this.state.cardIndex), DECK_SIZE);
    let index = this.state.cardIndex + positionInDeck;
    if (index < this.props.profiles.length) {
      return (
        <Card {...this.props.profiles[index]}
          ref={(elem) => {this.cards[cardIndex] = elem}}
          onPress={this.props.openProfileCard}
          handleRightSwipeForIndex={this._handleRightSwipeForIndex.bind(this)}
          handleLeftSwipeForIndex={this._handleLeftSwipeForIndex.bind(this)}
          swipeDidComplete={this._swipeDidComplete.bind(this)}
          cardIndex={index}
          positionInDeck={positionInDeck}
          cardWidth={CARD_WIDTH}
          numCards={this.props.profiles.length}
        />
      );
    } else {
      return null;
    }
  }

  // renders DECK_SIZE number of cards
  _shouldRenderCards() {
    if (this.props.profiles && this.state.cardIndex < this.props.profiles.length) {
      return (
        <View style={{flex:1}}>
          {this._renderCard(0)}
          {this._renderCard(1)}
          {this._renderCard(2)}
        </View>
      );
    } else if (this.props.noMoreCards) {
      return (
        <NoMoreCards
          reload={this.props.fetchProfiles}
        />
      );
    } else {
      return (<LoadingCards/>);
    }
  }

  render() {
    return (
      <View style={{marginTop: this.props.navBarHeight, flex: 1}}>
        <View style={[styles.container]}>
        <View style={styles.cardContainer}>
          {this._shouldRenderCards()}
        </View>

          <View style={styles.swipeButtonsView}>
            <SwipeButtonsView
              leftButtonFunction={this._swipeLeftButtonPressed.bind(this)}
              rightButtonFunction={this._swipeRightButtonPressed.bind(this)}
              undo={this._undo.bind(this)}
              canUndo={this.state.canUndoCount > 0 && this.state.cardIndex > 0}
              likeCount={this.state.likeCount}
              dislikeCount={this.state.dislikeCount}
              maxSwipesRemembered={MAX_SWIPES_REMEMBERED}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cardContainer: { // the area the card will occupy
    flex: 1,
    marginTop: 20,
    width: CARD_WIDTH,
  },
  swipeButtonsView: {
    height: 100,
    alignSelf: "stretch",
    zIndex: IS_ANDROID ? 1 : -1, //idk why this is necessary, but buttons don't show up otherwise
  },
});

export default SwipingPage;
