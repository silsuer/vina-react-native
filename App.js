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
import NewTask from './components/main/NewTask/NewTask'    // 新建提醒任务
import { NotesSvg } from './components/assets/svgs/NotesSvg'  // 笔记svg
import NotesMainApp from './components/main/NotesMainApp'  // 笔记本界面
import NewNote from './components/main/NotesApp/New/NewNote'  // 新建笔记
import TomatoTimer from './components/common/TomatoTimer/TomatoTimer' // 番茄钟
import DrawerContentComponent from './components/common/Drawer'  // 侧边栏
import Pigeonhole from './components/main/NotesApp/Pigeonhole'  // 归档
import NewBill from './components/main/NotesApp/New/NewBill'  // 新建账单
import Markdown from './components/MarkdownText/MarkdownText'
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
    navigationOptions: {
      header: null
    }
  },
  tomatoTimer: {
    screen: TomatoTimer,
    navigationOptions: {
      header: null
    }
  },
  pigeonhole: {
    screen: Pigeonhole,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  newBill: {
    screen: NewBill,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  newMarkdown: {
    screen: Markdown,
    navigationOptions: {
      header: null
    }
  }
}, {
    // initialRouteName: 'Drawer',
    initialRouteName: 'newMarkdown',
    mode: 'modal',
  })


export default createAppContainer(AppStackNavigator)