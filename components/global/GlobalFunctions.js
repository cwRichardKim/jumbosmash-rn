// This file contains functions / scripts / algorithms that can
// be useful anywhere.  Use with:
/*
let global = require('../global/GlobalFunctions.js');
global.functionName(param);
*/

module.exports = {
  shuffle: function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
  /*
    takes in an array of participants for a conversation and creates a
    dictionary with profileId's as keys
  */
  participantsToDictionary: function (participants) {
    var dic = {};
    len = participants.length;
    for(var i = 0; i < len; i++) {
      dic[participants[i].profileId] = participants[i];
    }
    return dic;
  },
  otherParticipants: function (participants, userId) {
    dic = {}
    for(var id in participants) {
      if(id != userId) {
        dic[id] = participants[id];
      }
    }
    return dic;
  },
}
