/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { ScrollView, Dimensions, View } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator, SafeAreaView, DrawerItems } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
// import TomatoTimer from './components/common/TomatoTimer/TomatoTimer'
import NewTask from './components/main/NewTask/NewTask'
import { NotesSvg } from './components/assets/svgs/NotesSvg';
import { SlideAvatar, PassowrdBoxSvg, CloudStorageSvg, SettingSvg } from './components/common/SlideIcons'
import NotesMainApp from './components/main/NotesMainApp';
import NewNote from './components/main/NotesApp/New/NewNote'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

import './services/init'

const CustomDrawerContentComponent = (props) => (
  <LinearGradient locations={[0.2, 1]} colors={['#1e2941', '#8d7f82']} >
    <ScrollView>

      <SafeAreaView style={{ height: windowHeight }} forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={{ margin: 10 }}>
          <SlideAvatar />
        </View>
        <DrawerItems  {...props} />
      </SafeAreaView>
    </ScrollView>
  </LinearGradient>
);



const AppDrawerNavigator = createDrawerNavigator({
  Notes: {
    screen: NotesMainApp,
    mode: 'modal',
    navigationOptions: {
      header: null,
      drawerLabel: '便签本',
      title: '便签本',
      drawerIcon: () => (
        <NotesSvg width="25" height="25" />
      ),
    }
  },
  // PasswordBox: {
  //   screen: NewTask,
  //   mode: 'modal',
  //   navigationOptions: {
  //     header: null,
  //     drawerLabel: '密码箱',
  //     title: '密码箱',
  //     drawerIcon: () => (
  //       <PassowrdBoxSvg width="25" height="25" />
  //     ),
  //   }
  // },
  // CloudStorage: {
  //   screen: TomatoTimer,
  //   navigationOptions: {
  //     header: null,
  //     mode: 'modal',
  //     drawerLabel: '私有云盘',
  //     title: '私有云盘',
  //     drawerIcon: () => (
  //       <CloudStorageSvg width="25" height="25" />
  //     ),
  //   }
  // },
  // Setting: {
  //   screen: NotesMainApp,
  //   navigationOptions: {
  //     header: null,
  //     drawerLabel: '设置',
  //     title: '设置',
  //     drawerIcon: () => (
  //       <SettingSvg width="20" height="20" />
  //     ),
  //   }
  // },
}, {
    contentComponent: CustomDrawerContentComponent,
    drawerType: 'slide',
    contentOptions: {
      activeTintColor: '#f5f5f5',
      activeBackgroundColor: 'rgba(200,200,200,0.1)',
      inactiveTintColor: '#f5f5f5',
      labelStyle: {
        marginLeft: 0,
      },
      itemStyle: {
        // backgroundColor:"black",
      },
      activeLabelStyle: {
        //  backgroundColor:'black'
      },
    }
  })



const AppStackNavigator = createStackNavigator({
  Drawer: {
    screen: AppDrawerNavigator,
    navigationOptions: {
      header: null,
    }
  },
  notesNewNote: {
    screen: NewNote,
    navigationOptions: {
      header: null
    }
  },
  newRemindTask: {
    screen: NewTask,
  }
}, {
    initialRouteName: 'Drawer',
    // initialRouteName: 'newRemindTask',
    mode: 'modal',
  })


export default createAppContainer(AppStackNavigator)