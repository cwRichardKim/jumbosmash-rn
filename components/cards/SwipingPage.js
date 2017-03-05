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
      topCardIndex: 0,
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
      cardIndex: this.state.cardIndex + 1,
      topCardIndex: (this.state.topCardIndex + 1) % DECK_SIZE,
    });
  }

  _closeProfileCard() {
    this.setState({
      showProfile: false,
    })
  }

  _shouldRenderProfileCard() {
    if (this.state.showProfile && this.state.cardIndex < this.props.profiles.length) {
      return(
        <View style={styles.profileCardView}>
          <ProfileCardView {...this.props.profiles[this.state.cardIndex]}
            pageHeight={this.props.pageHeight}
            exitFunction={this._closeProfileCard.bind(this)}
          />
        </View>
      );
    }
  }

  _handleRightSwipeForIndex(cardIndex) {
    let card = this.props.profiles[cardIndex];
    console.log("swiped right on " + card.firstName);
  }

  _handleLeftSwipeForIndex(cardIndex) {
    let card = this.props.profiles[cardIndex];
    console.log("swiped left on " + card.firstName);
  }

  // handles button push, delegates animation and logic to card
  _swipeRightButtonPressed() {
    this.cards[this.state.topCardIndex].programmaticSwipeRight();
  }

  _swipeLeftButtonPressed() {
    this.cards[this.state.topCardIndex].programmaticSwipeLeft();
  }

  // renders single card
  _renderCard(cardIndex) {
    let positionInDeck = global.mod((cardIndex - this.state.topCardIndex), DECK_SIZE);
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
          {this._shouldRenderProfileCard()}
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
  profileCardView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
  },
});

export default SwipingPage;
