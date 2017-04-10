'use strict';

/*
page for selecting tags

prop:
setTags: function that gives an array of tags that the user selected
dismissTagPage: function that closes the TagPage
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
    //TODO @richard temporary stuff until we get the real tags
    this.state = {
      tags: {"cough": false,"defiant": false,"control": false,"spoil": false,"punch": false,"count": false,"boundless": false,"dreary": false,"grey": false,"crush": false,"hushed": false,"representative": false,"reproduce": false,"petite": false,"wrench": false,"please": false,"functional": false,"queen": false,"feigned": false,"defective": false,"rain": false,"wry": false,"precede": false,"drain": false,"treat": false,"sniff": false,"unequal": false,"wail": false,"hand": false,"tease": false,"dinner": false,"search": false,"end": false,"tremendous": false,"late": false,"gray": false,"trucks": false,"ahead": false,"account": false,"snatch": false,"fall": false,"yoke": false,"tasteless": false,"woman": false,"robin": false,"laborer": false,"hydrant": false,"theory": false,"subsequent": false,"cover": false,"animal": false,"orange": false,"strange": false,"fill": false,"knowing": false,"bright": false,"paint": false,"squealing": false,"tomatoes": false,"stick": false,"zippy": false,"inform": false,"quarrelsome": false,"reflect": false,"cloistered": false,"gather": false,"satisfying": false,"sticks": false,"combative": false,"raspy": false,"throat": false,"coast": false,"discussion": false,"place": false,"mature": false,"group": false,"transport": false,"abashed": false,"warlike": false,"fear": false,"welcome": false,"narrow": false,"bubble": false,"shivering": false,"faint": false,"relation": false,"wax": false,"null": false,"harsh": false,"work": false,"twist": false,"play": false,"tow": false,"advice": false,"substantial": false,"sign": false,"kitty": false,"second-hand": false,"fabulous": false,"ill": false},
    };
  }

  componentDidMount () {
    Analytics.logEvent('open_tag_page', {});
  }

  _showMoreInformation () {
    Alert.alert(
      "Who can see my tags?",
      "Tags will only be shown when they are shared between two people. For example, if you like apples, only other apple-lovers will see that you love apples.\n\nWe can't stop people from lying about their interests to see other people's tags, so please treat this as public information"
    )
  }

  _tagSelected(key) {
    if (key in this.state.tags) {
      this.state.tags[key] = !this.state.tags[key];
      this.setState({tags: this.state.tags});
    }
  }

  _renderSingleTag(key, isSelected) {
    return (
      <Text key={key}>
        <Text
          onPress={() => {this._tagSelected(key)}}
          style={[GlobalStyles.text, styles.tag, (isSelected) ? styles.tagSelected : styles.tagUnselected]}
        >
          { key }
        </Text>
        <Text>,  </Text>
      </Text>
    )
  }

  _renderTags() {
    if (this.state.tags) {
      let tagViews = Object.keys(this.state.tags).map(function(key, index) {
        return this._renderSingleTag(key, this.state.tags[key]);
      }.bind(this));
      return (<Text>{tagViews}</Text>);
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
          <Text style={[GlobalStyles.boldText, styles.title]}>Select the tags or interests that apply to you</Text>
          <Text style={[GlobalStyles.text, styles.subtitle]}>
            These are <Text style={styles.highlightedText}>public</Text> to anyone with the same tag. Don't stress, you can change these later
          </Text>
          <TouchableOpacity
            style={styles.moreInfo}
            onPress={this._showMoreInformation.bind(this)}
          >
            <Text style={[GlobalStyles.text, styles.moreInfoText]}>(learn more)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.line}/>
        <View style={styles.bodyView}>
          {this._renderTags()}
        </View>
      </ScrollView>
    )
  }

  _cancelOnPress () {
    //TODO @jade, the prop "dismissTagPage" should close this view
    if (this.props.dismissTagPage) {
      this.props.dismissTagPage();
    }
  }

  _doneOnPress () {
    //TODO @jade, the prop function "setTags" is given all the tags the user selected
    if (this.props.setTags) {
      let myTags = [];
      for (var key in this.state.tags) {
        if (this.state.tags[key] === true) {
          myTags.push(key);
        }
      }
      this.props.setTags(myTags);
    }
    if (this.props.dismissTagPage) {
      this.props.dismissTagPage();
    }
  }

  _renderNavBarLeftButton() {
    return (
      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 80}}
        onPress={this._cancelOnPress.bind(this)}
      >
        <Text style={{color: "#715BB9",}}>Cancel</Text>
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
        onPress={this._doneOnPress.bind(this)}
      >
        <Text style={{fontWeight: '600', color: "#715BB9",}}>Done</Text>
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
    textDecorationLine: 'underline',
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
    fontWeight: "600",
    color: "#715BB9",
    textDecorationLine: 'underline',
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
});

  export default TagPage;
