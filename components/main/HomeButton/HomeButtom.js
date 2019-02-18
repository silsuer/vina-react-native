import React, { Component } from 'react';
import { StyleSheet, View, PanResponder, Alert, ImageBackground, Image, DeviceEventEmitter } from 'react-native';
import { createStackNavigator, createAppContainer, withNavigation } from 'react-navigation';
import ButtonRadius from '../../common/ButtonRadius/ButtonRadius';
import BottomNavigation from '../../assets/svgs/BottomNavigation/BottomNavigation';
import BottomTabBar from '../../common/TabBar/BottomTabBar';
// 首页中的最重要的button，用来制作所有手势
class HomeButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            top: 0,
            left: 0,
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gs) => {
                // 申请成功
                this._top = this.state.top
                this._left = this.state.left
                // 准备开始移动，显示出地球背景
                // 触发移动事件
                DeviceEventEmitter.emit("moveHomeButton")
            },
            onPanResponderMove: (evt, gs) => {
                // 响应移动,每移动一点都会触发一次
                // 计算角度，只让在水平或垂直线上移动

                this.setState({
                    top: this._top + gs.dy,
                    left: this._left + gs.dx
                })
                // 判定移动速度和移动距离，显示下方图片
            },
            onPanResponderRelease: (evt, gs) => {
                // 判断移动距离如果未超过指定值,则触发缩回按钮
                // console.log(this.state.top - this._top)
                let topOffset = this._top - this.state.top
                if (topOffset < 120) {
                    DeviceEventEmitter.emit("moveDownFooterView")
                }
                this.setState({
                    top: this._top,
                    left: this._left
                })
            }
        })
    }

    homeButtonOnPress() {
        // 跳转到开始番茄页面
        // this.props.navigation.navigate('TomatoTimer')
        // 跳转到新建任务页面
        // this.props.navigation.navigate('NewTask')
        // 跳转到首页
        // this.props.navigation.navigate('Index')
        DeviceEventEmitter.emit("clickHomeButton")  //  触发显示/关闭导航按钮
    }

    render() {

        let styles = StyleSheet.create({
            position: {
                top: this.state.top,
                left: this.state.left,
            },
            tabBar: {
                position: 'absolute',
                bottom: 40,
            }
        })

        return (
            //  在App.js中，这个view应该是浮动在整个页面上面的
            <View
                style={styles.position}
                // {...this._panResponder.panHandlers}
            >


                <ButtonRadius
                    onPress={this.homeButtonOnPress.bind(this)}
                    style={styles.button}
                    diameter={55}
                    color={this.props.backgroundColor}
                    icon={<BottomNavigation />}
                // title="导航"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {

    }
})



export default withNavigation(HomeButton);