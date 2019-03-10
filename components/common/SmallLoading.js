
// 小型loading图标
// 页面加载时候的loading
import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import { Smallloading } from '../assets/svgs/Common'



export default class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ratate: new Animated.Value(0),  // 旋转角度
            doing: true,
        }

        this.RatateAnimated = Animated.timing(
            this.state.ratate,
            {
                toValue: 360,
                duration: 2000,
                easing: Easing.linear
            }
        )
    }

    startAnimated() {
        this.state.ratate.setValue(0)
        this.RatateAnimated.start(() => {
            if (this.state.doing) {
                this.startAnimated()
            }
        })
    }
    componentDidMount() {
        this.startAnimated();
    }

    render() {

        return (
            <Animated.View style={{
                transform: [{
                    rotate: this.state.ratate
                        .interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] })
                }]
            }} >
                <Smallloading color="#d4d4d4" width="20" height="20" />
            </Animated.View>
        )
    }
}