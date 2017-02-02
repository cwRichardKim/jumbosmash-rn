
import React from 'react';
import { View,
         ListView,
         StyleSheet,
         Text, Navigator,
         TouchableHighlight } from 'react-native';
import ChatRow from './ChatRow';
import ChatSearch from './ChatSearch';
import ConversationPage from './ConversationPage';
import data from './testData';

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
});

class ChatNavigator extends React.Component {
  render() {
    return (
      <Navigator
        initialRoute={{ title: 'Chat', index: 0 }}
        renderScene={(route, navigator) =>
          <ChatPage
            nav={navigator}
          />
        }
        style={{padding: 0}}
      />
    );
}
}

class ChatPage extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(data),
      navigator: props.navigator
    };
  }

  rowPressed(row) {
    this.props.navigator.push({
      title: "TEST",//row.name.first,
      component: ConversationPage,
      passProps: {property: "TEST ALSO"}
    });
  }
  render() {
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData.lister_url)}
        underlayColor='#dddddd'>
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={(data) => <ChatRow {...data} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderHeader={() => <ChatSearch />}
        />
      </TouchableHighlight>
    );
  }
}

export default ChatNavigator;
