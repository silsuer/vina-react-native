import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, Image, Animated, Easing, DeviceEventEmitter } from 'react-native';
import HomeButton from '../main/HomeButton/HomeButtom'
import BottomTabBar from '../common/TabBar/BottomTabBar'
import { withNavigation } from 'react-navigation'
import { TomatoTarBarSvg } from '../assets/svgs/TabBarIconSvg'
import { TomatoTimer } from '../../services/model/tomato_timer'
import Config from '../../configs/app'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

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

    // 判断当前番茄钟是否过期
    timerIsExpired(timer) {
        let now = Date.parse(new Date())// 当前时间戳
        let lastActionTime = Date.parse(new Date(timer.last_action_time))
        if ((now - lastActionTime) > (timer.minute * 60 + timer.seconds) * 1000) {
            return true  // 过期
        } else {
            // 没有过期，重新刷新数据
            // 根据现在时间和上次操作时间，重新刷新timer
            if (timer.current_status == TomatoTimer.STATUS_RUNNING) {
                let nowLength = ((timer.minute * 60 + timer.seconds) * 1000 - (now - lastActionTime)) / 1000  // 现在还差的秒数
                // 根据秒数重新生成分钟数和秒数
                timer.minute = Math.floor(nowLength / 60) || 0
                timer.seconds = nowLength - timer.minute * 60 || 0
                timer.last_action_time = new Date(Date.now())
                storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer })
            }

            return timer  // 没有过期
        }
    }


    refreshState() {
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                if (timer) {
                    this.setState({ showTitle: true, minute: timer.minute, seconds: timer.seconds })
                    // 如果timer存在，不论是否过期，都应该显示出来
                    //TODO 根据timer的mode，设置颜色
                    if (this.timerIsExpired(timer) === true) { // 过期，显示 00:00

                    } else {
                        // 未过期，启动定时器,每秒执行一次，并重新入库
                        if (timer.current_status == TomatoTimer.STATUS_RUNNING) {
                            this.taskTimer = setInterval(this.timerCountdown.bind(this), 1000)
                        }
                    }
                    // 添加一个直达的option
                    if (!(this.alreadyAddOption)) {
                        this.alreadyAddOption = true
                        let list = this.state.tabBarOptions
                        list.push({
                            icon: <TomatoTarBarSvg width="20" height="20" />,
                            label: '番茄钟',
                            name: 'notes-navigate-to-tomato-timer',
                            height: 20,
                        })
                        this.setState({
                            tabBarOptions: list
                        })
                    }
                } else {
                    // 判断是否有番茄钟option，如果有，则删除
                    if (this.alreadyAddOption === true) {
                        this.alreadyAddOption === false
                        let list = []
                        if (this.state.tabBarOptions[this.state.tabBarOptions.length - 1].name === 'notes-navigate-to-tomato-timer') {
                            for (let i = 0; i < this.state.tabBarOptions.length; i++) {
                                if (i >= this.state.tabBarOptions.length - 1) {
                                    continue
                                } else {
                                    list.push(this.state.tabBarOptions[i])
                                }
                            }
                            this.setState({
                                tabBarOptions: list
                            })
                        }

                    }
                    // 不显示title,颜色回归正常颜色
                    this.setState({ showTitle: false })
                }
            })
    }

    componentWillUnmount() {
        this.viewDidAppear.remove()
        this.didBlurSubscription.remove()
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.refreshState()
            }
        )

        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.taskTimer && clearInterval(this.taskTimer)
            }
        );


    }


    // 倒计时
    timerCountdown() {
        const currentSave = (timer) => {  // 保存当前状态
            timer.last_action_time = new Date(Date.now())
            storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer })
        }
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                console.log(timer)
                if (timer.minute === 0 && timer.seconds === 0) {  //   任务完成,入库
                    // TODO  入库逻辑
                    this.taskTimer && clearInterval(this.taskTimer) // 停止计时
                } else {
                    if (this.state.seconds === 0 && this.state.minute > 0) {
                        timer.minute = timer.minute - 1
                        timer.seconds = 59
                        this.setState({ seconds: 59, minute: timer.minute }, () => { currentSave(timer) })
                    } else {
                        timer.seconds = timer.seconds - 1
                        this.setState({ seconds: timer.seconds }, () => { currentSave(timer) })
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
            let options = this.state.tabBarOptions
            return options
        }

        const getTitleString = () => {
            if (this.state.showTitle === false) {
                return ''
            }
            let m = ''
            let s = ''
            if (this.state.minute < 10) {
                m = '0' + this.state.minute
            } else {
                m = '' + this.state.minute
            }

            if (this.state.seconds < 10) {
                s = '0' + this.state.seconds
            } else {
                s = '' + this.state.seconds
            }
            return m + ":" + s
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
                    {getData().length === 0 ? <View></View> : <HomeButton title={getTitleString()} backgroundColor={Config.mainColor} />}
                </View>
            </View>
        )
    }
}

export default withNavigation(FooterView)