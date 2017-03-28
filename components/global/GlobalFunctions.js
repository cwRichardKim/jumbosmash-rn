// This file contains functions / scripts / algorithms that can
// be useful anywhere.  Use with:
/*
const global = require('../global/GlobalFunctions.js');
global.functionName(param);
*/

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
      prerelease: "PRERELEASE",
      expiredPage: "EXPIREDPAGE",
      appHome: "APPHOMEPAGE",
      loadingPage: "LOADINGPAGE",
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
  calculateAppActivityState: function () {
    let today = new Date();
    let startDate = new Date(2017, 4, 12); // may 12th, midnight (month indexed at 0)
    let endDate = new Date(2017,4,22); // may 22nd, midnight

    return this.appActivityStates().expired; //TODO @richard remove this

    if (today > startDate && today < startDate) {
      return (this.appActivityStates().active);
    } else if (today < startDate) {
      return (this.appActivityStates().preRelease);
    } else {
      return (this.appActivityStates().expired)
    }
  },
  appActivityStates: function() {
    return ({
      active: "APPACTIVE",
      preRelease: "APPPRERELEASE",
      expired: "APPEXPIRED",
    })
  },
  betaTesters: function() {
    return "Zoe Baghdoyan, Josh Beri, Frankie Caiazzo, Tafari Duncan, Orlando Economos, Jason Fan, Derek Fieldhouse, Shana Gallagher, Lucy Gerhart, Ryan Gill, Cori Jacoby, Nishant Joshi, Dhruv Khurana, Rebecca Larson, Ian Leaman, Ann Lin, Emily Lin, Brian McGough, Jordan Meisel, Mackenzie Merriam, Sylvia R. Ofama, Isha Patnaik, Luis Rebollar, Joaquin Rodgriguez, Ben Sack, Maya Salcido White, Katie Saviano, Kabir Singh, Clare Stone, Lilly Tahmasebi, Aubrey Tan, Mudit Tandon, Joshua Terry, Nicholas Turiano, Harry Weissman, Gideon Wulfsohn";
  },
  overrideActions: function() { //override the app inactivity (used for app demo / using after expiration)
    return({
      openApp: "OPENAPP",
      demoApp: "DEMOAPP",
    });
  }
}
