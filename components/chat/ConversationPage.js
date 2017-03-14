'use strict';

/*
This is the page that handles and displays a conversations with an
a person or persons (or bot ;) )
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
    this._messagesRef.on('child_added', (child) => {
      var pos = 'right';
      if (child.val().user._id != this.props.myProfile.id) {
        pos = 'left';
      }
      this.onReceive({
        _id: child.val()._id,
        text: child.val().text,
        user: child.val().user,
        position: pos,
        date: new Date(child.val().date),
      });
    });

  }

  componentWillUnmount() {
  }

  onSend(messages = []) {
    for (var i = 0, len = messages.length; i < len; i++) {
      var message = messages[i];
      this._messagesRef.push({
        _id: message._id,
        text: message.text,
        user: {
          _id: this.props.myProfile.id,
          name: this.props.myProfile.firstName,
          avatar: this.props.myProfile.photos[0].small,
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
          _id: this.props.myProfile.id
        }}/>
    );
  }
}
export default ConversationPage;
