/*
  This file contains functions for handling events handled by an instance
  of pushNotificationsHandler

const pushNotifications = require('../global/PushNotifications.js');
pushNotifications.functionName(param);
*/

module.exports = {
  // Function to be called when push notification is received
  onNotification: function (notification, params) {

    if (params.chatPage) {
      params.chatPage.refresh();
    } else {
      params.banner.showWithMessage(notification.message.body, params.onPress);
    }

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
  onRegister: async function (token, params) {
    let deviceId = {deviceId: token.token};
    let url = "https://jumbosmash2017.herokuapp.com/profile/update/".concat(params.profile.id).concat("/").concat(params.authToken);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceId)
    }).then((response) => {
      console.log("Successfully added device");
    }).catch((error) => {
      console.log(error);
    });
  },
  clearBadgeNumber: async function(profile, pushNotificationsHandler, authToken) {
    let notifCount = {notificationsCount: 0};
    let url = "https://jumbosmash2017.herokuapp.com/profile/update/".concat(profile.id).concat("/").concat(authToken);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifCount)
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });

    pushNotificationsHandler.setApplicationIconBadgeNumber(0);
  },
}
