'use strict';

import LoadingCards     from '../cards/LoadingCards.js';
/*
This is the page that handles and displays a conversations with an
a person or persons (or bot ;) )
*/

import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

let Mailer = require('NativeModules').RNMail;
const MAX_INPUT_LENGTH = 200;

const Analytics = require('react-native-firebase-analytics');
let TOP_MARGIN = Platform.OS === 'android' ? 54 : 64;
const QUERY_LIMIT = 12;

class ConversationPage extends Component {
  constructor(props) {
    super(props);

    //will open up and get ref to particular chat between two users
    const path = "messages/".concat(this.props.chatroomId);
    this._pushMessageRef = this.props.firebase.database().ref(path);
    this._messagesRef = this._pushMessageRef.orderByChild("createdAt").limitToLast(QUERY_LIMIT);

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._messages = []
    this.state = {
      messages: this._messages,
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
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
          this._asyncUpdateConversation(this.props.chatroomId, {lastSent: this.props.conversation.lastSent});
        }
    });
    Analytics.logEvent('open_conversation_page', {});
  }

  onLoadEarlier() {
    let leftToLoad = QUERY_LIMIT;
    let loadedMessages = [];

    if (this.state.messages == null || this.state.messages.length <= 0) {
      return;
    }

    this._messagesRef.endAt(this.state.messages[this.state.messages.length - 1].date.getTime()).on("child_added", function(child) {
      var pos = 'right';
      if (child.val().user._id != this.props.myProfile.id) {
        pos = 'left';
      }

      let message = {
        _id: child.val()._id,
        text: child.val().text,
        user: child.val().user,
        position: pos,
        date: new Date(child.val().date),
        createdAt: new Date(child.val().createdAt),
      };

      loadedMessages.unshift(message);
      leftToLoad -= 1;

      if (leftToLoad <= 0) {
        loadedMessages.shift();
        let newMessages = GiftedChat.prepend(this.state.messages, loadedMessages);

        this.setState({
          isLoadingEarlier: false,
          messages: newMessages,
        });
        leftToLoad = 0;
        loadedMessages = [];
        return;
      }
      const path = "messages/".concat(this.props.chatroomId);
      this.props.firebase.database().ref(path).once("value", function(snapshot) {
        let numChildren = snapshot.numChildren();
        if (numChildren <= this.state.messages.length + QUERY_LIMIT) {
            loadedMessages.shift();
            this.setState((previousState) => {
              return {
                isLoadingEarlier: false,
                messages: GiftedChat.prepend(previousState.messages, loadedMessages),
                loadEarlier: this.state.messages.length != numChildren,
              }
            });
            leftToLoad -= 1;
            loadedMessages = [];
        }
      }.bind(this));
    }.bind(this));
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
      this._pushMessageRef.push({
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
    this._pushMessageRef.remove()
  }

  render() {
      return (
        <View style={{marginTop: TOP_MARGIN, flex: 1, backgroundColor: 'white'}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            onReceive={this.onReceive}
            loadEarlier={this.state.loadEarlier && this.state.messages.length >= QUERY_LIMIT}
            onLoadEarlier={this.onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}
            renderLoading={() => {return (<LoadingCards/>)}}
            maxInputLength={MAX_INPUT_LENGTH}
            user={{
              _id: this.props.myProfile.id
            }}/>
        </View>
      );
  }
}
export default ConversationPage;
