import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, Image, Animated, Easing, DeviceEventEmitter } from 'react-native';
import HomeButton from '../main/HomeButton/HomeButtom'

import BottomTabBar from '../common/TabBar/BottomTabBar'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

export default class FooterView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bgImageBottom: new Animated.Value(-260),
        }
        this.MovedAnimatedUp = Animated.timing(
            this.state.bgImageBottom,
            {
                toValue: -60,
                duration: 200,
                easing: Easing.linear
            }
        )

        this.MovedAnimatedDown = Animated.timing(
            this.state.bgImageBottom,
            {
                toValue: -260,
                duration: 200,
                easing: Easing.linear
            }
        )
    }


    componentDidMount() {
        this.moveHomeButtonListener = DeviceEventEmitter.addListener("moveHomeButton", () => {
            this.HomeUp()
        })

        this.moveDownFooterViewListener = DeviceEventEmitter.addListener("moveDownFooterView", () => {
            this.HomeDown()
        })
    }

    componentWillUnmount() {
        this.moveHomeButtonListener.remove()
        this.moveDownFooterViewListener.remove()
    }


    // 1. home背景上浮
    // 2. 当前view缩小成卡片
    // 3. 显示左右旧卡片
    HomeUp() {
        this.MovedAnimatedUp.start()
        // 通知主界面缩小当前view
        DeviceEventEmitter.emit("narrowCurrentView")
    }
    // 1. home背景向下消失
    // 2. 中间卡片放大充满屏幕
    // 3. 两侧卡片消失
    HomeDown() {
        this.MovedAnimatedDown.start()
        // 通知主界面还原当前View
        DeviceEventEmitter.emit("reductionCurrentView")
    }

    render() {
        let styles = StyleSheet.create({
            container: {
                // flex:5,
                bottom: 50,
                width: windowWidth,
                justifyContent: 'center',
                alignItems: 'center',
            },
            homeButton: {
                position: 'absolute',
            },
        })
        return (
            <View style={styles.container}>
                {/* 拖拽home会出现的背景图片 */}
                <Animated.View style={{
                    position: 'absolute',
                    bottom: this.state.bgImageBottom
                }}>
                    <Image style={{ width: 250, height: 150,marginBottom:10 }} source={require('../assets/images/earth_bg.png')} />
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    bottom: this.state.bgImageBottom
                }}>
                    {/* 导航栏 */}
                    <BottomTabBar />
                </Animated.View>
                {/* 浮动一个圆形button */}
                <HomeButton style={styles.homeButton} />
            </View>
        )
    }
}

