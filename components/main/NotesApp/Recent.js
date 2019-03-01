// 便签本主界面的home页面，显示最近消息

import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { CardContainer, CardHeader, CardBody, CardList, CardListItem } from '../../common/CardContainer'
import { TaskIcon } from '../../assets/svgs/NotesSvg'

// 最近（任务/日程/便签）界面
export default class RecentView extends Component {
    render() {
        return (
                <CardContainer>
                    {/* title 是名称 icon是图标 extra是右侧的按钮 */}
                    <CardHeader title="今日任务" icon={<TaskIcon width="20" height="20" color="blue" />} extra={[<TaskIcon width="20" height="20" color="blue" />]} />
                    <CardBody>
                        <CardList>
                            <CardListItem
                                // icon="white"
                                targetColor="white"
                                icon={<TaskIcon color="orange" width="12" height="12" />}
                                title="这是标题"
                                headerExtra={[<Text style={{ color: 'grey' }}>12:00</Text>, <TaskIcon width="20" height="20" color="blue" />]}
                                contentExtra={[<Image source={require('../../assets/images/default_avatar.jpg')} style={{ width: 40, height: 40 }} />]}
                                content="这是一个很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的故事"
                            />
                             <CardListItem
                                targetColor="blue"
                                icon={<TaskIcon color="black" width="12" height="12" />}
                                title="这是标题"
                                headerExtra={[]}
                                contentExtra={[]}
                            />
                        </CardList>
                    </CardBody>
                </CardContainer>
        )
    }
}