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
} from 'react-native';

import YesView          from './YesView.js'
import NoView           from './NoView.js'
import SwipeButtonsView from './SwipeButtonsView.js'
import Card             from './Card.js';
import NoMoreCards      from './NoMoreCards.js';
import DummyData        from '../misc/DummyData.js'
const global = require('../global/GlobalFunctions.js');
const Analytics = require('react-native-firebase-analytics');

const CARD_REFRESH_BUFFER = 30; // There should always be at least this many cards left, else fetch more
const CARD_WIDTH = Dimensions.get('window').width - 40;
const DECK_SIZE = 3; // number of cards rendered at a time
const StorageKeys = global.storageKeys();
const MAX_SWIPES_REMEMBERED = 40;

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

  // TODO: @richard remove this later. this is for testing purposes to see if double click bug is fixed
  _swipeErrorCheck(cardIndex, card) {
    let indexBroke = this.state.cardIndex != cardIndex; // expecting false
    let cardsArrayUpdated = this.cards[cardIndex %3] != null; // expecting true
    let cardArrayBroke = cardsArrayUpdated && card.firstName != this.cards[cardIndex % 3].props.firstName; // expecting false
    if (indexBroke || !cardsArrayUpdated || cardArrayBroke) {
      Alert.alert("SwipingPage.js broke","screenshot this and send it to Richard (" + indexBroke.toString() + " " + cardsArrayUpdated.toString() + " " + cardArrayBroke.toString() + ")",[{text:"OK", onPress:()=>{}}])
    }
  }

  // Has a random chance to show a dummy match if we in demo mode
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

  _handleRightSwipeForIndex(cardIndex) {
    //TODO: have first pop-up and also check to see if asked before

    let profile = this.props.profiles[cardIndex];
    this._asyncUpdateLikeList(this.props.myProfile.id, profile.id);
    this._swipeErrorCheck(cardIndex, profile);
    this.setState({canUndoCount: 0});
    this._incrementSwipeCount(true);
    Analytics.logEvent('swipe', {
      'direction': 'right',
    });
  }

  _handleLeftSwipeForIndex(cardIndex) {
    let card = this.props.profiles[cardIndex];
    this._swipeErrorCheck(cardIndex, card);
    this.setState({canUndoCount: this.state.canUndoCount + 1});
    this._incrementSwipeCount(false);
    Analytics.logEvent('swipe', {
      'direction': 'left',
    });
  }

  _undo() {
    if (this.state.canUndoCount > 0 && this.state.cardIndex > 0) {
      this.setState({
        cardIndex: this.state.cardIndex - 1,
        canUndoCount: this.state.canUndoCount - 1,
      });
      Analytics.logEvent('button_hit', {
        'name': 'undo',
        'page': 'swiping'
      });
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
      Analytics.logEvent('button_hit', {
        'name': 'right_button',
        'page': 'swiping'
      });
    }
  }

  _swipeLeftButtonPressed() {
    if (this._cardsExist()  ) {
      this.cards[this.state.cardIndex % DECK_SIZE].programmaticSwipeLeft();
      Analytics.logEvent('button_hit', {
        'name': 'left_button',
        'page': 'swiping'
      });
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
    } else {
      return (<NoMoreCards/>);
    }
  }

  render() {
    // temporarily removing the yes / no views until design calls for them
    // let yesOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    // let yesScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    // let animatedYesStyles = {transform: [{scale: yesScale}], opacity: yesOpacity}
    //
    // let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    // let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    // let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    return (
      <View style={{marginTop: this.props.navBarHeight, height:this.props.pageHeight}}>
        <View style={[styles.container]}>
          <View style={styles.topPadding}/>
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
          {/* // temporarily removing the yes / no views
          <Animated.View style={[animatedNopeStyles, styles.noView]}>
            <NoView/>
          </Animated.View>

          <Animated.View style={[animatedYesStyles, styles.yesView]}>
            <YesView/>
          </Animated.View>
          */}
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
  topPadding: {
    height: 20,
  },
  // yesView: {
  //   position: 'absolute',
  //   bottom: 20,
  //   right: 20,
  //   zIndex: 11,
  // },
  // noView: {
  //   position: 'absolute',
  //   bottom: 20,
  //   left: 20,
  //   zIndex: 11,
  // },
  cardContainer: { // the area the card will occupy
    flex: 1,
    width: CARD_WIDTH,
  },
  swipeButtonsView: {
    height: 100,
    alignSelf: "stretch",
    zIndex: -1,
  },
});

export default SwipingPage;
