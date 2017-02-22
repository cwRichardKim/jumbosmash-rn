
/*
This is the page that handles the population, interaction, and rendering
of the table of matches.

TODO:
also can you move all the firebase stuff to NavigationContainer?
then thread it through all the props
it's probably going to be NavigationContainer -> HomeTabBarIOS -> ChatPage
*/
import React from 'react';
import { View,
         ListView,
         StyleSheet,
         Text,
         Navigator,
         Image,
         TouchableHighlight } from 'react-native';
import ChatRow from './ChatRow';
import ChatSearch from './ChatSearch';
import ConversationPage from './ConversationPage';
let global = require('../global/GlobalFunctions.js');

const ChatPageNavId = "1";
const ConversationPageNavId = "2";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  separator: {
  flex: 1,
  height: StyleSheet.hairlineWidth,
  backgroundColor: '#8E8E8E',
  },
  rowContainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    marginLeft: 12,
    fontSize: 16,
  },
  rowPhoto: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

const idOfUser = '588f7e504a557100113d2184';// Jared: 588f7e504a557100113d2184 Richard: '586edd82837823188a297932'; //TODO: self expanatory
class ChatPage extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this._fetchConversationsAsync();
    this.state = {
      dataSource: ds.cloneWithRows(this._fetchConversationsAsync()),
      navigator: props.navigator
    };
  }

  _fetchConversationsAsync () {
    return fetch('https://jumbosmash2017.herokuapp.com/chat/id/' + idOfUser)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseJson)
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  rowPressed(conversation) {
    this.renderConversation(conversation);
  }

  renderConversation(conversation) {
    this.props.navigator.pop()
    this.props.navigator.push({
      title: "TEST",//row.name.first,
      id: ConversationPageNavId,
      chatroomId: conversation._id,
      participants: conversation.participants,
      userId: idOfUser,
      index: 1,
      name: "Chat"
    });
  }

  renderChatRow(conversation) {
    if(conversation == null || conversation == 0) {
      return <View></View>
    }
    conversation.participants = global.participantsToDictionary(conversation.participants)
    otherParticipants = global.otherParticipants(conversation.participants, idOfUser);
    var len = otherParticipants.length;
    names = "";
    for(var key in otherParticipants) {
      names += " " + otherParticipants[key].firstName;
    }
    return (
      <TouchableHighlight onPress={() => this.rowPressed(conversation)}
          underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
            <Text style={styles.rowText}>
              {`${names}`}
            </Text>
          </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={this.renderChatRow.bind(this)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderHeader={() => <ChatSearch/>}
        />
    );
  }
}

export default ChatPage;
