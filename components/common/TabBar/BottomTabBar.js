import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import IndexSvg from '../../assets/svgs/IndexSvg/IndexSvg'
import TaskTabBarSvg from '../../assets/svgs/TaskTabBarSvg/TaskTabBarSvg'
import StatisticsBarSvg from '../../assets/svgs/StatisticsBarSvg/StatisticsBarSvg'
import MineBarSvg from '../../assets/svgs/MineBarSvg/MineBarSvg'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height



// 下方的导航栏
class BottomTabBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visiable: {
                home: false,  // 首页
                tasks: false,  // 任务
                statistics: false,  // 统计
                mine: false,    // 我的
            }
        }
    }

    // 点击事件
    buttonOnPress(type) {
        // 将这个button设置为选中状态，取消其他button的选中状态

        let data = this.state.visiable
        for (let n in data) {
            if (n === type) {
                data[n] = true
            } else {
                data[n] = false
            }
        }
        this.setState({ visiable: data })
        // 广播点击事件
        DeviceEventEmitter.emit("bottomTabBarClick", type)
    }


    render() {
        let styles = StyleSheet.create({
            container: {
                display: 'flex',
                flexDirection: 'row',
                width: windowWidth,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                backgroundColor: 'rgba(245,245,245,0.9)',
                height: 70,
                marginBottom: 5,
            },
            tab: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: windowWidth / 4,
                borderRightWidth: 1,
                borderRightColor: 'rgba(200,200,200,0.5)'
            }
        })



        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.buttonOnPress.bind(this, 'home')}>
                    <View style={styles.tab}>
                        <IndexSvg selected={this.state.visiable.home} width="26" height="26" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.buttonOnPress.bind(this, 'tasks')}>
                    <View style={styles.tab}>
                        <TaskTabBarSvg selected={this.state.visiable.tasks} width="35" height="35" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.buttonOnPress.bind(this, 'statistics')}>
                    <View style={styles.tab}>
                        <StatisticsBarSvg selected={this.state.visiable.statistics} width="30" height="30" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.buttonOnPress.bind(this, 'mine')}>
                    <View style={styles.tab}>
                        <MineBarSvg selected={this.state.visiable.mine} width="26" height="26" />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default BottomTabBar