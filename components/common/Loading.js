// 页面加载时候的loading
import React, { Component } from 'react'
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native'
import { LoadingSvg } from '../assets/svgs/Common'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height


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
        let styles = StyleSheet.create({
            container: {
                width: windowWidth,
                height: windowHeight,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        })
        return (
            <View style={styles.container}>
                <Animated.View style={{
                    transform: [{
                        rotate: this.state.ratate
                            .interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] })
                    }]
                }} >
                    <LoadingSvg width="55" height="55" />
                </Animated.View>
            </View>
        )
    }
}