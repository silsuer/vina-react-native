import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, Image, Animated, Easing, DeviceEventEmitter } from 'react-native';
import HomeButton from '../main/HomeButton/HomeButtom'
import BottomTabBar from '../common/TabBar/BottomTabBar'
import IndexSvg from '../assets/svgs/IndexSvg/IndexSvg'
import TaskTabBarSvg from '../assets/svgs/TaskTabBarSvg/TaskTabBarSvg'
import StatisticsBarSvg from '../assets/svgs/StatisticsBarSvg/StatisticsBarSvg'
import MineBarSvg from '../assets/svgs/MineBarSvg/MineBarSvg'

import Config from '../../configs/app'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

export default class FooterView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectIconIndex: 0,  // 默认第一页选中
        }

    }


    componentDidMount() {
        this.selectTabBarListener = DeviceEventEmitter.addListener("selectTabBar", (index) => {
            this.setState({ selectIconIndex: index })
        })
    }

    componentWillUnmount() {
        this.selectTabBarListener.remove()
    }




    render() {
        let styles = StyleSheet.create({
            container: {
                // flex:5,
                bottom: 30,
                width: windowWidth,
                justifyContent: 'center',
                alignItems: 'center',
            },
            homeButton: {
                position: 'absolute',
                right: 40,
                bottom: 40,
            },
        })

        const tabBarOptions = [
            {
                icon: <IndexSvg width="20" selected={this.state.selectIconIndex === 0 ? true : false} height="20" />,
                label: '首页',
                name: 'home'
            },
            {
                icon: <TaskTabBarSvg selected={this.state.selectIconIndex === 1 ? true : false} width="20" height="20" />,
                label: '便签本',
                name: 'task'
            },
            {
                icon: <StatisticsBarSvg selected={this.state.selectIconIndex === 2 ? true : false} width="25" height="25" />,
                label: '统计',
                name: 'statistics'
            },
        ];


        return (
            <View style={styles.container}>

                {/* 导航栏 */}
                <View style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 60,
                }}>
                    <BottomTabBar backgroundColor={Config.mainColor} options={tabBarOptions} />
                </View>
                {/* 浮动一个圆形button */}
                <View style={styles.homeButton}>
                    <HomeButton backgroundColor={Config.mainColor} />
                </View>
            </View>
        )
    }
}

