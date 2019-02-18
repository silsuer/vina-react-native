import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, DeviceEventEmitter, Animated, Easing } from 'react-native'
import { withNavigation } from 'react-navigation'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height



const configWidth = 50
const initWidth = 1
// 下方的导航栏
class BottomTabBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            perWidth: new Animated.Value(initWidth),  // 每一个icon的宽度
            containerWidth: new Animated.Value(initWidth),
            leftFillViewWidth: new Animated.Value(initWidth),
            rightFillViewWidth: new Animated.Value(initWidth),
            status: 'close', // open 导航处于打开状态 close 关闭
            currentIconIndex: 0,  // 当前选中的tab的索引
        }

        this.perWidthAnimatedOpen = Animated.timing(
            this.state.perWidth,
            {
                toValue: configWidth,
                duration: 150,
                easing: Easing.linear
            }
        )


        this.containerWidthAnimatedOpen = Animated.timing(
            this.state.containerWidth,
            {
                toValue: (this.props.options.length + 1) * configWidth,
                duration: 100,
                easing: Easing.linear
            }
        )

        this.leftFillViewWidthAnimatedOpen = Animated.timing(
            this.state.leftFillViewWidth,
            {
                toValue: configWidth / 2,
                duration: 150,
                easing: Easing.linear
            }
        )

        this.rightFillViewWidthAnimatedOpen = Animated.timing(
            this.state.rightFillViewWidth,
            {
                toValue: configWidth * 0.7,
                duration: 150,
                easing: Easing.linear
            }
        )

        this.perWidthAnimatedClose = Animated.timing(
            this.state.perWidth,
            {
                toValue: initWidth,
                duration: 150,
                easing: Easing.linear
            }
        )


        this.containerWidthAnimatedClose = Animated.timing(
            this.state.containerWidth,
            {
                toValue: initWidth,
                duration: 100,
                easing: Easing.linear
            }
        )

        this.leftFillViewWidthAnimatedClose = Animated.timing(
            this.state.leftFillViewWidth,
            {
                toValue: initWidth,
                duration: 150,
                easing: Easing.linear
            }
        )

        this.rightFillViewWidthAnimatedClose = Animated.timing(
            this.state.rightFillViewWidth,
            {
                toValue: initWidth,
                duration: 150,
                easing: Easing.linear
            }
        )

    }

    componentDidMount() {
        // 触发导航栏
        this.clickHomeButtonListener = DeviceEventEmitter.addListener("clickHomeButton", () => {
            if (this.state.status === 'open') {
                this.closeTabBar()
            } else {
                this.openTabBar()
            }
        })
        this.closeTabBarListener = DeviceEventEmitter.addListener("closeTabBar", () => {
            if (this.state.status === 'open') {
                this.closeTabBar()
            }
        })
        this.openTabBarListener = DeviceEventEmitter.addListener("openTabBar", () => {
            if (this.state.status === 'close') {
                this.openTabBar()
            }
        })
    }

    componentWillUnmount() {
        this.clickHomeButtonListener.remove()
        this.openTabBarListener.remove()
        this.closeTabBarListener.remove()
    }

    // 打开导航栏
    openTabBar() {
        this.containerWidthAnimatedOpen.start(() => {
            this.perWidthAnimatedOpen.start()
            this.rightFillViewWidthAnimatedOpen.start()
        })
        this.setState({ status: 'open' })
    }
    // 关闭导航栏
    closeTabBar() {
        this.perWidthAnimatedClose.start()
        this.leftFillViewWidthAnimatedClose.start()
        this.rightFillViewWidthAnimatedClose.start(() => {
            this.containerWidthAnimatedClose.start()
            this.setState({ status: 'close' })
        })


    }
    // 点击事件
    buttonOnPress(index) {
        // 将这个button设置为选中状态，取消其他button的选中状态
        // 广播点击事件
        // 导航栏中的切换不走navigation，而是直接响应到mainApp中，用动画切换

        DeviceEventEmitter.emit("selectTabBar", this.props.options[index].name)
        this.setState({ currentIconIndex: index })

        // 点击导航中的button
        // this.props.navigation.navigate(this.props.options[index].name)
    }

    // 生成导航栏
    generateTabBar() {
        return this.props.options.map((option, index) => {
            return (
                // 如果是第一位和最后一位，则加一个宽度是普通icon一半的view,如果是当前选项，则加一个半透明遮罩
                <TouchableOpacity style={{
                    display: this.state.status === 'open' ? 'flex' : 'none',
                    flexDirection: 'row',
                }} key={index} onPress={this.buttonOnPress.bind(this, index)}>
                    {index === 0 ? <Animated.View style={{ width: this.state.leftFillViewWidth }}></Animated.View> : <View></View>}
                    <Animated.View opacity={this.state.currentIconIndex === index ? 0.9 : 0.5} style={index === this.props.options.length - 1 ? {
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: this.state.perWidth,
                        position: 'relative',
                    } : {
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: this.state.perWidth,
                            borderRightWidth: 1,
                            borderRightColor: 'rgba(200,200,200,0.5)',
                            position: 'relative',
                        }}>
                        {option.icon}
                        <Text style={{
                            fontSize: 8,
                            marginTop: 3,
                            color: 'white',
                            // display: 'none'
                        }}>{option.label}</Text>
                    </Animated.View>
                    {index === this.props.options.length - 1 ? <Animated.View style={{ width: this.state.rightFillViewWidth }}></Animated.View> : <View></View>}
                </TouchableOpacity>
            )
        })
    }

    render() {
        return (
            <Animated.View style={{
                display: this.state.status === 'open' ? 'flex' : 'none',
                flexDirection: 'row',
                width: this.state.containerWidth,
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: this.props.backgroundColor + "99",
                height: 45,
                borderRadius: 24,
            }}>
                {this.generateTabBar()}
            </Animated.View>
        )
    }
}

export default withNavigation(BottomTabBar)