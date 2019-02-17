
import React, { Component } from 'react'
import { DeviceEventEmitter } from 'react-native'
import Page from '../common/Page'
import { MenuIcon } from '../common/SlideIcons'
import { IndexSvg, TaskTabBarSvg, StatisticsBarSvg, MineBarSvg } from '../assets/svgs/TabBarIconSvg'

import RecentView from './NotesApp/Recent';
import All from './NotesApp/All';
import Statistics from './NotesApp/Statistics';

// 便签本主界面
export default class NotesMainApp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentPage: 'notes-home',
        }
    }

    componentDidMount() {
        this.selectTabBarListener = DeviceEventEmitter.addListener("selectTabBar", (name) => {
            this.setState({ currentPage: name })
        })
    }

    componentWillUnmount() {
        this.selectTabBarListener.remove()
    }

    // 获取当前页面中的body
    getCurrentBodyComponent() {
        switch (this.state.currentPage) {
            case 'notes-all':
                return (
                    <All />
                )
            case 'notes-statistics':
                return (
                    <Statistics />
                )
            case 'notes-home':
            default:
                return (
                    <RecentView />
                )
        }
    }


    render() {
        // title header中的名称
        // left header中的左侧button
        // right header中的右侧button
        // tabBarOptions 页面下方的导航栏
        // body 页面主体
        return (
            <Page
                title="最近"
                left={[
                    <MenuIcon onPress={() => { this.props.navigation.openDrawer() }} />
                ]}
                right={[]}
                tabBarOptions={[
                    {
                        icon: <IndexSvg width="20" height="20" />,
                        label: '最近',
                        name: 'notes-home'
                    },
                    {
                        icon: <TaskTabBarSvg width="20" height="20" />,
                        label: '全部',
                        name: 'notes-all'
                    },
                    {
                        icon: <StatisticsBarSvg width="25" height="25" />,
                        label: '统计',
                        name: 'notes-statistics'
                    },
                ]}
                body={this.getCurrentBodyComponent() }
            />
        )
    }
}