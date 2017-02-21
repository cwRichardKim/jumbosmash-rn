'use strict';

/*
This file is the parent file for the entire swiping mechanism. It should control
the data, make the requests, and delegate the UI / swiping to DeckView. It
should be given a conversationId from it's 'parent' ChatPage
*/

import React, {Component} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
const firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyCqxU8ZGcg7Tx-iJoB_IROCG_yj41kWA6A",
  authDomain: "jumbosmash-ddb99.firebaseapp.com",
  databaseURL: "https://jumbosmash-ddb99.firebaseio.com/",
  storageBucket: "",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

class ConversationPage extends Component {
  constructor(props) {
    super(props);

    //will open up and get ref to particular chat between two users
    const path = "messages/".concat(this.props.chatroomId);
    this._messagesRef = firebaseApp.database().ref(path);

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);

    this.state = {
      messages: this._messages,
      typingText: null,
    };

  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidMount() {
    this._messagesRef.on('child_added', (child) => {
      this.onReceive({
        _id: child.val()._id,
        text: child.val().text,
        user: child.val().user,
        image: 'https://facebook.github.io/react/img/logo_og.png', //TODO: make this actual info
        position: child.val().name == "Jared" && 'right' || 'left',
        date: new Date(child.val().date),
        //uniqueId: child.key
      });
    });

  }

  setMessages(messages) {
    this._messages = messages;

    this.setState({
      messages: messages,
    });
  }

  onSend(messages = []) {
    for (var i = 0, len = messages.length; i < len; i++) {
      var message = messages[i];
      this._messagesRef.push({
        _id: message._id,
        text: message.text,
        user: {
          _id: 2,
          name: "Jared",
          avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
        date: new Date().getTime(),
      });


    }
  }

  onReceive(message) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, message),
      };
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        //onReceive={this.onReceive}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default ConversationPage;
