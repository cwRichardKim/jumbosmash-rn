'use strict';

import LoadingCards     from '../cards/LoadingCards.js';
/*
This is the page that handles and displays a conversations with an
a person or persons (or bot ;) )
*/

import React, {Component} from 'react';
import {View} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

let Mailer = require('NativeModules').RNMail;

const Analytics = require('react-native-firebase-analytics');
let TOP_MARGIN = 64;

class ConversationPage extends Component {
  constructor(props) {
    super(props);

    //will open up and get ref to particular chat between two users
    // TODO: make so need auth to get ref
    const path = "messages/".concat(this.props.chatroomId);
    this._messagesRef = this.props.firebase.database().ref(path);

    this._isMounted = false;
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

  componentWillUnmount() {
    let len = this.props.conversation.participants.length;
    this._isMounted = false;
    for(var i = 0; i < len; i++) {
      if (this.props.conversation.participants[i].profileId == this.props.myProfile.id) {
        this.props.conversation.participants[i].read = true;
      }
    }
    this._asyncUpdateConversation(this.props.chatroomId, this.props.conversation);
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
          createdAt: new Date(child.val().createdAt),
        });
        let now = new Date(child.val().createdAt);
        let then = new Date(this.props.conversation.lastSent.date);
        if (now.getTime() > then.getTime()) {
          this.props.conversation.lastSent = {'profileId': child.val().user._id, 'message': child.val().text, 'date': child.val().createdAt}
          let len = this.props.conversation.participants.length;
          for(var i = 0; i < len; i++) {
            if (this.props.conversation.participants[i].profileId == this.props.myProfile.id) {
              this.props.conversation.participants[i].read = true;
            }
          }
          this._asyncUpdateConversation(this.props.chatroomId, this.props.conversation);
        }
    });
    Analytics.logEvent('open_conversation_page', {});
  }

  async _asyncUpdateConversation(id, chatChanges) {
    let url = "https://jumbosmash2017.herokuapp.com/chat/update/".concat(id).concat("/").concat(this.props.token.val);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatChanges),
    }).then((response) => {
      console.log("Successfully updated last sent");
    }).catch((error) => {
      console.log(error);
      //DO NOTHING (user doesn't really need to know this didn't work)
    });
  }

  async _notifyParticipants() {
    let url = "https://jumbosmash2017.herokuapp.com/chat/message/".concat(this.props.myProfile.id).concat("/").concat(this.props.token.val);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({conversation: this.props.conversation, firstName: this.props.myProfile.firstName}),
    }).then((response) => {
      console.log("Successfully notified participants");
    }).catch((error) => {
      console.log(error);
    });
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
        createdAt: new Date().getTime(),
      });
    }
    this._notifyParticipants()
  }

  onReceive(message) {
    if (this._isMounted) {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    }
  }

  // removes a conversation from firebase
  onUnmatch() {
    this._messagesRef.remove()
  }

  render() {
      return (
        <View style={{marginTop: TOP_MARGIN, flex: 1, backgroundColor: 'white'}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            onReceive={this.onReceive}
            renderLoading={() => {return (<LoadingCards/>)}}
            user={{
              _id: this.props.myProfile.id
            }}/>
        </View>
      );
  }
}
export default ConversationPage;
