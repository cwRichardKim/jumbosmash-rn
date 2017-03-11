
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
         TouchableHighlight,
         Alert,
         RefreshControl,} from 'react-native';
import ConversationPage from './ConversationPage';
let global = require('../global/GlobalFunctions.js');

//TODO: check for servuce being down
let _listView: ListView;
const SCROLL_TO_Y = 0;

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this._fetchConversationsAsync()),
      navigator: props.navigator,
      refreshing: false,
      rawData: [],
    };
  }

  componentDidMount () {
    if (_listView) {
      _listView.scrollTo({x: 0, y: SCROLL_TO_Y, animated: true});
    }
  }

  _fetchConversationsAsync () {
    return fetch('https://jumbosmash2017.herokuapp.com/chat/id/' + this.props.myProfile.id)
      .then((response) => {
        if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
          return response.json();
        } else {
          throw ("status" in response) ? response["status"] : "Unknown Error";
        }
      })
      .then((data) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
          rawData: data,
          searchText: '',
        });
      })
      .catch((error) => {
        console.error("ERROR " + error);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._fetchConversationsAsync().then(() => {
      this.setState({refreshing: false});
    });
  }

  setSearchText(event) {
   let searchText = event.nativeEvent.text;
   this.setState({searchText: searchText});

   let filteredData = this.filterConversations(searchText, this.state.rawData);
   this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredData),
   });
  }

  filterConversations(searchText, conversations) {
    let text = searchText.toLowerCase();
    return conversations.filter((c) => {
      let otherParticipants = global.otherParticipants(c.participants, this.props.myProfile.profileId);
      let convo = otherParticipants[0].firstName.toLowerCase();
      return convo.search(text) !== -1;
    });
  }

  rowPressed(conversation) {
    this.renderConversation(conversation);
  }

  _renderHeader() {
    return(
      <View>
        {this._renderSearchBar()}
        {this._renderNoMatches()}
      </View>
    );
  }

  _renderNoMatches() {
    if (this.state.rawData == null || this.state.rawData.length <= 0) {
      return (
        <TouchableHighlight onPress={() => {/* TODO: take to edit prof page*/}}
            underlayColor='#dddddd'>
            <View style={styles.rowContainer}>
            <Text style={styles.rowText}>You have no matches (you can upload different photos in the profile section)</Text>
            </View>
        </TouchableHighlight>
      );
    }
    return null;
  }

  _renderSearchBar() {
    let numMatches = this.state.rawData != null && this.state.rawData.length != null ? this.state.rawData.length : 0;
    let str = "Search " + numMatches + " Matches";
    return(
      <View style={styles.searchContainer}>
        <TextInput
         style={styles.searchInput}
         returnKeyType='done'
         value={this.state.searchText}
         onChange={this.setSearchText.bind(this)}
         clearButtonMode='always' //TODO: @jared #android this prop isn't there
         placeholder={str} />
      </View>);
  }

  renderConversation(conversation) {
    this.props.navigator.pop()
    this.props.navigator.push({
      chatroomId: conversation._id,
      participants: conversation.participants,
      myProfile: this.props.myProfile,
      name: global.pageNames().conversation,
    });
  }

  renderChatRow(conversation) {
    if((conversation == null || conversation == 0) || conversation.participants == null) {
      return null;
    }

    // figure out other person(s) in conversation and get name
    let otherParticipants = global.otherParticipants(conversation.participants, this.props.myProfile.id);
    let len = otherParticipants.length;
    if(len <= 0) {return null;}
    let name = otherParticipants[0].firstName;
    name += otherParticipants.length > 1 ? " et al." : "";

    // handle rendering of last sent message
    //TODO: put styling in styles
    let setShowRight = conversation.lastSent.profileId == this.props.myProfile.id;
    let photoStyle = function (read) {return ({
      height: 60,
      width: 60,
      borderRadius: 30,
      borderColor: '#6A6ACB',
      borderWidth: (read == undefined || read) ? 0 : 3,
    });};
    let messageTextStyle = function (read) {return ({
      fontSize: 13,
      fontFamily: 'Avenir Next',
      flex: 3,
      textAlign: 'center',
      paddingBottom: 16,
      color: '#CAC4C4',
      fontWeight: (read == undefined || read) ? 'normal' : '500',
    });};
    let nameTextStyle = function (read) {
      return({fontSize: 13,
      fontFamily: 'Avenir Next',
      textAlign: 'center',
      fontWeight: (read == undefined || read) ? 'normal' : '500',});
    };
    let read = conversation.lastSent.read;
    return (
      <TouchableHighlight onPress={() => this.rowPressed(conversation)}
          underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
          <Text style={messageTextStyle(read)} ellipsizeMode={'tail'} numberOfLines={1}>{!setShowRight? conversation.lastSent.message : ""}</Text>
            <View style={styles.rowPhotoAndName}>
              <Image style={photoStyle(read)} source={otherParticipants ? {uri: otherParticipants[0].photo} : null}/>
              <Text style={nameTextStyle(read)}>
                {`${name}`}
              </Text>
            </View>
            <Text style={styles.rowText} ellipsizeMode={'tail'} numberOfLines={1}>{setShowRight? conversation.lastSent.message : ""}</Text>
          </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
        <ListView
          ref={(listView) => { _listView = listView; }}
          style={[styles.container, {marginTop: this.props.navBarHeight, height: this.props.pageHeight}]}
          dataSource={this.state.dataSource}
          renderRow={this.renderChatRow.bind(this)}
          enableEmptySections={true}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderHeader={() => this._renderHeader()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />}
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
  // backgroundColor: '#8E8E8E',
  },
  rowContainer: {
    flex: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowPhotoAndName: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 2
  },
  rowText: {
    fontSize: 13,
    fontFamily: 'Avenir Next',
    flex: 3,
    textAlign: 'center',
    paddingBottom: 16,
    color: '#CAC4C4',
  },
  rowNameText: {
    fontSize: 13,
    fontFamily: 'Avenir Next',
    textAlign: 'center',
  },
  rowPhoto: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: '#6A6ACB',
    borderWidth: 3,
  },
  headerContainer: {
    height: 40,
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: '#F3A9BF',
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
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C1C1C1',
  },
});

export default ChatPage;
