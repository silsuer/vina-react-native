import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, Image, Animated, Easing, DeviceEventEmitter } from 'react-native';
import HomeButton from '../main/HomeButton/HomeButtom'
import BottomTabBar from '../common/TabBar/BottomTabBar'
import { withNavigation } from 'react-navigation'
import Config from '../../configs/app'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width

class FooterView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabBarOptions: this.props.tabBarOptions,
            buttonColor: Config.mainColor,
            buttonComponent: null,
            minute: 0,
            seconds: 0,
            mode: 'common',  // 模式 common是正常模式， tomato-timer是显示番茄钟的模式
            showTitle: false,
        }
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


        return (
            <View style={styles.container}>

                {/* 导航栏 */}
                <View style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 60,
                }}>
                    {this.props.tabBarOptions.length === 0 ? <View></View> : <BottomTabBar backgroundColor={this.props.tabBarColor || Config.mainColor} options={this.props.tabBarOptions} />}
                </View>
                {/* 浮动一个圆形button */}
                <View style={styles.homeButton}>
                    {this.props.tabBarOptions.length === 0 ? <View></View> : <HomeButton icon={this.props.buttonIcon} title={this.props.title} backgroundColor={this.props.tabBarColor || Config.mainColor} />}
                </View>
            </View>
        )
    }
}

export default withNavigation(FooterView)