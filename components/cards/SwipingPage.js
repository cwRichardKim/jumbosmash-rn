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
  AppState,
  Alert,
} from 'react-native';

import YesView          from './YesView.js'
import NoView           from './NoView.js'
import SwipeButtonsView from './SwipeButtonsView.js'
import Card             from './Card.js';
import NoMoreCards      from './NoMoreCards.js';
import ProfileCardView  from './ProfileCardView.js'
const global = require('../global/GlobalFunctions.js');

const CARD_REFRESH_BUFFER = 30; // There should always be at least this many cards left, else fetch more
const CARD_WIDTH = Dimensions.get('window').width - 40;
const DECK_SIZE = 3; // number of cards rendered at a time

class SwipingPage extends Component {
  constructor(props) {
    super(props);

    this.cards=[null, null, null];

    this.state = {
      cardIndex: 0,
      showProfile: false,
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange (currentAppState) {
    if (currentAppState == "inactive") {
      if (this.props.removeSeenCards) {
        let oldCurrentProfile = this.props.profiles[this.state.cardIndex];
        this.props.removeSeenCards(this.state.cardIndex)
        let newCurrentProfile = this.props.profiles[0];
        if (oldCurrentProfile !== newCurrentProfile) {
          throw "Removing Cards Did Not Work";
        }
        this.setState({
          cardIndex: 0,
        });
      } else {
        throw "removeSeenCards undefined"
      }
    }
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

  _closeProfileCard() {
    this.setState({
      showProfile: false,
    })
  }

  _shouldRenderProfileView() {
    if (this.state.showProfile && this.state.cardIndex < this.props.profiles.length) {
      return(
        <View style={styles.coverView}>
          <ProfileCardView {...this.props.profiles[this.state.cardIndex]}
            pageHeight={this.props.pageHeight}
            exitFunction={this._closeProfileCard.bind(this)}
          />
        </View>
      );
    }
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

  async _asyncUpdateLikeList(profId, swipeId) {
    let url = "https://jumbosmash2017.herokuapp.com/profile/like/".concat(profId).concat("/").concat(swipeId);
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
        //TODO: @jared handle what to do when match on swiping page
        if (this.props.notifyUserOfMatchWith) {
          // this.props.notifyUserOfMatchWith(responseJson.theprofile) <- @jared
        }
      }
    }).catch((error) => {
      throw error; //TODO @richard show error thing
    });
  }

  _handleRightSwipeForIndex(cardIndex) {
    let profile = this.props.profiles[cardIndex];
    console.log("PROFILE SWIPED: " + JSON.stringify(profile.id));
    this._asyncUpdateLikeList('586edd82837823188a29791d',profile.id);//, profile.id);//, profile.id);//, '586edd82837823188a297921'); //TODO: @jared dont hard code//this.props.myProfile.id, profile.id);
    this._swipeErrorCheck(cardIndex, profile);
  }

  _handleLeftSwipeForIndex(cardIndex) {
    let card = this.props.profiles[cardIndex];
    console.log("swiped left on " + card.firstName);
    this._swipeErrorCheck(cardIndex, card);
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
    }
  }

  _swipeLeftButtonPressed() {
    if (this._cardsExist()  ) {
      this.cards[this.state.cardIndex % DECK_SIZE].programmaticSwipeLeft();
    }
  }

  // renders single card
  _renderCard(cardIndex) {
    let positionInDeck = global.mod((cardIndex - this.state.cardIndex), DECK_SIZE);
    let index = this.state.cardIndex + positionInDeck;
    return (
      <Card {...this.props.profiles[index]}
        ref={(elem) => {this.cards[cardIndex] = elem}}
        onPress={()=>{this.setState({showProfile: true})}}
        handleRightSwipeForIndex={this._handleRightSwipeForIndex.bind(this)}
        handleLeftSwipeForIndex={this._handleLeftSwipeForIndex.bind(this)}
        swipeDidComplete={this._swipeDidComplete.bind(this)}
        index={index}
        positionInDeck={positionInDeck}
        cardWidth={CARD_WIDTH}
      />
    );
  }

  // renders DECK_SIZE number of cards
  _shouldRenderCards() {
    if (this.props.profiles && this.state.cardIndex < this.props.profiles.length - (DECK_SIZE - 1)) {
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
      <View style={{height:this.props.pageHeight}}>
        <View style={[styles.container]}>
          <View style={styles.topPadding}/>
          {this._shouldRenderProfileView()}
          <View style={styles.cardContainer}>
            {this._shouldRenderCards()}
          </View>

          <View style={styles.swipeButtonsView}>
            <SwipeButtonsView
              leftButtonFunction = {this._swipeLeftButtonPressed.bind(this)}
              rightButtonFunction = {this._swipeRightButtonPressed.bind(this)}
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
    height: 50,
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
  coverView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});

export default SwipingPage;
