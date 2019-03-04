// 便签本主界面的全部便签页面，显示最近消息

import React, { Component } from 'react'
import { View, Text, DeviceEventEmitter } from 'react-native'
import { withNavigation } from 'react-navigation'
import { CardContainer, CardHeader, CardBody, CardList, CardListItem } from '../../common/CardContainer'
import { RemindTask } from '../../../services/model/remind_task'
import { TaskIcon } from '../../assets/svgs/NotesSvg'
import { DeleteSvg, PigeonholeSvg, TaskStartSvg, TagSvg } from '../../assets/svgs/Common'
import { convertMinuteToHour, convertTimeToManual } from '../../../services/common_func'
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
                }

            })
        }

        // return <CardListItem headerExtra={[]} contentExtra={[]} />
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
                        onPress: () => console.log("移除")
                    },
                    {
                        text: <PigeonholeSvg width="19" height="19" />,  // 归档
                        style: {
                            backgroundColor: '#eab646',
                            color: 'white',
                        },
                        onPress: () => {
                            this.props.navigation.navigate('pigeonhole', { id: data.id, type: 'remind_task' })
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
                        onPress: () => console.log("标记为已完成")
                    }
                ]}
                title={data.title}
                headerIcon={<TaskIcon color="blue" width="14" height="14" />}
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