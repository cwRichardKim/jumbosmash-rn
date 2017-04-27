'use strict';

/*
This file is responsible for providing the zoomed in card view after tapping on a card

isSharedTags: bool for "shared tags" vs "all tags" text
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

import LoadableImage    from '../global/LoadableImage.js';
import GlobalStyles     from "../global/GlobalStyles.js";
import GlobalFunctions  from "../global/GlobalFunctions.js";
import ActionSheet      from 'react-native-actionsheet';

let Carousel = require('react-native-carousel');
let Mailer = require('NativeModules').RNMail;

const BORDER_RADIUS = 10;
const CLOSE_SCROLL_DISTANCE = 100;
const REPORT_OPTION = "Report User";
const BLOCK_OPTION = "Block User";
const ACTION_SHEET_OPTIONS = ['Cancel', REPORT_OPTION, BLOCK_OPTION];
const WIDTH = Dimensions.get('window').width;

class ProfileCardView extends Component {
  constructor(props) {
    super(props);
  }

  _closeProfileCard() {
    if (this.props.exitFunction) {
      this.props.exitFunction();
    }
  }

  _shouldRenderImageWithIndex(index) {
    if (this.props.photos && this.props.photos.length > index && this.props.photos[index] && this.props.photos[index].large) {
      let imageContainerHeight = this.props.pageHeight * 3 / 4;
      let source = this.props.photos[index].large;
      return (
        <TouchableWithoutFeedback style={{flex:1}} onPress={this._closeProfileCard.bind(this)}>
        <View style={[styles.imageView, {height: imageContainerHeight}]}>
          <LoadableImage
            style={[styles.image, {height: imageContainerHeight}]}
            imageStyle={{width: WIDTH, height: imageContainerHeight}}
            source={{uri: source}}
            _key={(index == 0) ? this.props.id : ""}
          />
          <Image style={styles.topGradient} source={require('./images/topGradient.png')}/>
        </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  _renderImages() {
    let imageContainerHeight = this.props.pageHeight * 3 / 4;
    return (
      <Carousel style={[styles.carousel, {height: imageContainerHeight}]}
        loop={false}
        animate={false}
        indicatorOffset={imageContainerHeight - 65}
        indicatorColor="rgba(220,220,220,1)"
        inactiveIndicatorColor="rgba(160,160,160,0.6)"
        indicatorSize={40}
      >
        {this._shouldRenderImageWithIndex(0)}
        {this._shouldRenderImageWithIndex(1)}
        {this._shouldRenderImageWithIndex(2)}
      </Carousel>
    );
  }

  _shouldRenderSafeNameText() {
    let lName = this.props.lastName.toLowerCase();
    let fName = this.props.firstName.toLowerCase();
    let email = this.props.email.toLowerCase();

    if (fName.length <= 2 || lName.length <=2 || !(email.includes(lName) || email.includes(fName))) {
      let emailName = email.split("@")[0];
      emailName = emailName.split(".");
      if (emailName.length >= 2) {
        emailName = emailName[0] +"."+emailName[1][0];
      } else {
        emailName = emailName[0];
      }
      return(
        <Text style={styles.safetyNameText}>
          ({emailName})
        </Text>
      );
    }
  }

  _shouldRenderCheck(isTeamMember) {
    if (isTeamMember) {
      return (
        <Image
          source={require("./images/check.png")}
          style={styles.check}
        />
      );
    } else {
      return null;
    }
  }

  _shouldRenderSharedTags() {
    if (this.props.tags && this.props.tags.length > 0) {
      let tagsString = this.props.tags.join(", ");
      return (
        <Text style={[GlobalStyles.subtext, styles.subTitle,  {paddingBottom: 15}]}>{this.props.isSharedTags ? "Shared Tags: " : "All Tags: "} {tagsString}</Text>
      )
    } else {
      return (
        <View style={{paddingBottom: 5}}/>
      );
    }
  }

  _showOptions() {
    this.actionSheet.show()
  }

  _renderActionSheet() {
    return(
      <ActionSheet
        ref={(ref) => this.actionSheet = ref}
        options={ACTION_SHEET_OPTIONS}
        cancelButtonIndex={0}
        tintColor={GlobalFunctions.style().color}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    );
  }

  async _handleActionSheetPress(index) {
    if (ACTION_SHEET_OPTIONS[index] == REPORT_OPTION) {
      this._sendReport();
      return;
    }

    if (ACTION_SHEET_OPTIONS[index] == BLOCK_OPTION) {
      if (this.props.blockUserWithIndex && typeof(this.props.index) != "undefined") {
        Alert.alert(
          "Block this user?",
          "Are you sure you want to block this user? This can not be undone",
          [
            {
              text:"Yes, block this user",
              onPress:()=>{
                this.props.blockUserWithIndex(this.props.index);
                this._closeProfileCard();
              }
            },
            {text:"No", onPress:()=>{}}
          ]
        )
      }
    }
  }

  _sendReport() {
    if (Mailer && Mailer.mail) {
      Mailer.mail({
        subject: 'Report User',
        recipients: ['team@jumbosmash.com'],
        body: "Report: " + this.props.email + "\n\nReason: ",
      }, (error, event) => {
        if(error) {
          Alert.alert('Error', 'Could not send mail. Try sending an email to team@jumbosmash.com through your mail client');
        }
      });
    } else {
      Alert.alert(
        "Unsupported Device",
        "Sorry, your device doesn't support in-app email :(\nSend your question / feedback to team@jumbosmash.com with your mail client",
        [{text:"OK", onPress:()=>{}}]
      )
    }
  }

  _shouldRenderMoreButton() {
    if (this.props.blockUserWithIndex && typeof(this.props.index) != "undefined") {
      return (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={this._showOptions.bind(this)}>
          <Image style={styles.moreButtonView} source={require('./images/white-more.png')}/>
        </TouchableOpacity>
      );
    }
  }

  render() {
    let isTeamMember = this.props.teamMember === true;
    let pageHeight = this.props.pageHeight;
    let _scrollView: ScrollView;
    return (
      <View style={[styles.container, this.props.style]}>

        <View style={{flex: 1}}>
          <View style={[GlobalStyles.absoluteCover, styles.background]}/>
        </View>

        <View style={[GlobalStyles.absoluteCover]}>
          <ScrollView style={styles.touchArea}
            ref={(scrollView) => { _scrollView = scrollView; }}
          >
            <View style={[styles.card, {minHeight: pageHeight + BORDER_RADIUS}]}>
              {this._renderImages()}
              <TouchableWithoutFeedback style={{flex:1}} onPress={this._closeProfileCard.bind(this)}>
                <View style={styles.textContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={[GlobalStyles.boldText, styles.title]}>{this.props.firstName} {this.props.lastName} {this._shouldRenderSafeNameText()}</Text>
                    {this._shouldRenderCheck(isTeamMember)}
                  </View>
                  <Text style={[GlobalStyles.subtext, styles.subTitle]}>{this.props.major}</Text>
                  {this._shouldRenderSharedTags()}
                  <Text style={[GlobalStyles.text, styles.text]}>{this.props.description}</Text>
                </View>
              </TouchableWithoutFeedback>
              <Image style={styles.bottomGradient} source={require('./images/bottomGradient.png')}/>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={this._closeProfileCard.bind(this)}>
                <Image style={styles.closeButtonView} source={require('./images/x.png')}/>
              </TouchableOpacity>
              {this._shouldRenderMoreButton()}
            </View>
          </ScrollView>
        </View>
        {this._renderActionSheet()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonView: {
    resizeMode: "contain",
    height: 15,
    width: 15,
    flex: 1,
  },
  moreButton: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonView: {
    resizeMode: "contain",
    height: 30,
    width: 30,
    flex: 1,
  },
  topGradient: {
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    height: 71,
    width: WIDTH,
    opacity: 0.8,
  },
  bottomGradient: {
    position: 'absolute',
    resizeMode: 'cover',
    bottom: 0,
    height: 53,
    width: WIDTH,
    opacity: 0.6,
  },
  background: {
    backgroundColor: 'black',
    opacity: 0.8,
  },
  touchArea: {
    flex: 1,
  },
  card: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#FBFBFB',
    elevation: 2,
    flex: 1,
  },
  carousel: {
    flex: 1,
    width: WIDTH,
  },
  imageView: {
    overflow: 'hidden',
    width: WIDTH,
  },
  image: {
    width: WIDTH,
  },
  textContainer: {
    backgroundColor: 'white',
  },
  titleContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 7,
  },
  title: {
  },
  check: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginLeft: 3,
    marginBottom: 4,
  },
  subTitle: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
  },
  text: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  safetyNameText: {
    opacity: 0.5,
    fontSize: 15,
    fontWeight: "100",
  }
});

export default ProfileCardView;
