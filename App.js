/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation'
import NewTask from './components/main/NewTask/NewTask'
import { NotesSvg } from './components/assets/svgs/NotesSvg';
import NotesMainApp from './components/main/NotesMainApp';
import NewNote from './components/main/NotesApp/New/NewNote'
import TomatoTimer from './components/common/TomatoTimer/TomatoTimer'
import DrawerContentComponent from './components/common/Drawer'  // 侧边栏

import './services/init'

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
    contentComponent: DrawerContentComponent,
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
  },
  tomatoTimer: {
    screen: TomatoTimer,
    navigationOptions: {
      header: null
    }
  }
}, {
    initialRouteName: 'Drawer',
    // initialRouteName: 'newRemindTask',
    mode: 'modal',
  })


export default createAppContainer(AppStackNavigator)