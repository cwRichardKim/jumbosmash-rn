'use strict';

/*
This file is responsible for providing the zoomed in card view after tapping on a card
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

let BORDER_RADIUS = 15;
let CLOSE_SCROLL_DISTANCE = 100;

//TODO: @richard Make a carousel on the photos
class ProfileCardView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollDistance: 0,
    }
  }

  _handleScroll(event: Object) {
    this.setState({
      scrollDistance: event.nativeEvent.contentOffset.y
    })
  }

  _calculateOpacity() {
    var distancePulled = this.state.scrollDistance;
    let maximumOpacity = 0.5;
    if (distancePulled < 0) {
      return maximumOpacity * (CLOSE_SCROLL_DISTANCE + distancePulled) / CLOSE_SCROLL_DISTANCE;
    }
    return maximumOpacity;
  }

  // <TouchableWithoutFeedback style={styles.touchArea}
  render() {
    let pageHeight = this.props.pageHeight;
    return (
      <View style={{flex: 1}}>
        <View style={[styles.background, {opacity: this._calculateOpacity()}]}>
        </View>
        <ScrollView style={styles.touchArea}
          onScroll={this._handleScroll.bind(this)}
          scrollEventThrottle={10}>
          <View style={[styles.card, {minHeight: pageHeight + BORDER_RADIUS}]}>
            <Image style={[styles.thumbnail, {height: pageHeight * 3 / 4}]} source={{uri: (this.props.photos && this.props.photos.length >= 1) ? this.props.photos[0] : 'https://img2.greatnotions.com/StockDesign/XLarge/King_Graphics/m0410.jpg'}} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{this.props.firstName}{"\n"}{this.props.description}{"\n"}[This is where the rest of the description would go]</Text>
            </View>
          </View>
        </ScrollView>
        <TouchableHighlight style={[styles.closeButton, {top: 20 + Math.max(0, -this.state.scrollDistance)}]} onPress={this.props.onPress}>
          <View style={[styles.closeButtonView, {justifyContent: "center", alignItems: "center"}]}>
            <Text>x</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    left: 20,
    overflow: "hidden",
  },
  closeButtonView: {
    backgroundColor: "white",
    flex: 1,
    opacity: 0.5,
  },
  background: {
    backgroundColor: 'black',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  touchArea: {
    flex: 1,
  },
  card: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    flex: 1,
  },
  thumbnail: {
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  }
});

ProfileCardView.propTypes = {
  //TODO: add the expected property types (name, email, picture, etc)
};

ProfileCardView.defaultProps = {
  //TODO: create default prop types when some stuff is screwed up
};

export default ProfileCardView;
