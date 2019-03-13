// 便签本主界面的全部便签页面，显示最近消息

import React, { Component } from 'react'
import { View, Text, DeviceEventEmitter, Alert } from 'react-native'
import { withNavigation } from 'react-navigation'
import { CardContainer, CardHeader, CardBody, CardList, CardListItem } from '../../common/CardContainer'
import { RemindTask } from '../../../services/model/remind_task'
import { PigeonholeRelation } from '../../../services/model/pigeonhole_relation'
import { TaskIcon } from '../../assets/svgs/NotesSvg'
import { DeleteSvg, PigeonholeSvg, TaskStartSvg, TagSvg, AccountRecordSvg } from '../../assets/svgs/Common'
import { convertMinuteToHour, convertTimeToManual } from '../../../services/common_func'
import { Toast } from '@ant-design/react-native';
import { Accounts } from '../../../services/model/accounts';


// 所有（任务/日程/便签）界面
class All extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [],
        }

    }

    componentDidMount() {
        this.refreshList()

        this.refreshAllListListener = DeviceEventEmitter.addListener("refresh-all-list", () => {
            this.refreshList()
        })
    }

    componentWillUnmount() {
        this.refreshAllListListener.remove()
    }

    componentWillReceiveProps() {
        if (this.props.navigation.getParam("refreshList", false)) {
            this.refreshList()
        }
    }

    // 刷新列表，重新从数据库中取出来数据,放到state中，重新渲染页面
    async refreshList(pageNumber, limitNumber) {
        let rt = new RemindTask()
        let page = pageNumber || 1  // 这是第几页
        let limit = limitNumber || 15  // 每页取出的数量
        rt.getUnionAll(page, limit).then((res) => {
            this.setState({ list: res })
        })
    }

    // 渲染列表
    generateListRender() {
        if (this.state.list && this.state.list.length > 0) {
            return this.state.list.map((data, index) => {
                // 获取数据的归档颜色
                switch (data.operation_type) {
                    case 'remind':
                        return this.renderRemind(data, index)
                    case 'post':
                        break
                    case 'accounts':// 渲染账单
                        return this.renderAccounts(data, index)

                }

            })
        }
    }

    // 渲染账单
    renderAccounts(data, index) {

        const getIcon = (icon, name) => {
            if (name) {
                let Comp = require('../../assets/svgs/BillSvg')[icon]
                if (Comp) {
                    return [<Comp color="#d4d4d4" width="20" height="20" style={{ marginRight: 20 }} />]
                }
                return [<Text>{name}</Text>]
            }
            return null
        }

        return (
            <CardListItem key={index}
                swipeLeft={[
                    {
                        text: <DeleteSvg />,  // 删除账单
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                        onPress: () => {
                            // 弹出提示
                            Alert.alert("确认删除此账单?", "该操作不可逆，请谨慎操作", [
                                {
                                    text: "取消"
                                },
                                {
                                    text: '删除',
                                    onPress: () => {
                                        // 删除提醒，将id为data.id的remind_task的is_deleted设置为1，然后从现在的list中删除这一项，index就是索引
                                        let r = new Accounts()
                                        let list = this.state.list
                                        r.softDelete(data.id)
                                        list.splice(index, 1)
                                        this.setState({ list: list })
                                    }
                                },
                            ])
                        }
                    },
                    {
                        text: <PigeonholeSvg width="19" height="19" />,  // 归档
                        style: {
                            backgroundColor: '#eab646',
                            color: 'white',
                        },
                        onPress: () => {
                            this.props.navigation.navigate('pigeonhole', {
                                id: data.id,
                                type: PigeonholeRelation.TYPE_ACCOUNT,
                                selectedId: data.pig_id,
                                goBackCallback: () => { // 返回时执行的回调
                                    Toast.success("已归档")
                                    this.refreshList()
                                }
                            })
                        }
                    }
                ]}
                swipeRight={[]}
                title={"￥" + data.amount}
                headerIcon={<AccountRecordSvg color={data.pig_color || "#000000"} width="18" height="18" />}
                headerExtra={getIcon(data.cateicon, data.catename)}
                content={data.comment || null}
                onPress={() => {
                    this.props.navigation.navigate('newBill', {
                        id: data.id, callback: () => {
                            this.refreshList()
                        }
                    })
                }}
            />
        )
    }

    renderRemind(data, index) {
        // TODO 如果有备注comment，根据comment类型截取可显示字符
        return (
            <CardListItem key={index}
                swipeLeft={[
                    {
                        text: <DeleteSvg />,  // 删除任务
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                        onPress: () => {
                            // 弹出提示
                            Alert.alert("确认删除此任务?", "该操作不可逆，请谨慎操作", [
                                {
                                    text: "取消"
                                },
                                {
                                    text: '删除',
                                    onPress: () => {
                                        // 删除提醒，将id为data.id的remind_task的is_deleted设置为1，然后从现在的list中删除这一项，index就是索引
                                        let r = new RemindTask()
                                        let list = this.state.list
                                        r.softDelete(data.id)
                                        list.splice(index, 1)
                                        this.setState({ list: list })
                                    }
                                },
                            ])
                        }
                    },
                    {
                        text: <PigeonholeSvg width="19" height="19" />,  // 归档
                        style: {
                            backgroundColor: '#eab646',
                            color: 'white',
                        },
                        onPress: () => {
                            this.props.navigation.navigate('pigeonhole', {
                                id: data.id,
                                type: PigeonholeRelation.TYPE_REMIND_TASK,
                                selectedId: data.pig_id,
                                goBackCallback: () => { // 返回时执行的回调
                                    Toast.success("已归档")
                                    this.refreshList()
                                }
                            })
                        }
                    }
                ]}
                swipeRight={[
                    {
                        text: <TaskStartSvg width="22" height="22" />,
                        style: {
                            backgroundColor: '#007bff',
                            color: 'white',
                        },
                        onPress: () => {
                            this.props.navigation.navigate('tomatoTimer', { id: data.id })
                        }
                    },
                    {
                        text: <TagSvg />,
                        style: {
                            backgroundColor: '#28a745',
                            color: 'white',
                        },
                        onPress: () => {
                            // 标记为已完成
                            Alert.alert("确认标记", "确认在今日时间轴上标记该任务为已完成?", [
                                {
                                    text: '取消'
                                },
                                {
                                    text: '确认',
                                    onPress: () => {
                                        let r = new RemindTask()
                                        r.setTaskToFinished(data.id)
                                    }
                                }
                            ])
                        }
                    }
                ]}
                title={data.title}
                headerIcon={<TaskIcon color={data.pig_color || "#000000"} width="14" height="14" />}
                headerExtra={[
                    data.remind_at ? <Text style={{ color: 'grey' }}>{convertTimeToManual(data.remind_at)}</Text> : null,
                    data.tomato_number ? <Text style={{ color: 'grey' }}>{convertMinuteToHour((data.tomato_number || 0) * 25)}</Text> : null,
                ]}
                content={data.comment || null}
                onPress={this.openRemindDetail.bind(this, data.id)}
            />
        )
    }

    // 打开提醒详情页
    openRemindDetail(id) {
        this.props.navigation.navigate('newRemindTask', { id: id })
    }

    render() {
        return (
            <View>
                <CardContainer>
                    {/* <CardHeader title="全部" extra={[]} /> */}
                    <CardBody>
                        <CardList>
                            {this.generateListRender()}
                        </CardList>
                    </CardBody>
                </CardContainer>
            </View>
        )
    }
}

export default withNavigation(All)