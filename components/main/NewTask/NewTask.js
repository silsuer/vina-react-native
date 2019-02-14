import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text, Dimensions, TextInput } from 'react-native'
import { Button, List, InputItem, Stepper, DatePicker, Provider, Switch, Modal, SwipeAction, Picker } from '@ant-design/react-native'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flex: 1,
        // justifyContent: 'center',
    },
    inputItem: {
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
    },
    headerText: {
        fontSize: 5,
    }
})

class NewTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            remindModeVisiable: false,  // 是否显示提醒方式模态框
            remindModeBell: false,  // 提醒方式: 响铃
            remindModeShock: false,  // 提醒方式: 震动
            remindModeNotice: false,  // 提醒方式: 通知
            repeatData: [['only']],  // 重复项数据
        }

        // 返回每个月的选择options
        const getEveryMonthArray = () => {
            let arr = [];
            for (let i = 1; i <= 31; i++) {
                arr.push({
                    value: 'day' + i,
                    label: '每月' + i + '号',
                })
            }
            return arr
        }

        // 重复列表中的操作项
        this.repeatListOptions = [
            {
                value: 'only',
                label: '仅一次',
            },
            {
                value: 'everyday',
                label: '每天'
            },
            {
                value: 'everyweek',
                label: '精确到周',
                children: [
                    {
                        value: 'monday',
                        label: '每周一'
                    },
                    {
                        value: 'tuesday',
                        label: '每周二',
                    },
                    {
                        value: 'wednesday',
                        label: '每周三'
                    },
                    {
                        value: 'thursday',
                        label: '每周四'
                    },
                    {
                        value: 'friday',
                        label: '每周五'
                    },
                    {
                        value: 'saturday',
                        label: '每周六'
                    },
                    {
                        value: 'sunday',
                        label: '每周日'
                    },
                ]
            },
            {
                value: 'everymonth',
                label: '精确到月',
                children: getEveryMonthArray()
            },
        ]

    }

    // 选择提醒方式，点击后弹出选择方式的模态框
    clickRemindMode() {
        this.setState({ remindModeVisiable: true })
    }

    // 关闭提醒方式模态框
    closeRemindModeModal() {
        this.setState({ remindModeVisiable: false })
    }

    // 更改提醒方式
    changeRemindModeStatus(type) {
        switch (type) {
            case 'bell':
                this.setState({ remindModeBell: !this.state.remindModeBell })
                break;
            case 'shock':
                this.setState({ remindModeShock: !this.state.remindModeShock })
                break;
            case 'notice':
                this.setState({ remindModeNotice: !this.state.remindModeNotice })
                break;
        }
    }

    // 获取提醒方式的字符串形式
    getRemindModesString() {
        let stack = []
        if (this.state.remindModeBell) {
            stack.push('响铃')
        }
        if (this.state.remindModeShock) {
            stack.push('震动')
        }
        if (this.state.remindModeNotice) {
            stack.push('通知')
        }
        return stack.join(',')
    }

    // 生成重复项的部分
    generateRepeatRender() {

        return this.state.repeatData.map((option, index) => {
            const title = "重复" + (index === 0 ? '' : index)
            return (
                <SwipeAction key={index}
                    autoClose
                    right={index === 0 ? [] : [
                        {
                            text: '移除',
                            onPress: this.deleteRepeatItem.bind(this, index),
                            style: { backgroundColor: 'red', color: 'white' },
                        },
                    ]}
                    left={[
                        {
                            text: '添加',
                            onPress: this.addRepeatItem.bind(this, index),
                            style: { backgroundColor: 'orange', color: 'white' },
                        },
                    ]}
                >
                    <Picker
                        data={this.repeatListOptions}
                        onOk={this.saveRepeat.bind(this, index)}
                        value={option}
                    >
                        <List.Item
                            arrow="horizontal">{title}</List.Item>
                    </Picker>
                </SwipeAction>)
        })

    }

    // 移除重复项
    deleteRepeatItem(index) {
        if (index === 0) return
        let data = this.state.repeatData
        data.splice(index, 1)
        console.log(data)
        this.setState({ repeatData: data })
    }

    // 添加一个新的重复项
    addRepeatItem(index) {
        let data = this.state.repeatData
        data.push(["only"])
        this.setState({ repeatData: data })
    }

    // 保存重复选项的数据
    saveRepeat(index, value) {
        // ["only"] ["everyweek","tuesday"]
        if (this.state.repeatData[index]) { // 存在，则直接修改
            let data = this.state.repeatData
            data[index] = value;
            this.setState({ repeatData: data })
        }

    }

    render() {






        return (
            <Provider>
                <ScrollView >
                    <View style={styles.container}>
                        <View style={styles.header}>

                        </View>
                        <List renderHeader='基本'>
                            <InputItem textAlign="right" placeholder="必填">
                                任务名
                   </InputItem>
                            <List.Item
                                extra={
                                    <Stepper key="2" min={1} defaultValue={3} readOnly={false} />
                                }
                            >
                                番茄数
                   </List.Item>

                            <DatePicker mode="time">
                                <List.Item arrow="horizontal">提醒时间</List.Item>
                            </DatePicker>
                            <List.Item
                                extra={this.getRemindModesString(this)}
                                arrow="horizontal"
                                onPress={this.clickRemindMode.bind(this)}>
                                提醒方式
                            </List.Item>
                            {this.generateRepeatRender()}
                        </List>


                        <Button
                            type="primary"
                            style={{ marginTop: 30 }}
                        >保存</Button>

                    </View>

                    {/* 提醒方式模态框 */}
                    <Modal
                        popup
                        visible={this.state.remindModeVisiable}
                        closable
                        maskClosable
                        animationType="slide-up"
                    >
                        <List renderHeader="提醒方式">
                            <List.Item extra={<Switch onChange={this.changeRemindModeStatus.bind(this, 'bell')} checked={this.state.remindModeBell} />}>响铃</List.Item>
                            <List.Item extra={<Switch onChange={this.changeRemindModeStatus.bind(this, 'shock')} checked={this.state.remindModeShock} />}>震动</List.Item>
                            <List.Item extra={<Switch onChange={this.changeRemindModeStatus.bind(this, 'notice')} checked={this.state.remindModeNotice} />}>通知</List.Item>
                            <List.Item> <Button onPress={this.closeRemindModeModal.bind(this)} type="primary">关闭</Button> </List.Item>
                        </List>
                    </Modal>

                </ScrollView>
            </Provider>


        )
    }
}

export default NewTask