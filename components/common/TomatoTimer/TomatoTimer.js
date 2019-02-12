import React, { Component } from 'react'
import { Dimensions, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, TextInput } from 'react-native';
import TimerCircularProgress from '../../main/TimerCircularProgress/TimerCircularProgress'
import TaskTimerStartSvg from '../../assets/svgs/TaskTimerStartSvg/TaskTimerStartSvg'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height
const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 1
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
        alignItems: 'center',
    },
    multiLineInput: {
        marginTop:30,
        padding:20,
        paddingTop:10,
        width: windowWidth * 0.7,
        height: windowHeight * 0.3,
        borderColor:'#8ca0f4',
        borderRadius:10,
        borderWidth:1,
        fontSize:16,
        color:'#b1dff8',
    }
})

// 番茄计时器界面
class TomatoTimer extends Component {
    render() {
        return (
            <ImageBackground style={{ flex: 1 }}
                source={require('../../assets/images/timer_background_1.png')}
            >
                <View style={styles.container}>
                    {/* header部分 */}
                    <View style={styles.header}>

                    </View>
                    {/* body部分，计时器详情 */}
                    <TimerCircularProgress
                        style={styles.body}
                        surfaceWidth={280}
                        surfaceHeigth={280}
                        powerPercent={60}
                        fieldText="25:00"
                        type="dc"
                    ></TimerCircularProgress>
                    {/* options部分 开始/暂停/停止 */}
                    <View style={styles.bottom} >
                        {/* 这里存放任务详情 */}
                        <View style={styles.taskDetail}>
                            <TextInput
                                placeholder="便签..."
                                height={windowHeight*0.3}
                                multiline
                                style={styles.multiLineInput} />
                        </View>
                        <View style={styles.taskOptions}>
                            <TouchableOpacity onPress={() => { Alert.alert("开始任务！") }}>
                                <TaskTimerStartSvg width="70" height="70" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}




export default TomatoTimer;

// const AppNavigator = createStackNavigator({
//     TomatoTimer: {
//         screen: TomatoTimer
//     }
// })
// const TomatoTimerView = createAppContainer(AppNavigator)
// export default TomatoTimerView