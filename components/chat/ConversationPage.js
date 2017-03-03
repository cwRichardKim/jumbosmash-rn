'use strict';

/*
This file is the parent file for the entire swiping mechanism. It should control
the data, make the requests, and delegate the UI / swiping to DeckView. It
should be given a conversationId from it's 'parent' ChatPage
*/

import React, {Component} from 'react';
import View from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';


class ConversationPage extends Component {
  constructor(props) {
    super(props);

    //will open up and get ref to particular chat between two users
    const path = "messages/".concat(this.props.chatroomId);
    this._messagesRef = this.props.firebase.database().ref(path);

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this._messages = []
    this.state = {
      messages: this._messages,
      typingText: null,
    };

  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidMount() {
    this.props.setShowNavigationBar(true);
    this._messagesRef.on('child_added', (child) => {
      var pos = 'right';
      if (child.val().user._id != this.props.userId) {
        pos = 'left';
      }
      this.onReceive({
        _id: child.val()._id,
        text: child.val().text,
        user: child.val().user,
        //image: 'https://facebook.github.io/react/img/logo_og.png', //TODO: make this actual info
        position: pos,
        date: new Date(child.val().date),
      });
    });

  }

  componentWillUnmount() {
    this.props.setShowNavigationBar(false);
  }

  onSend(messages = []) {
    for (var i = 0, len = messages.length; i < len; i++) {
      var message = messages[i];
      this._messagesRef.push({
        _id: message._id,
        text: message.text,
        user: {
          _id: this.props.userId,
          name: this.props.participants[this.props.userId].firstName,
          avatar: this.props.participants[this.props.userId].photo,
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
        onReceive={this.onReceive}
        user={{
          _id: this.props.userId
        }}/>
    );
  }
}
export default ConversationPage;
