
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
         RefreshControl,
         AsyncStorage,
       } from 'react-native';
let global = require('../global/GlobalFunctions.js');
const PushNotifications = require('../global/PushNotifications.js');

//TODO: check for service being down
let _listView: ListView;
const Analytics = require('react-native-firebase-analytics');
const SCROLL_TO_Y = 0;
const StorageKeys = global.storageKeys();

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      navigator: props.navigator,
      refreshing: true,
      rawData: [],
      filteredData: [],
      searchText: '',
      isMounted: false,
    };
  }

  componentDidMount () {
    this.setState({isMounted: true});
    this._fetchChatsFromLocalStorage(this._fetchConversationsAsync.bind(this))
    if (_listView) {
      _listView.scrollTo({x: 0, y: SCROLL_TO_Y, animated: true});
    }
    Analytics.logEvent('open_chat_page', {});
    PushNotifications.clearBadgeNumber(this.props.myProfile, require('react-native-push-notification'), this.props.token.val);
  }

  componentWillUnmount () {
    this._saveChatsToLocalStorage(this.state.rawData);
    this.setState({isMounted: false});
  }

  async _fetchChatsFromLocalStorage(callback) {
    let storedChats = null;
    try {
      let storedData = await AsyncStorage.getItem(StorageKeys.chats);
      if (storedData !== null && typeof(storedData) === "string") {
        storedChats = JSON.parse(storedData);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(storedChats),
          rawData: storedChats,
        });
      }
    } catch (e) {
      throw e;
    }
    if (callback) {
      callback();
    }
  }

  _saveChatsToLocalStorage(chats) {
    if (this && chats) {
      try {
        AsyncStorage.setItem(StorageKeys.chats, JSON.stringify(chats));
      } catch (e) {
        throw e;
      }
    }
  }

  async _fetchConversationsAsync () {
    let url = 'https://jumbosmash2017.herokuapp.com/chat/id/'.concat(this.props.myProfile.id).concat("/").concat(this.props.token.val);
    return fetch(url)
      .then((response) => {
        if ("status" in response && response["status"] >= 200 && response["status"] < 300) {
          return response.json();
        } else {
          throw ("status" in response) ? response["status"] : "Unknown Error";
        }
      })
      .then((data) => {
        // sort rows from newest to oldest sent message
        data.sort(function(a,b){
          return (b.lastSent && a.lastSent) ? new Date(b.lastSent.date) - new Date(a.lastSent.date) : 0;
        });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
          rawData: data,
          filteredData: [],
          searchText: '',
          refreshing: false,
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

  refresh() {
    this._fetchConversationsAsync();
  }

  setSearchText(event) {
   let searchText = event.nativeEvent.text;
   this.setState({searchText: searchText});

   let filteredData = this.filterConversations(searchText, this.state.rawData);
   this.setState({
    filteredData: filteredData,
    dataSource: this.state.dataSource.cloneWithRows(filteredData),
   });
  }

  filterConversations(searchText, conversations) {
    let text = searchText.toLowerCase();
    return conversations.filter((c) => {
      let otherParticipants = global.otherParticipants(c.participants, this.props.myProfile.id);
      let convo = otherParticipants.length > 0 ? otherParticipants[0].firstName.toLowerCase() : "";
      return convo.search(text) !== -1;
    });
  }

  rowPressed(conversation) {
    // TODO: make a dictionary so code is cleaner I guess
    let data = this.state.filteredData.length <= 0 ? this.state.rawData : this.state.filteredData;
    let len = data.length;
    for (var i = 0; i < len; i++) {
      if (data[i]._id == conversation._id) {
        let length = data[i].participants.length;
        for (var j = 0; j < length; j++) {
          if (data[i].participants[j].profileId == this.props.myProfile.id) {
            data[i].participants[j].read = true;
            if (this.state.filteredData.length <= 0) {
              this.setState({filteredData: data});
            } else {
              this.setState({rawData: data});
            }
          }
        }
      }
    }
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
        <View underlayColor='#dddddd'>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>
                You have no matches (you can upload different photos in the profile section)
              </Text>
            </View>
        </View>
      );
    } else if ((this.state.filteredData != null && this.state.filteredData.length <= 0) && this.state.searchText != '') {
      return (
        <View underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
            <Text style={styles.rowText}>
              No results
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }

  //TODO: @jared clearButtonMode #android this prop isn't there
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
         clearButtonMode='always'
         placeholder={str} />
      </View>);
  }

  renderConversation(conversation) {
    this.props.navigator.pop()
    this.props.navigator.push({
      chatroomId: conversation._id,
      participants: conversation.participants,
      conversation: conversation,
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
      borderColor: global.style().color,
      borderWidth: read ? 0 : 3,
    });};
    let messageTextStyle = function (read) {return ({
      fontSize: 14,
      fontFamily: 'Avenir Next',
      flex: 3,
      textAlign: 'center',
      paddingBottom: 16,
      color: read? '#7C7C7C' : global.style().color,
      fontWeight: read ? 'normal' : '500',
    });};
    let nameTextStyle = function (read) {
      return({fontSize: 15,
      marginTop: 2,
      fontFamily: 'Avenir Next',
      textAlign: 'center',
      color: '#474747',
      fontWeight: read ? 'normal' : '500',});
    };

    let hasRead = false;
    let length = conversation.participants.length;
    for(var i = 0; i < length; i++) {
      if (conversation.participants[i].profileId == this.props.myProfile.id) {
        hasRead = conversation.participants[i].read;
      }
    }

    //TODO: BUG sometimes looks like unread when it's your own sent message
    //      also no messages but bot->click into convo->click out new message
    //      shown from bot (good) but when reloading this dissapears
    return (
      <TouchableHighlight onPress={() => this.rowPressed(conversation)}
          underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
            <Text style={messageTextStyle(hasRead)} ellipsizeMode={'tail'} numberOfLines={1}>{!setShowRight? conversation.lastSent.message : ""}</Text>
              <View style={styles.rowPhotoAndName}>
                <Image style={photoStyle(hasRead)} source={otherParticipants ? {uri: otherParticipants[0].photo} : null}/>
                <Text style={nameTextStyle(hasRead)}>
                  {`${name}`}
                </Text>
              </View>
            <Text style={messageTextStyle(hasRead)} ellipsizeMode={'tail'} numberOfLines={1}>{setShowRight? conversation.lastSent.message : ""}</Text>
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
  rowPhoto: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: global.style().color,
    borderWidth: 3,
  },
  searchInput: {
    height: 36,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  searchContainer: {
    flex: 1,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default ChatPage;
