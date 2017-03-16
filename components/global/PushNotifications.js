/*
  This file contains functions for handling events handled by an instance
  of pushNotificationsHandler

const pushNotifications = require('../global/PushNotifications.js');
pushNotifications.functionName(param);
*/

import AsyncStorage from 'react-native';

const global = require('./GlobalFunctions.js');
const StorageKeys = global.storageKeys();

module.exports = {
  // Function to be called when push notification is received
  onNotification: function (notification, params) {

    params.banner.showWithMessage(notification.message.body, params.banner.onPress);

    if (notification.foreground) {
      switch (notification.data.code) {
        case "MATCH":
          break;
        case "MESSAGE":
          break;
        default:
      }
    }
  },
  onRegister: function (token, params) {

    let notificationToken = AsyncStorage.getItem(StorageKeys.notificationToken);
    console.log(notificationToken);
    if (notificationToken == null || notificationToken != token.token) {
      let url = "https://jumbosmash2017.herokuapp.com/profile/device/".concat(params.profileId).concat("/").concat(token.token);
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      }).then((response) => {
        AsyncStorage.setItem(StorageKeys.notificationToken, token.token);
        console.log("Successfully added device Id");
      }).catch((error) => {
        console.log(error);
      });
    }
  },
}
