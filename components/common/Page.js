// 这里是每个页面的具体框架
import React, { Component } from 'react'
import { View, StyleSheet, Animated, ScrollView, LayoutAnimation, AppState, DeviceEventEmitter, KeyboardAvoidingView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { withNavigation } from 'react-navigation'
import Config from '../../configs/app';
import Header from './Header/Header'
import FooterView from '../FooterView/FooterView'
import { TomatoTimer } from '../../services/model/tomato_timer'
import { TomatoTarBarSvg } from '../assets/svgs/TabBarIconSvg'
import { TaskIcon } from '../assets/svgs/NotesSvg'
import BottomNavigation from '../assets/svgs/BottomNavigation/BottomNavigation'
class Page extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentBody: this.props.body,
            opacity: new Animated.Value(1),
            showModal: false,
            modalComponent: null,

            tabBarOptions: this.props.tabBarOptions,
            buttonColor: Config.mainColor,
            buttonComponent: null,
            minute: 0,
            seconds: 0,
            showTitle: false,
            mode: 'common',  // mode分3种： common正常 work 工作番茄钟 rest 休息番茄钟
        }

        this.fadeOutAnimated = Animated.timing(
            this.state.opacity,
            {
                toValue: 0,
                duration: 200,
            }
        )

        this.fadeInAnimated = Animated.timing(
            this.state.opacity,
            {
                toValue: 1,
                duration: 300,
            }
        )
    }


    componentWillReceiveProps(props) {
        if (props.body !== this.state.currentBody) {
            LayoutAnimation.easeInEaseOut()
            this.setState({ currentBody: props.body })
        }
    }



    // 倒计时
    timerCountdown() {
        const currentSave = (timer) => {  // 保存当前状态
            timer.last_action_time = new Date(Date.now())
            storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer }).catch(err => console.log("保存数据失败:", err))
        }
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                if (timer === null) {
                    this.clearTimer()
                }
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
            }).catch(err => console.log("目前没有番茄钟历史存在:", err))
    }
    refreshState() {
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                if (timer) {
                    DeviceEventEmitter.emit("change-drawer-colors", timer.mode || 'common')
                    this.setState({
                        showTitle: true,
                        minute: timer.minute,
                        seconds: timer.seconds,
                        mode: timer.mode,
                    })
                    // 如果timer存在，不论是否过期，都应该显示出来
                    //TODO 根据timer的mode，设置颜色
                    if (this.timerIsExpired(timer) === true) { // 过期，显示 00:00
                        this.setState({ minute: 0, seconds: 0 })
                    } else {
                        // 未过期，启动定时器,每秒执行一次，并重新入库
                        if (timer.current_status == TomatoTimer.STATUS_RUNNING) {
                            this.startInterval()
                        }
                    }
                    // 添加一个直达的option
                    if (this.state.tabBarOptions.length > 0 && this.state.tabBarOptions[this.state.tabBarOptions.length - 1].name !== 'notes-navigate-to-tomato-timer') {
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
                    if (this.state.tabBarOptions.length > 0 && this.state.tabBarOptions[this.state.tabBarOptions.length - 1].name === 'notes-navigate-to-tomato-timer') {
                        let list = []
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

                    // 不显示title,颜色回归正常颜色
                    DeviceEventEmitter.emit("change-drawer-colors", 'common')
                    this.setState({ showTitle: false, mode: 'common' })
                }
            }).catch(err => console.log("目前不存在番茄钟历史:", err))
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
                storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer }).catch(err => console.log("保存数据失败:", err))
            }

            return timer  // 没有过期
        }
    }


    // 开启定时器
    startInterval() {
        storage.load({ key: Config.StartIntervalTagKey })
            .then((k) => {
                if (k === Config.StartIntervalTagValue) { // 存在定时器
                    // this.clearTimer()
                } else {
                    storage.save({ key: Config.StartIntervalTagKey, data: Config.StartIntervalTagValue })
                        .then(() => {
                            this.taskTimer = setInterval(this.timerCountdown.bind(this), 1000)
                        }).catch(err => console.log("保存数据失败:", err))
                }
            }).catch((err) => {
                if (err.name === 'NotFoundError') {  // 没找到数据
                    storage.save({ key: Config.StartIntervalTagKey, data: Config.StartIntervalTagValue })
                        .then(() => {
                            this.taskTimer = setInterval(this.timerCountdown.bind(this), 1000)
                        }).catch(err => console.log("保存数据失败:", err))
                }
            })
    }

    clearTimer() {
        storage.save({ key: Config.StartIntervalTagKey, data: null })
            .then(() => {
                this.taskTimer && clearInterval(this.taskTimer)
            }).catch(err => console.log("保存数据失败:", err))
    }

    componentDidMount() {

        // this.pageClearTimerListener = DeviceEventEmitter.addListener("page-clear-timer", () => {
        //     this.clearTimer()
        // })
        const refreshState = () => {
            return this.refreshState()
        }

        const clearTimer = () => {
            this.clearTimer()
        }

        this.viewDidAppear = this.props.navigation.addListener(
            'willFocus',
            (obj) => {
                refreshState()
            }
        )

        this.didBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                clearTimer()
            }
        );


        const nowPageIsFocused = () => {
            return this.props.navigation.isFocused()
        }

        AppState.addEventListener('change', function (nextState) {
            if (nextState === 'active') {  // 重新进入程序
                // 重新开启定时器
                if (nowPageIsFocused()) {
                    refreshState()
                }

            }
            if (nextState === 'inactive') {  // 退出程序
                // 取消定时器
                clearTimer()
            }
        })
    }

    componentWillUnmount() {
        AppState.removeEventListener('change')

        this.viewDidAppear.remove()
        this.didBlurSubscription.remove()
        // this.pageClearTimerListener.remove()
        this.clearTimer()
    }

    render() {

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            header: {
            },
            body: {
                flex: 6,
                marginTop: 10,
                alignItems: 'center'
            },
            footer: {
                position: 'absolute',
                bottom: 0,
            },
        });


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

        const getMainBackgroundColor = () => {
            let colors = [Config.mainColor, Config.finishColor]
            switch (this.state.mode) {
                case 'work':
                    colors = [Config.WorkTimerStartColor, Config.WorkTimerEndColor]
                    break
                case 'rest':
                    colors = [Config.RestTimerStartColor, Config.RestTimerEndColor]
                    break
                default:
                    break
            }
            return colors

        }

        const getHeaderBackgroundColor = () => {
            switch (this.state.mode) {
                case 'work':
                    return Config.WorkTimerStartColor
                case 'rest':
                    return Config.RestTimerStartColor
                default:
                    return Config.mainColor
            }
        }

        const getButtonIcon = () => {
            switch (this.state.mode) {
                case 'work':
                case 'rest':
                    return <TaskIcon width="20" height="20" />
                default:
                    return <BottomNavigation />
            }
        }

        const getHeader = () => {
            if (this.props.title === false) {
                return <View style={{ height: 30 }}></View>
            }
            return (
                <View style={styles.header}>
                    <Header
                        backgroundColor={getHeaderBackgroundColor()}
                        title={this.props.title}
                        fontColor={Config.headerFontColor}
                        left={this.props.left}
                        right={this.props.right}
                        avatar={require('../assets/images/default_avatar.jpg')} />
                </View>
            )
        }

        const getBody = () => {
            if (this.props.noScrollView) {
                return (
                    <Animated.View opacity={this.state.opacity} style={styles.body}>
                        {this.state.currentBody}
                    </Animated.View>
                )
            } else {
                return (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Animated.View opacity={this.state.opacity} style={styles.body}>
                            {this.state.currentBody}
                        </Animated.View>
                    </ScrollView>
                )
            }
        }

        return (
            <LinearGradient locations={[0.2, 1]} colors={getMainBackgroundColor()} style={styles.container} >
                <KeyboardAvoidingView behavior="padding" enabled>
                    {getHeader()}
                    <Animated.View opacity={this.state.opacity} style={styles.body}>
                        {this.state.currentBody}
                    </Animated.View>
                </KeyboardAvoidingView>
                <FooterView tabBarColor={getHeaderBackgroundColor()} buttonIcon={getButtonIcon()} tabBarOptions={this.state.tabBarOptions} title={getTitleString()} />

                {/* 留存dropList的所有 */}
                <View>
                    {this.props.children}
                </View>
            </LinearGradient>
        )
    }
}


export default withNavigation(Page)