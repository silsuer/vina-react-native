
import React, { Component } from 'react'
import { View } from 'react-native'
import Page from '../common/Page'
import { MenuIcon } from '../common/SlideIcons'
import { IndexSvg, TaskTabBarSvg, StatisticsBarSvg, MineBarSvg } from '../assets/svgs/TabBarIconSvg'
// 便签本主界面

export default class NotesMainApp extends Component {

    render() {
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
                        label: '首页',
                        name: 'Home'
                    },
                    {
                        icon: <TaskTabBarSvg width="20" height="20" />,
                        label: '便签本',
                        name: 'NewTask'
                    },
                    {
                        icon: <StatisticsBarSvg width="25" height="25" />,
                        label: '统计',
                        name: 'statistics'
                    },
                ]}
            />
        )
    }
}