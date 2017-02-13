
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
import data from './testData';

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

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
      <TouchableHighlight style={{marginTop: 10}} onPress={() => {
            if (index > 0) {
              navigator.pop();
            }
        }}>
       <Text>Back</Text>
     </TouchableHighlight>
   )} else {
   return null}
   },
   RightButton(route, navigator, index, navState) {
      return null;
   },
   Title(route, navigator, index, navState) {
      return <Text>Hello From My App!</Text>
   }
};

class ChatNavigator extends React.Component {
  render() {
    console.log("OKKKKKKKK");
    return (
      <Navigator
        initialRoute={{component: ChatPage,
                       id: ChatPageNavId,
                       chatroomId: null,
                       title: 'Chat',
                       index: 0 }}
        renderScene={this.navigatorRenderScene}
        navigationBar={null/* <Navigator.NavigationBar routeMapper={NavigationBarRouteMapper} /> */}
        style={{padding: 0}}
      />
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case ChatPageNavId:
        return (<ChatPage
                  title={route.title}
                  nav={navigator}
                />
                );
      case ConversationPageNavId:
        return (<ConversationPage
                  chatroomId={route.chatroomId}
                  nav={navigator}
                />);
    }
  }
}

class ChatPage extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(data),
      navigator: props.nav
    };
  }

  rowPressed(props) {
    this.renderConversation(props.chatroomId);
  }

  renderConversation(conversationId) {
    this.props.nav.pop()
    this.props.nav.push({
      title: "TEST",//row.name.first,
      id: ConversationPageNavId,
      chatroomId: conversationId,
      index: 1,
      //passProps: {property: "TEST ALSO"}
    });
  }

  renderChatRow(props) {
    return (
      <TouchableHighlight onPress={() => this.rowPressed(props)}
          underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
            <Image source={{ uri: props.picture.large}} style={styles.rowPhoto} />
            <Text style={styles.rowText}>
              {`${props.name.first} ${props.name.last}`}
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

export default ChatNavigator;
