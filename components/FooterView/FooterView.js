import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, Image, Animated, Easing, DeviceEventEmitter } from 'react-native';
import HomeButton from '../main/HomeButton/HomeButtom'
import BottomTabBar from '../common/TabBar/BottomTabBar'


import Config from '../../configs/app'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

export default class FooterView extends Component {




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

        return (
            <View style={styles.container}>

                {/* 导航栏 */}
                <View style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 60,
                }}>
                    {this.props.tabBarOptions.length === 0 ? <View></View> : <BottomTabBar backgroundColor={Config.mainColor} options={this.props.tabBarOptions} />}
                </View>
                {/* 浮动一个圆形button */}
                <View style={styles.homeButton}>
                    {this.props.tabBarOptions.length === 0 ? <View></View> : <HomeButton backgroundColor={Config.mainColor} />}

                </View>
            </View>
        )
    }
}

