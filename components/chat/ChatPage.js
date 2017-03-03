
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
         TextInput,
         Image,
         TouchableHighlight } from 'react-native';
import ChatRow from './ChatRow';
import ChatSearch from './ChatSearch';
import ConversationPage from './ConversationPage';
let global = require('../global/GlobalFunctions.js');

const idOfUser = '588f7e504a557100113d2184';// Jared: 588f7e504a557100113d2184 Richard: '586edd82837823188a297932'; //TODO: self expanatory
class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //this._fetchConversationsAsync();
    this.state = {
      dataSource: ds.cloneWithRows(this._fetchConversationsAsync()),
      navigator: props.navigator
    };
  }

  _fetchConversationsAsync () {
    return fetch('https://jumbosmash2017.herokuapp.com/chat/id/' + idOfUser)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
          isLoading: false,
          empty: false,
          rawData: data,
          searchText: '',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }


  setSearchText(event) {
   let searchText = event.nativeEvent.text;
   this.setState({searchText: searchText});

   let filteredData = this.filterConversations(searchText, this.state.rawData);
   console.log("FILTERED " + JSON.stringify(filteredData));
   this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredData),
   });
  }

  filterConversations(searchText, conversations) {
    let text = searchText.toLowerCase();
    return conversations.filter((c) => {
      let otherParticipants = global.otherParticipants(c.participants, idOfUser);
      console.log(JSON.stringify(otherParticipants));
      let convo = otherParticipants[0].firstName.toLowerCase();
      console.log("CONVO: " + convo);
      return convo.search(text) !== -1;
    });
  }

  rowPressed(conversation) {
    this.renderConversation(conversation);
  }

  _renderSearchBar() {
    return(
      <View style={styles.searchContainer}>
        <TextInput
         style={styles.searchInput}
         value={this.state.searchText}
         onChange={this.setSearchText.bind(this)}
         placeholder='Search...' />
      </View>);
  }

  renderConversation(conversation) {
    this.props.navigator.pop()
    this.props.navigator.push({
      chatroomId: conversation._id,
      participants: conversation.participants,
      userId: idOfUser,
      name: "Conversation"
    });
  }

  renderChatRow(conversation) {
    if(conversation == null || conversation == 0) {
      return null;
    }
    let otherParticipants = global.otherParticipants(conversation.participants, idOfUser);
    let len = otherParticipants.length;
    if(len <= 0) {return null;}
    let name = otherParticipants[0].firstName;
    name += otherParticipants.length > 1 ? " et al." : "";
    return (
      <TouchableHighlight onPress={() => this.rowPressed(conversation)}
          underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
            <Image style={styles.rowPhoto} source={otherParticipants ? {uri: otherParticipants[0].photo} : null}/>
            <Text style={styles.rowText}>
              {`${name}`}
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
          enableEmptySections={true}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderHeader={() => this._renderSearchBar()}
        />
    );
  }
}

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
  searchInput: {
    height: 30,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  searchContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C1C1C1',
  },
});

export default ChatPage;
