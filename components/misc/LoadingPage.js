'use strict';

/*
page that shows after the app is finished / the server shut down
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Navigator,
  Platform,
  Dimensions,
} from 'react-native';

import GlobalStyles           from "../global/GlobalStyles.js";

const NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54; // TODO: check the android tabbar height
const PAGE_HEIGHT = Dimensions.get('window').height - NAVBAR_HEIGHT;
const PAGE_WIDTH = Dimensions.get('window').width;

class LoadingPage extends Component {
  constructor(props) {
    super(props);
  }

  _renderView() {
    return (
      <ActivityIndicator style={styles.loadingArea}/>
    );
  }

  _renderNavigationBar() {
    return (
      <Navigator.NavigationBar style={[GlobalStyles.weakShadow, {backgroundColor: 'white'}]}
        routeMapper={{
          LeftButton: (route, navigator, index, navState) => { return (null); },
          RightButton: (route, navigator, index, navState) => { return (null); },
          Title: (route, navigator, index, navState) => { return (null); },
        }}>
      </Navigator.NavigationBar>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Navigator
          initialRoute={{name:""}}
          renderScene={this._renderView.bind()}
          navigationBar={this._renderNavigationBar()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT+ NAVBAR_HEIGHT,
  },
  loadingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

  export default LoadingPage;
