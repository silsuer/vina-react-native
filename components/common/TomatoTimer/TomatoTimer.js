import React, { Component } from 'react'
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, AppState } from 'react-native';
import { withNavigation } from 'react-navigation'
import { Provider, Modal, List, Switch, Slider } from '@ant-design/react-native'
import TimerCircularProgress from '../../main/TimerCircularProgress/TimerCircularProgress'
import TaskTimerStartSvg from '../../assets/svgs/TaskTimerStartSvg/TaskTimerStartSvg'
import TaskTimerStopSvg from '../../assets/svgs/TaskTimerStopSvg/TaskTimerStopSvg';
import TaskTimerPauseSvg from '../../assets/svgs/TaskTimerPauseSvg/TaskTimerPauseSvg';
import { RemindTask } from '../../../services/model/remind_task'
import { GoBackSvg } from '../../assets/svgs/Common'
import LinearGradient from 'react-native-linear-gradient'
import { TomatoTimer as T } from '../../../services/model/tomato_timer'
import { PushNotificationRecord } from '../../../services/model/push_notification_records'
import Config from '../../../configs/app'
import { nowDateTime } from '../../../services/model/base';
import RNIdle from 'react-native-idle'
import Music from '../../common/Music'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height


// 番茄计时器界面
class TomatoTimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskOptionsJustifyContent: 'center',  // 在未开始（不显示暂停、停止按钮的时候是居中），开始后使用的是space-between
            pauseButtonStatus: 'pause',  // 正常状态下是显示暂停icon，点击后变为开始icon
            total: Config.TomatoTimerLength,  // 默认番茄时间是25分钟
            minute: Config.TomatoTimerLength, // 当前番茄分钟数
            seconds: 0, // 当前番茄秒数
            type: 'work',  // 工作番茄钟是 work， 休息番茄钟是 rest
            title: '番茄钟',
            showGoBackButton: false,   // 是否显示返回按钮
            headerRight: null,
            showHeaderRight: false,  // 不显示headerRight
            showMusicModal: false,
        }
    }



    // 判断当前番茄钟是否过期
    timerIsExpired(timer) {
        let now = Date.parse(new Date())// 当前时间戳
        let lastActionTime = Date.parse(new Date(timer.last_action_time))
        if ((now - lastActionTime) > ((timer.minute * 60 + timer.seconds) * 1000)) {
            return true  // 过期
        } else {
            if (timer.current_status == T.STATUS_RUNNING) {
                // 没有过期，重新刷新数据
                // 根据现在时间和上次操作时间，重新刷新timer
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

    // 根据传来的任务id设置当前的番茄钟
    setCurrentTomatoTimer(id) {
        let t = new RemindTask()
        t.findOne(id).then((res) => {
            // 根据传来的数据设置 headerRight
            let right = null
            let showRight = false
            if (res.current_finish_tomato_number !== undefined && res.tomato_number !== 0) { // 如果存在
                showRight = true
                right = (
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                        <Text style={{ color: '#ffffff99' }}>{(res.current_finish_tomato_number + 1) + '/' + res.tomato_number}</Text>
                        {/* <TomatoSvg color="#ffffff99" width="20" height="20" /> */}
                    </View>
                )
            }
            this.setState({ title: res.title, headerRight: right, showHeaderRight: true })
        })
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
                        })
                }
            }).catch((err) => {
                if (err.name === 'NotFoundError') {  // 没找到数据
                    storage.save({ key: Config.StartIntervalTagKey, data: Config.StartIntervalTagValue })
                        .then(() => {
                            this.taskTimer = setInterval(this.timerCountdown.bind(this), 1000)
                        })
                }
            })
    }

    refreshState() {
        const navigation = this.props.navigation
        // 判断是否存在番茄钟
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                if (timer) {  // 存在番茄钟，不论是否过期都显示在页面上
                    if (timer.remind_task_id) {
                        this.setCurrentTomatoTimer(timer.remind_task_id)
                    }
                    // 如果已经结束，设置正常结束功能
                    // 如果未结束，设置minute和seconds并且开启定时器
                    let t = this.timerIsExpired(timer)
                    if (t === true) {  // 过期
                        this.setState({ minute: 0, seconds: 0, type: timer.mode || 'work' }, () => {
                            if (navigation && navigation.getParam('id') && (navigation.getParam('id') !== timer.remind_task_id)) {
                                // log("加载新的数据")
                                this.setCurrentTomatoTimer(navigation.getParam('id'))
                            } else {
                                this.taskNormalFinish()
                            }
                        })
                    } else {  // 没过期
                        if (navigation && navigation.getParam('id') && (navigation.getParam('id') !== timer.remind_task_id)) {
                            // 没过期，传入了id
                            Alert.alert('存在正在运行的番茄钟', '确认要强制停止吗?', [
                                {
                                    text: '取消',
                                    onPress: () => {
                                        navigation.goBack()  // 返回
                                    }
                                }, {
                                    text: '强制停止',
                                    onPress: () => {
                                        // 停止当前番茄钟
                                        this.stopTask(true)
                                        this.setCurrentTomatoTimer(navigation.getParam('id'))
                                    }
                                }
                            ])
                        } else {
                            this.setState({
                                minute: t.minute,
                                seconds: t.seconds,
                                type: t.mode,
                                taskOptionsJustifyContent: 'space-between',
                                pauseButtonStatus: t.current_status === T.STATUS_RUNNING ? 'pause' : 'start'
                            })
                            // 如果是正在运行，则启动定时器
                            if (t.current_status == T.STATUS_RUNNING) {
                                this.startInterval()
                            }
                        }
                    }
                }
                else {
                    if (navigation.getParam('id')) {
                        this.setCurrentTomatoTimer(navigation.getParam('id'))
                    }
                }
            })
    }

    clearTimer() {
        storage.save({ key: Config.StartIntervalTagKey, data: null })
            .then(() => {
                this.taskTimer && clearInterval(this.taskTimer)
            })

    }

    // 挂载组件后要执行的方法
    componentDidMount() {
        // 设置屏幕常亮
        RNIdle.disableIdleTimer()
        this.refreshState()

        const refreshState = () => {
            return this.refreshState()
        }

        const clearTimer = () => {
            this.clearTimer()
        }
        const nowPageIsFocused = () => {
            return this.props.navigation.isFocused()
        }
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.refreshState()
            }
        )

        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.clearTimer()
            }
        );


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



    // 组件卸载时清除定时器
    componentWillUnmount() {
        this.clearTimer()
        // 取消屏幕常亮
        RNIdle.enableIdleTimer()

    }

    // 开始任务
    async startTask() {
        // 显示 暂停/停止 按钮
        this.setState({ taskOptionsJustifyContent: 'space-between' })

        // 触发开始定时器事件
        // 创建一行番茄钟历史
        let t = new T()
        t.insertInit(this.props.navigation.getParam('id', 0), this.state.type).then((insertId) => {
            let timer = {
                start_at: nowDateTime(),
                id: insertId,
                remind_task_id: this.props.navigation.getParam('id', 0),
                mode: this.state.type,
                current_status: T.STATUS_RUNNING,  // 正在执行
                minute: this.state.minute ? this.state.minute : 0,
                seconds: this.state.seconds ? this.state.seconds : 0,
                last_action_time: new Date(Date.now())
            }

            // 保存到localstorage
            storage.save({
                key: Config.TomatoTimerLocalStorageKey,
                data: timer
            }).then((r) => {
                // 打开倒计时定时器
                this.startInterval()
            })
            // 添加一个本地通知，当结束时进行通知
            let p = new PushNotificationRecord()
            p.addTomatoLocationNotification({ taskId: this.props.navigation.getParam('id', 0), tomatoTimerId: insertId, seconds: this.state.seconds, minute: this.state.minute, mode: this.state.type })
                .then((insertId) => {
                    // console.log(insertId)
                })
        })

    }

    // 计时器倒计时逻辑
    timerCountdown() {
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                if (timer === null) {
                    this.clearTimer()
                }
                // 将当前state中的minute和seconds减一，直到为0
                if (timer.minute === 0 && timer.seconds === 0) {
                    // 触发完成事件
                    this.taskNormalFinish()
                    //TODO 判断是否有下一个番茄
                    // 移除定时器
                    this.clearTimer()
                } else {
                    if (timer.seconds === 0 && timer.minute > 0) {
                        timer.minute = timer.minute - 1
                        timer.seconds = 59
                        timer.last_action_time = new Date(Date.now())
                        this.setState({ seconds: 59, minute: timer.minute })
                        storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer })
                    } else {
                        timer.seconds = timer.seconds - 1
                        timer.last_action_time = new Date(Date.now())
                        this.setState({ seconds: timer.seconds })
                        storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer })
                    }
                }
            })

    }



    goBack() {
        this.clearTimer()  // 清除定时器
        this.props.navigation.goBack()
    }

    // 根据倒计时的时间，返回在计时器上的字符串
    getTimerString(minute, seconds) {
        let m = ''
        let s = ''
        if (minute < 10) {
            m = '0' + minute
        } else {
            m = '' + minute
        }

        if (seconds < 10) {
            s = '0' + seconds
        } else {
            s = '' + seconds
        }
        return m + ":" + s
    }

    // 获取计时器的百分比
    getTimerPercent() {
        return (1 - (this.state.minute * 60 + this.state.seconds) / (this.state.total * 60)) * 100
    }


    // 暂停任务
    pauseTask() {
        // 判断当前暂停任务状态，如果是pause，则执行暂停任务逻辑，如果是start，则执行继续任务逻辑
        if (this.state.pauseButtonStatus === "pause") { // 暂停任务逻辑
            this.setState({ pauseButtonStatus: 'start' })
            // 设置storage 状态
            storage.load({ key: Config.TomatoTimerLocalStorageKey }).then((timer) => {
                timer.current_status = T.STATUS_PAUSE
                timer.minute = this.state.minute
                timer.seconds = this.state.seconds
                timer.last_action_time = new Date(Date.now())
                storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer })

                // 取消番茄钟的本地通知，当重新开始的时候再次添加
                let p = new PushNotificationRecord()
                p.cancelLocalTomatoNotification(timer.id)
            })
            this.clearTimer()
        } else if (this.state.pauseButtonStatus === "start") { // 继续任务逻辑
            storage.load({ key: Config.TomatoTimerLocalStorageKey }).then((timer) => {

                timer.current_status = T.STATUS_RUNNING
                timer.last_action_time = new Date(Date.now())
                timer.minute = this.state.minute
                timer.seconds = this.state.seconds
                this.setState({ pauseButtonStatus: 'pause', minute: timer.minute, seconds: timer.seconds })
                storage.save({ key: Config.TomatoTimerLocalStorageKey, data: timer })
                this.startInterval()
                // 添加通知
                let p = new PushNotificationRecord()
                p.addTomatoLocationNotification({
                    minute: timer.minute,
                    seconds: timer.seconds,
                    tomatoTimerId: timer.id,
                    mode: this.state.mode
                })
            })
        }
    }


    // 进行下一个番茄钟，如果不传入id，则是当前任务的下一个番茄钟
    toNextTomatoTimer() {

    }

    // 任务正常倒计时到最后
    taskNormalFinish() {
        // 修改表中数据为正常结束
        storage.load({ key: Config.TomatoTimerLocalStorageKey })
            .then((timer) => {
                let t = new T()
                // 更新状态
                t.updateToStopTimer(timer.id, T.STAUS_NORMAL_STOP)
                // DeviceEventEmitter.emit("page-clear-timer")
                // 销毁kv缓存
                storage.save({ key: Config.TomatoTimerLocalStorageKey, data: null })
                    .then(() => {
                        // 弹出是否休息或者继续进行
                        Alert.alert(this.state.type === 'work' ? '完成!' : '休息时间到!', this.state.type === 'work' ? '休息一下吧!' : '休息好了吗？继续？', [
                            {
                                text: this.state.type === 'work' ? '休息一下' : '再休息一会儿',
                                onPress: () => {
                                    this.setState({
                                        total: Config.RestTomatoTimerLength,
                                        minute: Config.RestTomatoTimerLength,
                                        seconds: 0,
                                        type: 'rest',
                                        taskOptionsJustifyContent: 'center',
                                        pauseButtonStatus: 'pause',
                                    }, () => {
                                        // 开启番茄钟
                                        this.startTask()
                                    })
                                }
                            },
                            {
                                text: this.state.type === 'work' ? '不了,继续奋斗!' : '继续奋斗！',
                                onPress: () => {

                                    // 继续下一个番茄钟
                                    this.setState({
                                        total: Config.TomatoTimerLength,
                                        minute: Config.TomatoTimerLength,
                                        seconds: 0,
                                        type: 'work',
                                        taskOptionsJustifyContent: 'center',
                                        pauseButtonStatus: 'pause',
                                    }, () => {

                                    })

                                }
                            }
                        ])
                    })
            })



    }

    // 停止任务  force 为true，则不弹出提示，直接停止
    stopTask(force) {

        // 取出
        const logic = () => {
            storage.load({ key: Config.TomatoTimerLocalStorageKey })
                .then((timer) => {
                    // 取出番茄钟id，更新番茄钟停止类型为强制停止
                    let t = new T()
                    t.updateToStopTimer(timer.id, T.STATUS_UNNORMAL_STOP)
                    // 销毁当前kv缓存
                    storage.save({ key: Config.TomatoTimerLocalStorageKey, data: null })
                    this.clearTimer() // 清除定时器
                    // 定时器回归原状
                    this.setState({
                        total: Config.TomatoTimerLength,
                        minute: Config.TomatoTimerLength,
                        seconds: 0,
                        taskOptionsJustifyContent: 'center',
                        type: 'work'  // 不论是否是休息钟，结束后都回归工作钟
                    })
                })
        }

        if (force === true) {
            logic()
        } else {
            Alert.alert('确认停止?', '强制停止将不计入有效番茄钟', [
                {
                    text: '取消',
                },
                {
                    text: '停止',
                    onPress: () => {
                        logic()
                    }
                }
            ])
        }
    }




    render() {
        let styles = StyleSheet.create({
            container: {
                width: windowWidth,
                height: windowHeight,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            header: {
                marginTop: 20,
                marginBottom: -20,
                width: windowWidth,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            },
            headerGoBack: {
                position: 'absolute',
                left: 45,
            },
            headerText: {
                // marginTop: 60,
                fontSize: 23,
                color: '#b1dff8'
            },
            headerRight: {
                position: 'absolute',
                right: 45,
            },
            body: {
                flex: 1,
            },
            bottom: {
                flex: 3
            },
            timer: {

            },
            startIcon: {
                width: 20,
                height: 20,
            },
            taskDetail: {
                flex: 3
            },
            taskOptions: {
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: this.state.taskOptionsJustifyContent,
                marginTop: 80,
            },
            multiLineInput: {
                marginTop: 30,
                padding: 20,
                paddingTop: 10,
                width: windowWidth * 0.7,
                height: windowHeight * 0.3,
                borderColor: this.state.type === 'work' ? '#dc7f34' : '#8ca0f4',
                borderRadius: 10,
                borderWidth: 1,
                fontSize: 16,
                color: '#b1dff8',
            },
            pauseButton: {
                display: this.state.taskOptionsJustifyContent === 'center' ? 'none' : 'flex',
            },
            startButton: {
                display: this.state.taskOptionsJustifyContent !== 'center' ? 'none' : 'flex',
            },
            stopButton: {
                display: this.state.taskOptionsJustifyContent === 'center' ? 'none' : 'flex',
            },
          
        })

        const mainColor = () => {
            if (this.state.type === 'work') {
                return [Config.WorkTimerStartColor, Config.WorkTimerEndColor]
            } else {
                return [Config.RestTimerStartColor, Config.RestTimerEndColor]
            }
        }


        return (
            <Provider>
                <LinearGradient locations={[0.2, 1]} colors={mainColor()} style={styles.container} >
                    <View style={styles.container}>
                        {/* header部分 */}
                        <View style={styles.header}>
                            <View style={styles.headerGoBack}>
                                <TouchableOpacity onPress={this.goBack.bind(this)}>
                                    <GoBackSvg color="#ffffffAA" width="22" height="22" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.headerText}>{this.state.title}</Text>
                            <View style={styles.headerRight}>
                                {this.state.showHeaderRight ? this.state.headerRight : null}
                            </View>
                        </View>
                        {/* body部分，计时器详情 */}
                        <TimerCircularProgress
                            style={styles.body}
                            surfaceWidth={280}
                            surfaceHeigth={280}
                            powerPercent={this.getTimerPercent(this)}
                            fieldText={this.getTimerString(this.state.minute, this.state.seconds)}
                            type="dc"
                            status={this.state.type}
                            onPress={() => {
                                this.setState({ showMusicModal: true })
                            }}
                        ></TimerCircularProgress>
                        {/* options部分 开始/暂停/停止 */}
                        <View style={styles.bottom} >
                            {/* 这里存放子任务 */}
                            <View>

                            </View>
                            <View style={styles.taskOptions}>
                                <TouchableOpacity
                                    style={styles.pauseButton} onPress={this.pauseTask.bind(this)}>
                                    <TaskTimerPauseSvg
                                        status={this.state.pauseButtonStatus}
                                        width="70" height="70" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.startButton} onPress={this.startTask.bind(this)}>
                                    <TaskTimerStartSvg width="70" height="70" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.stopButton} onPress={this.stopTask.bind(this)}>
                                    <TaskTimerStopSvg width="70" height="70" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* 音效控制器 Modal */}
                <Modal
                    maskClosable
                    transparent
                    visible={this.state.showMusicModal}
                    onClose={() => { this.setState({ showMusicModal: false }) }}
                >
                   <View>
                       <Music />
                   </View>
                </Modal>
            </Provider>
        )
    }
}




export default withNavigation(TomatoTimer);
