/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, DeviceEventEmitter, Animated, Easing, Image } from 'react-native';
import FooterView from './components/FooterView/FooterView';
import Header from './components/common/Header/Header';
import { createStackNavigator, createAppContainer, createDrawerNavigator, SafeAreaView, DrawerItems } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import TomatoTimer from './components/common/TomatoTimer/TomatoTimer'
import NewTask from './components/main/NewTask/NewTask'
import Index from './components/main/Index/Index'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height


class App extends Component {

  constructor(props) {
    super(props)
    this.proportion = 0.65
    this.state = {

    }
  }



  render() {



    return (
      // 整个容器背景是渐变的
      <LinearGradient locations={[0.2, 1]} colors={['#1e2941', '#8d7f82']} style={styles.container}>
        {/* 容器头部信息 */}
        <View style={styles.header} >
          <Header title="最近" fontColor="#ffffff" avatar={require('./components/assets/images/default_avatar.jpg')} />
        </View>
        <FooterView />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageView: {

  },
  header: {
    flex: 1,
  },
  body: {
    flex: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
  }
});
const CustomDrawerContentComponent = (props) => (
  <LinearGradient locations={[0.2, 1]} colors={['#1e2941', '#8d7f82']} >
    <ScrollView>
      <SafeAreaView style={{ height: windowHeight }} forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems {...props} />
      </SafeAreaView>
    </ScrollView>
  </LinearGradient>
);



const AppNavigator = createDrawerNavigator({
  Home: {
    screen: App,
    navigationOptions: {
      header: null,
      drawerLabel: '首页',
      drawerIcon: () => (
        <Image style={{ width: 30, height: 30 }}
          source={require("./components/assets/images/default_avatar.jpg")}
        />
      )
    }
  },
  TomatoTimer: {
    screen: TomatoTimer,
    navigationOptions: {
      header: null
    }
  },
  NewTask: {
    screen: NewTask,
    navigationOptions: {
      title: '新建任务'
    },
  },
  Index: {
    screen: Index,
    navigationOptions: {
      // title: '首页'
      header: null
    }
  }
}, {
    contentComponent: CustomDrawerContentComponent,
  })



export default createAppContainer(AppNavigator)