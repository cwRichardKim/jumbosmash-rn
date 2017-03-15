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
    })
  },
  storageKeys: function () {
    const prefix = "@SmashEmUp2017:";
    return ({
      profiles: prefix+"profiles",
      lastIndex: prefix+"lastIndex",
      likePoints: prefix+"likePoints",
    })
  },
  mod: function (n, m) {
    return ((n % m) + m) % m;
  },
  otherParticipants: function (participants, userId) {
    let ar = [];
    let len = participants.length;
    for(var i = 0; i < len; i++) {
      if(participants[i].profileId != userId) {
        ar.push(participants[i]);
      }
    }
    return ar;
  },
}
