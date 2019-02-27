import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, Image, Animated, Easing, DeviceEventEmitter } from 'react-native';
import HomeButton from '../main/HomeButton/HomeButtom'
import BottomTabBar from '../common/TabBar/BottomTabBar'


import Config from '../../configs/app'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

export default class FooterView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabBarOptions: this.props.tabBarOptions,
            buttonColor: Config.mainColor,
            buttonComponent: null,
            buttonText: '',
            minute: 0,
            seconds: 0,
        }
    }

    // 判断当前番茄钟是否过期
    timerIsExpired(timer) {
        console.log(timer)
        let now = Date.parse(new Date())// 当前时间戳
        let lastActionTime = Date.parse(new Date(timer.last_action_time))
        if ((now - lastActionTime) > (timer.minute * 60 + timer.seconds) * 1000) {
            return true  // 过期
        } else {
            // 没有过期，重新刷新数据
            // 根据现在时间和上次操作时间，重新刷新timer
            let nowLength = (timer.minute.minute * 60 + timer.seconds) - (now - lastActionTime)  // 现在还差的秒数
            // 根据秒数重新生成分钟数和秒数
            timer.minute = Math.floor(nowLength / 60)
            timer.seconds = nowLength - timer.minute * 60
            timer.last_action_time = new Date(Date.now())
            storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer })
            return timer  // 没有过期
        }
    }

    componentDidMount() {
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                if (timer) {
                    // 如果timer存在，不论是否过期，都应该显示出来
                    if (this.timerIsExpired(timer) === true) { // 过期，显示 00:00

                    } else {
                        // 未过期，启动定时器,每秒执行一次，并重新入库
                    }
                }
            })
    }

    render() {
        let styles = StyleSheet.create({
            container: {
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

        const getData = () => {
            return this.state.tabBarOptions
        }

        return (
            <View style={styles.container}>

                {/* 导航栏 */}
                <View style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 60,
                }}>
                    {getData().length === 0 ? <View></View> : <BottomTabBar backgroundColor={Config.mainColor} options={getData()} />}
                </View>
                {/* 浮动一个圆形button */}
                <View style={styles.homeButton}>
                    {getData().length === 0 ? <View></View> : <HomeButton backgroundColor={Config.mainColor} />}
                </View>
            </View>
        )
    }
}

