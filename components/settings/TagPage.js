'use strict';

/*
page for selecting tags

prop:
myProfile
token
showNavBar: bool for whether nav bar is required
setTags: function that gives an array of tags that the user selected
existingTags: (optional), already highlights tags that have been selected before
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Navigator,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";
import GlobalFunctions        from "../global/GlobalFunctions.js"
const Analytics = require('react-native-firebase-analytics');

const WIDTH = Dimensions.get("window").width;
const PADDING = 20;
const NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54; // TODO: check the android tabbar height

class TagPage extends Component {
  constructor(props) {
    super(props);
    this.hasShownNSFWWarning = false;
    this.hasShownIdentitiesWarning = false;
    this.state = {
      tags: null,
    };
  }

  componentDidMount () {
    Analytics.logEvent('open_tag_page', {});
    this._fetchTags();
  }

  // sets the true / false values of all the tags in allTags based on the
  // user's tags
  _setTagStates(allTags) {
    let myTags = {};
    if (this.props.myProfile && this.props.myProfile.tags) {
      for (var i in this.props.myProfile.tags) {
        myTags[this.props.myProfile.tags[i]] = true;
      }
    }
    let newTags = {};
    for (var category in allTags) {
      newTags[category] = {};
      for (var tagi in allTags[category]) {
        let tagName = allTags[category][tagi];
        newTags[category][tagName] = myTags[tagName] === true;
      }
    }
    return newTags
  }

  _fetchTags() {
    if (this.props.token && this.props.token.val) {
      let url = "https://jumbosmash2017.herokuapp.com/tags/"+this.props.token.val;
      return fetch(url)
      .then((response) => {
        if (GlobalFunctions.isGoodResponse(response)) {
          return response.json();
        } else {
          throw ("status" in response) ? response["status"] : "Unknown Error";
        }
      }).then((responseJson) => {
        responseJson = this._setTagStates(responseJson);
        if (Object.keys(responseJson).length > 0) {
          this.setState({
            tags: responseJson,
          })
        } else {
          throw "something went wrong when fetching tags"
        }
      })
      .catch((error) => {
        throw error
        Alert.alert(
          "Something Went Wrong :(",
          "We couldn't fetch the tags from the server. It could be a server issue or a connectivity issue. Cancel the tag stuff for now and add them later",
          [{text: "OK", onPress: ()=>{}}]
        );
      });
    } else {
      setTimeout(this._fetchTags.bind(this), 500);
    }
  }

  _showMoreInformation () {
    Alert.alert(
      "Who can see my tags?",
      "Tags will be viewable by people who have also selected the same tag. For example, if you like apples, all other apple-lovers will see that tag.\n\nWe can't stop people from lying about their interests to see other people's tags, so please treat this as public information"
    )
  }

  _tagSelected(category, key) {
    let selectedState = false;
    if (category in this.state.tags && key in this.state.tags[category]) {
      this.state.tags[category][key] = !this.state.tags[category][key];
      selectedState = this.state.tags[category][key];
      this.setState({tags: this.state.tags});
    }
    if (category === "nsfw" && !this.hasShownNSFWWarning && selectedState === true) {
      this.hasShownNSFWWarning = true;
      Alert.alert(
        "Nice 😘👌",
        "Other people who also selected '"+key+"' will see that you selected it. Make sure you're ok with that before saving this tag!\n\n(you can tap on it again to unselect it)"
      )
    }
    if (category === "identity" || category === "identities" && !this.hasShownIdentitiesWarning && selectedState === true) {
      this.hasShownIdentitiesWarning = true;
      Alert.alert(
        "AYYYY ✌️😊✌️",
        "Other people who also selected '"+key+"' will see that you selected it. Make sure you're ok with that before saving this tag!\n\n(you can tap on it again to unselect it)"
      )
    }
  }

  _renderSingleTag(category, key, isSelected, isLast) {
    let selectedStyle = {};
    let emojiRegex = new RegExp(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g);
    if (isSelected) {
      selectedStyle = (emojiRegex.test(key) && !key.includes(" ")) ? styles.emojiSelected : styles.tagSelected;
    } else {
      selectedStyle = styles.tagUnselected;
    }
    return (
      <Text key={category+key}>
        <Text
          onPress={() => {this._tagSelected(category, key)}}
          style={[GlobalStyles.text, styles.tag, selectedStyle]}
        >
          { key }
        </Text>
        <Text>{isLast ? "" : ",   "}</Text>
      </Text>
    )
  }

  _renderTagCategory(title, tags) {
    let numTags = Object.keys(tags).length;
    let tagViews = Object.keys(tags).map((key, index) => {
      return this._renderSingleTag(title, key, tags[key], index == numTags - 1);
    });
    return (
      <View key={title}>
        <Text style={styles.categoryTitle}>{title}:</Text>
        <Text style={styles.tags}>{tagViews}</Text>
      </View>
    );
  }

  _renderTags() {
    if (this.state.tags) {
      let tagCategories = Object.keys(this.state.tags).map(function(key, index) {
        return this._renderTagCategory(key, this.state.tags[key]);
      }.bind(this));
      return (tagCategories);
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator style={{padding: 10}}/>
          <Text style={GlobalStyles.subtext}>Loading Tags</Text>
        </View>
      )
    }
  }

  _renderNavigatorScene (route, navigator) {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleView}>
          <Text style={[GlobalStyles.boldText, styles.title]}><Text style={styles.tagSelected}>Tap</Text> the tags or interests that apply to you</Text>
          <Text style={[GlobalStyles.text, styles.subtitle]}>
            These are <Text style={styles.highlightedText}>public</Text> to anyone with the same tag. Don't worry, you can change these later{" "}
            <Text
              style={[GlobalStyles.text, styles.moreInfoText]}
              onPress={this._showMoreInformation.bind(this)}
            >
              (learn more)
            </Text>
          </Text>
        </View>
        <View style={styles.line}/>
        <View style={styles.bodyView}>
          {this._renderTags()}
        </View>
      </ScrollView>
    )
  }

  // used in create account, not used in edit account
  cancelOnPress () {
    //TODO @jade, the prop "dismissTagPage" should close this view
    if (this.props.navigator && this.props.showNavBar) {
      this.props.navigator.pop();
    }
  }

  // used by both create accound and edit account
  extractTags() {
    let myTags = [];
    for (var category in this.state.tags) {
      for (var key in this.state.tags[category]) {
        if (this.state.tags[category][key] === true) {
          myTags.push(key);
        }
      }
    }
    return myTags
  }

  // used in create account, not used in edit account
  doneOnPress () {
    //TODO @jade, the prop function "setTags" is given all the tags the user selected
    let myTags = this.extractTags();
    if (this.props.setTags) {
      Analytics.logEvent('tags_selected', {
        'num_tags': myTags.length,
      });
      this.props.setTags(myTags);
    }
    this.cancelOnPress();
  }

  _renderNavBarLeftButton() {
    return (
      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 80}}
        onPress={this.cancelOnPress.bind(this)}
      >
        <Text style={{color: GlobalFunctions.style().color,}}>Cancel</Text>
      </TouchableOpacity>
    );
  }

  _renderNavBarCenter() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

      </View>
    )
  }

  _renderNavBarRightButton() {
    return (
      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 80}}
        onPress={this.doneOnPress.bind(this)}
      >
        <Text style={{fontWeight: '600', color: GlobalFunctions.style().color,}}>Done</Text>
      </TouchableOpacity>
    );
  }

  // returns UI element of the navigation bar
  _renderNavigationBar() {
    return (
      <Navigator.NavigationBar style={[GlobalStyles.weakShadow, styles.navigationBarContainer]}
        routeMapper={{
          Title: this._renderNavBarCenter.bind(this),
          LeftButton: this._renderNavBarLeftButton.bind(this),
          RightButton: this._renderNavBarRightButton.bind(this),
        }}>
      </Navigator.NavigationBar>
    );
  }

  render() {
    if (!this.props.showNavBar) {
      return (<View style={{flex: 1, backgroundColor: 'white'}}>{this._renderNavigatorScene()}</View>);
    } else {
      return (
        <View style={{flex: 1}}>
          <Navigator
            ref={(elem)=>{this.navigator = elem}}
            renderScene={this._renderNavigatorScene.bind(this)}
            navigationBar={this._renderNavigationBar()}
          />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  navigationBarContainer: {
    backgroundColor: 'white',
  },
  leftButton: {

  },
  RightButton: {

  },
  scrollView: {
    flex: 1,
    marginTop: NAVBAR_HEIGHT,
  },
  titleView: {
    minHeight: 50,
    width: WIDTH,
    padding: PADDING,
  },
  title: {
    paddingBottom: 10,
  },
  highlightedText: {
    fontWeight: "600",
  },
  subtitle: {
  },
  moreInfo: {
    paddingTop: 5,
  },
  moreInfoText: {
    textDecorationLine: 'underline',
  },
  bodyView: {
    flex: 1,
    padding: PADDING,
    paddingTop: 0,
    marginBottom: 50,
    minHeight: 200,
  },
  tag: {
    lineHeight: 25,
  },
  tagSelected: {
    fontWeight: "bold",
    color: GlobalFunctions.style().color,
    textDecorationLine: 'underline',
  },
  emojiSelected: {
    backgroundColor: GlobalFunctions.style().color,
  },
  tagUnselected: {
  },
  line: {
    height: 1,
    left: PADDING,
    width: WIDTH - (2 * PADDING),
    backgroundColor: "#EEE",
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Avenir Next',
    fontWeight: "bold",
  },
  tags: {
    marginBottom: 7,
  }
});

  export default TagPage;
