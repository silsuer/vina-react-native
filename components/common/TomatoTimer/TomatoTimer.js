import React, { Component } from 'react'
import { Dimensions, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, TextInput } from 'react-native';
import TimerCircularProgress from '../../main/TimerCircularProgress/TimerCircularProgress'
import TaskTimerStartSvg from '../../assets/svgs/TaskTimerStartSvg/TaskTimerStartSvg'
import TaskTimerStopSvg from '../../assets/svgs/TaskTimerStopSvg/TaskTimerStopSvg';
import TaskTimerPauseSvg from '../../assets/svgs/TaskTimerPauseSvg/TaskTimerPauseSvg';
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
            total: 25,  // 默认番茄时间是25分钟
            minute: 25, // 当前番茄分钟数
            seconds: 0, // 当前番茄秒数
            type: 'work',  // 工作番茄钟是 work， 休息番茄钟是 rest
        }
    }

    // 开始任务
    startTask() {
        // 显示 暂停/停止 按钮
        this.setState({ taskOptionsJustifyContent: 'space-between' })
        // 打开倒计时定时器
        this.taskTimer = setInterval(this.timerCountdown.bind(this), 1000)
        // 触发开始定时器事件
    }

    // 计时器倒计时逻辑
    timerCountdown() {
        // 将当前state中的minute和seconds减一，直到为0
        if (this.state.minute === 0 && this.state.seconds === 0) {
            // 触发完成事件
            // 移除定时器
            this.taskTimer && clearInterval(this.taskTimer)
        } else {
            if (this.state.seconds === 0 && this.state.minute > 0) {
                this.setState({ seconds: 59, minute: this.state.minute - 1 })
            } else {
                this.setState({ seconds: this.state.seconds - 1 })
            }
        }
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

    getTimerPercent() {
        console.log((1 - (this.state.minute * 60 + this.state.seconds) / (this.state.total * 60)) * 100)
        return (1 - (this.state.minute * 60 + this.state.seconds) / (this.state.total * 60)) * 100
    }

    // 暂停任务
    pauseTask() {
        // 判断当前暂停任务状态，如果是pause，则执行暂停任务逻辑，如果是start，则执行继续任务逻辑
        if (this.state.pauseButtonStatus === "pause") { // 暂停任务逻辑
            this.setState({ pauseButtonStatus: 'start' })
            this.taskTimer && clearInterval(this.taskTimer)
        } else if (this.state.pauseButtonStatus === "start") { // 继续任务逻辑
            this.setState({ pauseButtonStatus: 'pause' })
            this.taskTimer = setInterval(this.timerCountdown.bind(this), 1000)
        }

    }

    // 停止任务
    stopTask() {
        Alert.alert("停止任务")
    }

    render() {

        const getTimerString = () => {
            return "25:00"
        }

        //TODO 这里从数据库中取出设定的番茄钟时常，设置到state中

        let styles = StyleSheet.create({
            container: {
                width: windowWidth,
                height: windowHeight,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            header: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            headerText: {
                marginTop: 60,
                fontSize: 23,
                color: '#b1dff8'
            },
            body: {
                flex: 1
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

        return (
            <ImageBackground style={{ flex: 1 }}
                source={this.state.type === 'work' ? require('../../assets/images/work_timer_background.png') : require('../../assets/images/rest_timer_background.png')}
            >
                <View style={styles.container}>
                    {/* header部分 */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>番茄钟</Text>
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
                    ></TimerCircularProgress>
                    {/* options部分 开始/暂停/停止 */}
                    <View style={styles.bottom} >
                        {/* 这里存放任务详情 */}
                        <View style={styles.taskDetail}>
                            <TextInput
                                placeholder="便签..."
                                height={windowHeight * 0.3}
                                multiline
                                style={styles.multiLineInput} />
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
            </ImageBackground>
        )
    }
}




export default TomatoTimer;
