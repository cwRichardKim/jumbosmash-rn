// This file contains functions / scripts / algorithms that can
// be useful anywhere.  Use with:
/*
const global = require('../global/GlobalFunctions.js');
global.functionName(param);
*/

import {
  Alert,
  Linking,
} from 'react-native'

module.exports = {
  shuffle: function (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  saveButtonStates: function () {
    return ({
      show: "SHOWSAVEBUTTON",
      hide: "HIDESAVEBUTTON",
      saving: "SAVINGSAVEBUTTON",
    })
  },
  pageNames: function () {
    return ({
      cardsPage: "CARDSPAGE",
      chatPage: "CHATPAGE",
      settingsPage: "SETTINGSPAGE",
      conversation: "CONVERSATIONPAGE",
      auth: "AUTHPAGE",
      preRelease: "PRERELEASE",
      expiredPage: "EXPIREDPAGE",
      appHome: "APPHOMEPAGE",
      loadingPage: "LOADINGPAGE",
      cheaterPage: "CHEATERPAGE",
      tagPage: "TAGPAGE",
    })
  },
  storageKeys: function () {
    const prefix = "@SmashEmUp2017:";
    return ({
      profiles: prefix+"profiles",
      lastIndex: prefix+"lastIndex",
      likePoints: prefix+"likePoints",
      deviceToken: prefix+"deviceToken",
      myProfile: prefix+"myProfile",
      permissionsRequested: prefix+"permissionsRequested",
      chats: prefix+"chats",
    })
  },
  mod: function (n, m) {
    return ((n % m) + m) % m;
  },
  otherParticipants: function (participants, userId) {
    if (participants) {
      let ar = [];
      let len = participants.length;
      for(var i = 0; i < len; i++) {
        if(participants[i].profileId != userId) {
          ar.push(participants[i]);
        }
      }
      return ar;
    } else {
      return null;
    }
  },
  isGoodResponse: function (response) {
    return ("status" in response && response["status"] >= 200 && response["status"] < 300);
  },
  dates: function () {
    return({
      startDate: new Date(2017, 4, 12), // may 12th, midnight (month indexed at 0)
      endDate: new Date(2017,4,22), // may 22nd, midnight
    })
  },
  formatDate: function(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
  },
  // if the server date exists and is not during the active time, but the
  // user's date does say it is active time, then the user is time-cheating
  isUserCheatingWithServerDate: function (serverDate) {
    let today = new Date();
    let startDate = this.dates().startDate;
    let endDate = this.dates().endDate;
    let one_hour = 1000*60*60;
    let isServerDateEarly = serverDate && serverDate < startDate;
    let isServerDateDifferent = serverDate && Math.abs(today.getTime() - serverDate.getTime()) > one_hour;
    return isServerDateEarly && isServerDateDifferent;
  },
  isUserCheatingWithResponse: function (response) {
    if (response && response.headers) {
      let serverDate = new Date(response.headers.get('Date'));
      if (serverDate) {
        return this.isUserCheatingWithServerDate(serverDate)
      }
    }
    return false
  },
  calculateAppExpirationState: function () { // serverDate is a verified date from our servers
    let today = new Date();
    let startDate = this.dates().startDate;
    let endDate = this.dates().endDate;

    if (__DEV__) {
      // return this.appExpirationStates().expired; //TODO @richard remove this
    }

    if (today > startDate && today < endDate) {
      return (this.appExpirationStates().active);
    } else if (today < startDate) {
      return (this.appExpirationStates().preRelease);
    } else {
      return (this.appExpirationStates().expired)
    }
  },
  appExpirationStates: function() {
    return ({
      active: "APPACTIVE",
      preRelease: "APPPRERELEASE",
      expired: "APPEXPIRED",
      cheater: "CHEATER",
    })
  },
  helpers: function() {
    let helpersArray = ["Josh Berl", "Orlando Economos", "Shana Gallagher", "Nishant Joshi", "Lucy Gerhart", "Ryan Gill", "Dhruv Khurana", "Rebecca Larson", "Brian McGough", "Jordan Meisel", "Mackenzie Merriam", "Kabir Singh", "Claire Stone", "Lilly Tahmasebi", "Joshua Terry", "Katie Saviano", "Mudit Tandon"];
    this.shuffle(helpersArray);
    return helpersArray.join(", ");
  },
  developers: function() {
    let devs = ["Elif Kinli", "Jade Chan", "Jared Moskowitz", "Justin Sullivan", "Richard Kim"];
    this.shuffle(devs);
    return devs.join(", ");
  },
  designers: function() {
    let des = ["Bruno 'daddy' Olmedo", "Shanshan Duan"];
    this.shuffle(des);
    return des.join(", ");
  },
  overrideActions: function() { //override the app inactivity (used for trying app / using after expiration)
    return({
      openApp: "OPENAPP",
      tryApp: "TRYAPP",
      logout: "LOGOUT",
    });
  },
  style: function() {
    return({
      color: "#715BB9",
      gradientColor1: "#7436DF",
      gradientColor2: "#6877E3",
      black: "#202020",
      gray: "#919191",
      darkGray: "#555",
      lightGray: "#F8F5F5",
      red: "#F2585A",
    });
  },
  // rearranges photos pushed to the front eg: [null, x, y] -> [x, y, null]
  reArrangePhotos: function(photos) {
    var newPhotos = [];
    for (var i in photos) {
      if (photos[i] != null && photos[i].large != null && photos[i].small != null && photos[i].large.length > 0) {
        newPhotos.push(photos[i]);
      }
    }
    while (newPhotos.length < photos.length) {
      newPhotos.push(null);
    }
    return newPhotos;
  },
  openTOS: function () {
    let url = "http://jumbosmash.com/terms"
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  },
  asyncUpdateServerProfile: async function(id, newProfile, shouldUseDummyData, token, successOption) {
    if (shouldUseDummyData === true || token === null) {
      return;
    }
    newProfile["photos"] = this.reArrangePhotos(newProfile.photos);
    let url = "https://jumbosmash2017.herokuapp.com/profile/update/".concat(id).concat("/").concat(token);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
    }).then((response) => {
      if (this.isGoodResponse(response)) {
        let options = [{text: 'OK', onPress: () => {}},];
        if (successOption) {
          options.push(successOption);
        }
        Alert.alert(
          "Success!",
          "Successfully updated your profile",
          options
        )
      } else {
        Alert.alert(
          "Error",
          "We were unable to update your profile. Try quitting the app, or send us an email at team@jumbosmash.com and we can try to make the change manually",
          [{text: 'OK', onPress: () => {}},]
        )
      }
    }).catch((error) => {
      throw error; //TODO @richard show error thing
    });
  }
}
