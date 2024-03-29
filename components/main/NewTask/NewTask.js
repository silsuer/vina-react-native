import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Button, List, InputItem, Stepper, DatePicker, Provider, Switch, Modal, Toast, SwipeAction, Picker, TextareaItem } from '@ant-design/react-native'
import TomatoSvg from '../../assets/svgs/TomatoSvg/TomatoSvg'
import { RemindTask } from '../../../services/model/remind_task'
import { TaskStartSvg, CloseSvg, DetermineSvg } from '../../assets/svgs/Common'
import Page from '../../common/Page'
import { CardContainer, CardHeader, CardBody, CardList, CardListItem } from '../../common/CardContainer'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        height: windowHeight,
        borderRadius: 5,

    },
    inputItem: {
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
    },
    headerText: {
        fontSize: 5,
    },
    taskComment: {
        padding: 50,
        marginTop: 0,
        fontSize: 15,
        color: '#00000099'
    }
})

class NewTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,  // 当前任务的id，0为新建，大于0为修改
            remindModeVisiable: false,  // 是否显示提醒方式模态框
            remindModeBell: true,  // 提醒方式: 响铃
            remindModeShock: true,  // 提醒方式: 震动
            remindModeNotice: true,  // 提醒方式: 通知
            subTaskModeVisiable: false,  // 添加/修改子任务时显示的modal
            title: '',        // 任务名
            tomatoNumber: 0,  // 任务需要的番茄数
            remindTime: {    // 提醒时间，默认都是-1，没有时间限制
                hour: -1,
                minute: -1,
            },
            nowSelectRemindTime: null,
            advanceNotify: 0,  // 提前通知，0则不提前
            tmpSubTaskData: {      // 临时保存子任务的对象
                id: 0,
                title: '',
                tomatoNumber: 0,
                tmpIndex: -1,     // 如果是-1，则是新建子任务，如果 >-1 则是修改子任务，index对应数据索引
            },
            repeatData: [['only']],  // 重复项数据
            startDateAt: null,  // 开始时间 （默认为）
            endDateAt: null,   // 截止时间
            subTaskData: [],  // 子任务 id title tomatoNumber
            taskComment: '',  // 备注
            saveButtonDisabled: false   // 保存按钮是否可用，用于点击
        }

        // 返回每个月的选择options
        this.getEveryMonthArray = () => {
            let arr = [];
            for (let i = 1; i <= 31; i++) {
                arr.push({
                    value: 'day-' + i,
                    label: '每月' + i + '号',
                })
            }
            return arr
        }

        this.advanceNotify = [
            {
                value: '0',
                label: '关闭'
            },
            {
                value: '15',
                label: '15分钟'
            },
            {
                value: '30',
                label: '30分钟'
            },
            {
                value: '60',
                label: '1小时'
            },
            {
                value: '120',
                label: '2小时'
            },
        ]

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
                        value: '1',
                        label: '每周一'
                    },
                    {
                        value: '2',
                        label: '每周二',
                    },
                    {
                        value: '3',
                        label: '每周三'
                    },
                    {
                        value: '4',
                        label: '每周四'
                    },
                    {
                        value: '5',
                        label: '每周五'
                    },
                    {
                        value: '6',
                        label: '每周六'
                    },
                    {
                        value: '0',
                        label: '每周日'
                    },
                ]
            },
            {
                value: 'everymonth',
                label: '精确到月',
                children: this.getEveryMonthArray()
            },
        ]

    }

    // 挂载方法
    componentDidMount() {

        // 当传入的参数中存在id的时候，去数据库中取出相关数据，并赋值给state
        let id = this.props.navigation.getParam('id', 0)
        if (id > 0) {
            let r = new RemindTask()
            r.findOne(id).then((res) => {

                // 先根据结果判断提醒方式
                let b = false
                let n = false
                let s = false
                remindType = res.remind_type.split(",")
                for (let i = 0; i < remindType.length; i++) {
                    switch (parseInt(remindType[i])) {
                        case RemindTask.modeBell:
                            b = true
                            break
                        case RemindTask.modeNotice:
                            n = true
                            break
                        case RemindTask.modeShock:
                            s = true
                            break
                    }
                }

                this.setState({
                    id: res.id,
                    title: res.title,
                    tomatoNumber: res.tomato_number,
                    nowSelectRemindTime: res.remind_at ? new Date("2019/02/14 " + res.remind_at) : null,
                    repeatData: res.repeat,
                    remindModeBell: b,
                    remindModeNotice: n,
                    remindModeShock: s,
                    taskComment: res.comment,
                    subTaskData: res.subTaskData,
                    startDateAt: res.start_date_at ? new Date(res.start_date_at) : null,
                    endDateAt: res.end_date_at ? new Date(res.end_date_at) : null,
                    advanceNotify: res.advance_notify,
                })
            })
        }
    }


    // 选择提醒方式，点击后弹出选择方式的模态框
    clickRemindMode() {
        this.setState({ remindModeVisiable: true })
    }

    // 关闭提醒方式模态框
    closeRemindModeModal() {
        this.setState({ remindModeVisiable: false })
    }

    // 获取提醒时间的字符串
    getRemindTimeString() {
        return '无'
    }

    // 清空提醒时间
    clearRemindTime() {
        this.setState({ nowSelectRemindTime: null })
    }
    // 更改提醒时间
    changeRemindTime(date) {
        this.setState({ remindTime: { hour: date.getHours(), minute: date.getMinutes() }, nowSelectRemindTime: date })
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
        return (
            <View>
                <Text style={{ fontSize: 15, color: '#00000099' }}> {stack.join(',')} </Text>
            </View>
        )
    }

    // 生成子任务视图
    generateSubTaskRender() {
        const rightOptions = (index) => {
            let edit = {
                text: '编辑',
                onPress: this.editRepeatItem.bind(this, index),
                style: { backgroundColor: '#3d8ee2', color: 'white' },
            }
            if (index === 0) {
                return [edit]
            } else {
                return [
                    {
                        text: '移除',
                        onPress: this.deleteSubTaskItem.bind(this, index),
                        style: { backgroundColor: 'red', color: 'white' },
                    },
                    edit
                ]
            }
        }

        let d = this.state.subTaskData
        if (d.length === 0) {
            d = [{ id: 0, title: '无', tomatoNumber: 0 }]
        }

        return d.map((data, index) => {
            return (
                <SwipeAction key={index}
                    autoClose
                    right={rightOptions(index)}
                    left={[
                        {
                            text: '新建',
                            onPress: this.addSubTaskItem.bind(this, index),
                            style: { backgroundColor: 'orange', color: 'white' },
                        },
                    ]}
                >
                    <List.Item extra={<TomatoSvg number={data.tomatoNumber} width="25" height="25"></TomatoSvg>} >
                        <Text>{data.title}</Text>
                    </List.Item>
                </SwipeAction>
            )
        })
    }

    // 删除子任务
    deleteSubTaskItem(index) {
        let data = this.state.subTaskData
        data.splice(index, 1)
        this.setState({ subTaskData: data })
    }
    // 生成重复项的部分
    generateRepeatRender() {

        const getValueFromRepeatArray = (key, arr) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value === key) {
                    return arr[i].label
                }
                if (arr[i].children && arr[i].children.length > 0) {
                    let r = getValueFromRepeatArray(key, arr[i].value === 'everymonth' ? this.getEveryMonthArray() : arr[i].children)
                    if (r === false) {
                        continue
                    } else {
                        return r
                    }
                }
            }
            return false
        }



        const getValueFromKey = (option) => {
            let values = []
            for (let i = 0; i < option.length; i++) {
                if (getValueFromRepeatArray(option[i], this.repeatListOptions)) {
                    values.push(getValueFromRepeatArray(option[i], this.repeatListOptions))
                }
            }
            return (
                <Text style={{ fontSize: 15, color: "#00000099" }}>{values.join(',')}</Text>
            )
        }

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
                        itemStyle={{ fontSize: 18 }}
                        extra={getValueFromKey(option)}
                    >
                        <List.Item
                            arrow="horizontal">
                            <Text> {title}</Text>
                        </List.Item>
                    </Picker>
                </SwipeAction>)
        })

    }

    // 添加一个子任务
    addSubTaskItem(index) {
        // 弹出一个任务框modal，记录子任务的名称和番茄数
        // 弹出窗口时要先清空临时任务对象
        this.setState({ subTaskModeVisiable: true, tmpSubTaskData: { id: 0, title: '', tomatoNumber: 0, tmpIndex: -1 } })
    }

    // 编辑重复项
    editRepeatItem(index) {
        if (this.state.subTaskData.length === 0) { // 如果子任务为空，编辑就是新建
            this.addSubTaskItem()
            return
        }
        currentItem = this.state.subTaskData[index]
        currentItem.tmpIndex = index
        this.setState({ tmpSubTaskData: currentItem, subTaskModeVisiable: true })
    }

    // 移除重复项
    deleteRepeatItem(index) {
        if (index === 0) return
        let data = this.state.repeatData
        data.splice(index, 1)
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

    // 保存子任务
    saveSubTask() {
        // 判断是否存在title
        if (this.state.tmpSubTaskData.title === '') {
            Toast.fail('任务名不能为空', 1)
            return
        }

        let totalTomatoNumber = this.state.tmpSubTaskData.tomatoNumber
        // 判断是修改还是增加
        // 计算现在的总番茄数
        for (let i = 0; i < this.state.subTaskData.length; i++) {
            if (i === this.state.tmpSubTaskData.tmpIndex) continue  // 如果索引相等，则不计入番茄总数
            totalTomatoNumber += this.state.subTaskData[i].tomatoNumber
        }
        // 番茄总数过大，则重设父任务的番茄总数
        if (totalTomatoNumber > this.state.tomatoNumber) {
            this.setState({ tomatoNumber: totalTomatoNumber }, () => {
                Toast.info('子任务番茄总数超过父任务！已重新调整父任务番茄数', 1)
            })
        }
        let data = this.state.subTaskData
        if (this.state.tmpSubTaskData.tmpIndex === -1) {  // 如果是保存
            // 传入当前子任务数组中
            // 如果当前子任务第一个是空的话，则改为修改
            data.push(this.state.tmpSubTaskData)
        } else {
            // 修改
            data[this.state.tmpSubTaskData.tmpIndex] = { id: this.state.tmpSubTaskData.id, title: this.state.tmpSubTaskData.title, tomatoNumber: this.state.tmpSubTaskData.tomatoNumber }
        }
        // 清空临时子任务数组
        this.clearTmpSubTaskData()
        // 关闭模态框
        this.setState({ subTaskModeVisiable: false, subTaskData: data })
    }
    // 修改临时子任务title
    changeTmpSubTaskTitle(value) {
        let data = this.state.tmpSubTaskData
        data.title = value
        this.setState({ tmpSubTaskData: data })
    }

    // 修改临时子任务番茄数
    changeTmpSubTaskTomatoNumber(value) {
        let data = this.state.tmpSubTaskData
        data.tomatoNumber = value
        this.setState({ tmpSubTaskData: data })
    }

    // 取消创建任务模态框
    cancelCreateSubTaskModal() {
        // 关闭模态框
        this.setState({ subTaskModeVisiable: false })
        // 清空子任务数据
        this.clearTmpSubTaskData();
    }

    // 清除临时子任务数据
    clearTmpSubTaskData() {
        this.setState({ tmpSubTaskData: { id: 0, title: '', tomatoNumber: 0 } })
    }

    // 修改主任务番茄数
    changeTaskTomatoNumber(value) {
        this.setState({ tomatoNumber: value })
    }

    // 点击保存后将任务保存到数据库
    saveTask() {
        // 保存
        this.setState({ saveButtonDisabled: true }, () => {
            let obj = {}
            // 验证必填项
            if (!this.state.title) {  // 名称
                Toast.fail("请输入提醒名称")
                this.setState({ saveButtonDisabled: false })
                return
            } else {
                obj.title = this.state.title
            }
            if (this.state.id) {  // id
                obj.id = this.state.id
            }
            if (this.state.tomatoNumber) {  // 番茄数
                obj.tomato_number = this.state.tomatoNumber
            } else {
                obj.tomato_number = 0
            }
            if (this.state.nowSelectRemindTime) {  // 提醒时间
                obj.remind_at = this.state.nowSelectRemindTime.toLocaleTimeString('chinese', { hour12: false })
            }

            if (this.state.startDateAt) { // 开始时间
                obj.start_date_at = this.state.startDateAt.format("yyyy-MM-dd")
            }
            if (this.state.endDateAt) { // 结束时间
                obj.end_date_at = this.state.endDateAt.format("yyyy-MM-dd")
            }

            obj.advance_notify = this.state.advanceNotify

            let remindType = []
            if (this.state.remindModeBell) { // 响铃
                remindType.push(RemindTask.modeBell)
            }
            if (this.state.remindModeShock) { // 震动
                remindType.push(RemindTask.modeShock)
            }
            if (this.state.remindModeNotice) { // 通知
                remindType.push(RemindTask.modeNotice)
            }
            obj.remind_type = remindType.join(',')  // 提醒类型
            if (this.state.repeatData) {  // 重复
                obj.repeat = JSON.stringify(this.state.repeatData)  // 传到模型里进行额外处理
            }
            if (this.state.subTaskData && this.state.subTaskData.length > 0) {  // 子任务
                obj.subTaskData = this.state.subTaskData
            }
            if (this.state.taskComment) {
                obj.comment = {
                    type: 1,  //0 纯文本 1 富文本 2 markdown 3 手帐
                    content: this.state.taskComment
                }
            }
            // 生成任务对象
            task = new RemindTask()
            // 保存对象
            let saveResult = null
            if (this.state.id > 0) {  // 更新对象
                saveResult = task.update(obj)
            } else {  // 创建对象
                saveResult = task.create(obj)
            }
            saveResult.then((saveResult) => {
                this.setState({ saveButtonDisabled: false })
                if (saveResult === false) {
                    Toast.fail("保存失败，请联系开发者查看操作日志")
                } else {
                    // 跳转到任务列表页
                    Toast.success("保存成功")
                    // 触发刷新列表事件
                    DeviceEventEmitter.emit("refresh-all-list")
                    // this.props.navigation.navigate('Notes', { pageName: 'notes-all', refreshList: true })
                    this.props.navigation.goBack()
                }

            })

        })

    }


    render() {

        const getAdvanceNotifyPickerExtra = () => {
            for (let i = 0; i < this.advanceNotify.length; i++) {
                if (parseInt(this.advanceNotify[i].value) === this.state.advanceNotify) {
                    return (
                        <Text style={{ fontSize: 15, color: '#00000099' }}>{this.advanceNotify[i].label}</Text>
                    )
                }
            }
            return null
        }

        const getStartAtExtra = () => {
            return (
                <View>
                    <Text style={{ fontSize: 15, color: '#00000099' }}>{this.state.startDateAt ? this.state.startDateAt.format("yyyy-MM-dd") : "不限"} </Text>
                </View>
            )
        }

        const getEndAtExtra = () => {
            return (
                <View>
                    <Text style={{ fontSize: 15, color: '#00000099' }}>{this.state.endDateAt ? this.state.endDateAt.format("yyyy-MM-dd") : "不限"} </Text>
                </View>
            )
        }

        const getDatePickerExtra = () => {
            return (
                <View>
                    <Text style={{ fontSize: 15, color: '#00000099' }}>{this.state.nowSelectRemindTime ? this.state.nowSelectRemindTime.format("hh:mm") : "无"} </Text>
                </View>
            )
        }

        const getBody = () => {

            const getExtra = () => {
                let init = []
                init.push(<TouchableOpacity onPress={() => {
                    if (this.state.saveButtonDisabled) {

                    } else {
                        this.saveTask()
                    }
                }}>
                    <DetermineSvg color="#1e294199" width="17" height="17" />
                </TouchableOpacity>)
                if (this.props.navigation.getParam('id')) { // 修改
                    init.push(<TouchableOpacity onPress={() => { this.props.navigation.navigate('tomatoTimer', { id: this.props.navigation.getParam('id') }) }}>
                        <TaskStartSvg color="#1e294199" width="17" height="17" />
                    </TouchableOpacity>)
                }
                return init
            }

            return (

                <CardContainer>
                    <CardHeader
                        icon={<TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <CloseSvg color="#1e294199" width="17" height="17" />
                        </TouchableOpacity>}
                        title={this.props.navigation.getParam('id') ? '提醒' : '新建'}
                        extra={getExtra()}
                    />
                    <CardBody>
                        <View style={styles.container}>
                            <List renderHeader=''>
                                <InputItem textAlign="right" value={this.state.title} style={{ fontSize: 15, color: '#00000099' }} onChange={(value) => { this.setState({ title: value }) }} placeholder="必填">
                                    <Text>名称</Text>
                                </InputItem>
                                <List.Item
                                    extra={
                                        <Stepper inputStyle={{ fontSize: 15, color: '#00000099' }} key="2" min={0} onChange={this.changeTaskTomatoNumber.bind(this)} value={this.state.tomatoNumber} readOnly={false} />
                                    }
                                >
                                    <Text>番茄数</Text>
                                </List.Item>
                                <SwipeAction
                                    autoClose
                                    right={[
                                        {
                                            text: '清空',
                                            onPress: this.clearRemindTime.bind(this),
                                            style: { backgroundColor: 'red', color: 'white' },
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        title="提醒时间"
                                        mode="time"
                                        extra={getDatePickerExtra()}
                                        onChange={this.changeRemindTime.bind(this)}
                                    >
                                        <List.Item textAlign="center" arrow="horizontal">
                                            <Text>提醒时间</Text>
                                        </List.Item>
                                    </DatePicker>
                                </SwipeAction>


                                <List.Item
                                    textAlign="center"
                                    extra={this.getRemindModesString(this)}
                                    arrow="horizontal"
                                    onPress={this.clickRemindMode.bind(this)}>
                                    <Text>提醒方式</Text>
                                </List.Item>

                                <Picker
                                    data={this.advanceNotify}
                                    itemStyle={{ fontSize: 18 }}
                                    onOk={(index) => {
                                        this.setState({ advanceNotify: parseInt(index[0]) })
                                    }}
                                    extra={getAdvanceNotifyPickerExtra()}
                                >
                                    <List.Item arrow="horizontal">
                                        <Text>提前通知</Text>
                                    </List.Item>
                                </Picker>

                            </List>

                            <List renderHeader="日期范围">
                                <DatePicker
                                    mode="date"
                                    minDate={new Date(Date.now())}
                                    extra={getStartAtExtra()}
                                    onChange={(date) => {
                                        // 验证，开始时间不能大于结束时间
                                        if (this.state.endDateAt && (this.state.endDateAt < date)) {
                                            Toast.fail("开始日期不能大于结束日期")
                                            return
                                        }
                                        this.setState({ startDateAt: date })
                                    }}
                                >
                                    <List.Item
                                        arrow="horizontal"
                                    >
                                        <Text>开始日期</Text>
                                    </List.Item>
                                </DatePicker>

                                <DatePicker
                                    mode="date"
                                    minDate={new Date(Date.now())}
                                    extra={getEndAtExtra()}
                                    onChange={(date) => {
                                        if (this.state.startDateAt && (this.state.startDateAt > date)) {
                                            Toast.fail("结束日期不能小于开始日期")
                                            return
                                        }
                                        this.setState({ endDateAt: date })
                                    }}
                                >
                                    <List.Item
                                        arrow="horizontal"
                                    >
                                        <Text>结束日期</Text>
                                    </List.Item>
                                </DatePicker>
                            </List>

                            <List renderHeader="重复">
                                {this.generateRepeatRender()}
                            </List>

                            <List renderHeader="子任务">
                                {this.generateSubTaskRender()}

                            </List>


                            <List renderHeader="备注">
                                <TextareaItem
                                    rows={8}
                                    style={styles.taskComment}
                                    onChange={(value) => { this.setState({ taskComment: value }) }}
                                >
                                    {this.state.taskComment}
                                </TextareaItem>
                            </List>
                        </View>
                    </CardBody>
                    {/* 提醒方式模态框 */}
                    <Modal
                        popup
                        visible={this.state.remindModeVisiable}
                        closable
                        maskClosable
                        animationType="slide-up"
                        onClose={() => { this.closeRemindModeModal() }}
                    >
                        <List renderHeader="提醒方式">
                            <List.Item extra={<Switch onChange={this.changeRemindModeStatus.bind(this, 'bell')} checked={this.state.remindModeBell} />}>响铃</List.Item>
                            <List.Item extra={<Switch onChange={this.changeRemindModeStatus.bind(this, 'shock')} checked={this.state.remindModeShock} />}>震动</List.Item>
                            <List.Item style={{ marginBottom: 10 }} extra={<Switch disabled onChange={this.changeRemindModeStatus.bind(this, 'notice')} checked={this.state.remindModeNotice} />}>通知(必选)</List.Item>
                        </List>
                    </Modal>

                    <Modal
                        title="新建子任务"
                        transparent
                        maskClosable
                        visible={this.state.subTaskModeVisiable}
                        footer={[
                            { text: '取消', onPress: this.cancelCreateSubTaskModal.bind(this) },
                            { text: '保存', onPress: this.saveSubTask.bind(this) },
                        ]}
                    >
                        <List style={{ marginTop: 10 }}>
                            <InputItem textAlign="right" placeholder="必填" onChange={this.changeTmpSubTaskTitle.bind(this)} value={this.state.tmpSubTaskData.title}>
                                任务名
                              </InputItem>
                            <List.Item
                                extra={
                                    <Stepper key="2" min={0} onChange={this.changeTmpSubTaskTomatoNumber.bind(this)} value={this.state.tmpSubTaskData.tomatoNumber} readOnly={false} />
                                }
                            >
                                番茄数
                            </List.Item>
                        </List>
                    </Modal>
                </CardContainer>
            )
        }

        return (
            <Provider>
                <Page
                    noScrollView
                    title={false}
                    left={[]}
                    right={[]}
                    tabBarOptions={[]}
                    body={getBody()}
                />

            </Provider>


        )
    }
}

export default withNavigation(NewTask)