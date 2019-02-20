
import React, { Component } from 'react'
import { DeviceEventEmitter, Text, StyleSheet, View } from 'react-native'
import Page from '../common/Page'
import { MenuIcon } from '../common/SlideIcons'
import { PigeonholeSvg, FilterSvg, SearchSvg, NewNoteSvg, NoteSvg, ScheduleSvg, AccountRecordSvg, AnniversarySvg, CountdownSvg } from '../assets/svgs/Common'
import { TaskIcon } from '../assets/svgs/NotesSvg'
import { IndexSvg, TaskTabBarSvg, StatisticsBarSvg, MineBarSvg } from '../assets/svgs/TabBarIconSvg'
import { Modal, Provider } from '@ant-design/react-native'
import BottomTabBar from '../common/TabBar/BottomTabBar'
// import { ColorPicker } from 'react-native-color-picker'
// 便签本主界面
export default class NotesMainApp extends Component {


    constructor(props) {
        super(props)
        this.state = {
            currentPage: 'notes-home',
            modalVisiable: false,
            modalComponent: null,
            headerTitle: '最近',
            headerLeft: [
                <MenuIcon width="25" height="25" onPress={() => { this.props.navigation.openDrawer() }} />,
            ],
            headerRight: [
                <PigeonholeSvg width="15" height="15" />,
                <FilterSvg width="20" height="20" />,
                <SearchSvg width="15" height="15" />,
            ],
        }
    }

    newNote() {
        const s = StyleSheet.create({
            container: {

            }
        })
        // 给当前modal注入组件，并且显示出来
        const newNoteModal = (
            <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <BottomTabBar
                    mode="common"  // common 是正常模式 animate是动画弹出模式
                    status="open"
                    backgroundColor="white"
                    color="black"
                    options={[
                        {
                            icon: <NoteSvg color="black" width="23" height="23" />,
                            label: '笔记',
                            name: 'notes-new-note'
                        },
                        {
                            icon: <TaskIcon color="black" width="23" height="23" />,
                            label: '任务',
                            name: 'notes-new-task'
                        },
                        {
                            icon: <AccountRecordSvg color="black" width="25" height="23" />,
                            label: '账本',
                            name: 'notes-new-account-record'
                        },
                        {
                            icon: <AnniversarySvg color="black" width="23" height="23" />,
                            label: '纪念日',
                            name: 'notes-new-anniversary'
                        },
                        {
                            icon: <CountdownSvg color="black" width="20" height="23" />,
                            label: '倒计时',
                            name: 'notes-new-countdown'
                        },
                    ]}
                />
            </View>
        )

        this.setState({ modalComponent: newNoteModal, modalVisiable: true })
    }

    componentDidMount() {
        this.selectTabBarListener = DeviceEventEmitter.addListener("selectTabBar", (name) => {
            let title = null
            let left = [
                <MenuIcon width="25" height="25" onPress={() => { this.props.navigation.openDrawer() }} />,
            ]
            let right = null
            let select = false
            switch (name) {
                case 'notes-all':
                    title = '全部'
                    right = [
                        <PigeonholeSvg width="15" height="15" />,
                        <FilterSvg width="20" height="20" />,
                        <SearchSvg width="15" height="15" />,
                        <NewNoteSvg width="20" height="20" onPress={this.newNote.bind(this)} />
                    ]
                    select = true
                    break;
                case 'notes-statistics':
                    title = '统计'
                    select = true
                    break;
                case 'notes-home':
                    title = '最近'
                    right = [
                        <PigeonholeSvg width="15" height="15" />,
                        <FilterSvg width="20" height="20" />,
                        <SearchSvg width="15" height="15" />,
                    ]
                    select = true
                    break;
                case 'notes-new-note':
                    // 如果模态框打开，则关闭模态框
                    if (this.state.modalVisiable === true) {
                        this.setState({ modalVisiable: false })
                    }
                    // 跳转路由
                    this.props.navigation.navigate('notesNewNote')
                    break;
                default:
                    // 默认不变
                    break;
            }
            if (select) {
                this.setState({ currentPage: name, headerLeft: left, headerRight: right, headerTitle: title })
            }

        })
    }

    componentWillUnmount() {
        this.selectTabBarListener.remove()
    }

    // 获取当前页面中的body
    getCurrentBodyComponent() {
        const switchRender = () => {
            switch (this.state.currentPage) {
                case 'notes-all':
                    let All = require('./NotesApp/All').default
                    return (
                        <All />
                    )
                case 'notes-statistics':
                    let Statistics = require('./NotesApp/Statistics').default
                    return (
                        <Statistics />
                    )
                case 'notes-home':
                    let RecentView = require('./NotesApp/Recent').default
                    return (
                        <RecentView />
                    )
                default:
                    break;

            }
        }
        return switchRender()
    }


    render() {
        // title header中的名称
        // left header中的左侧button
        // right header中的右侧button
        // tabBarOptions 页面下方的导航栏
        // body 页面主体
        return (
            <Provider>
                <Page
                    title={this.state.headerTitle}
                    left={this.state.headerLeft}
                    right={this.state.headerRight}
                    tabBarOptions={[
                        {
                            icon: <IndexSvg width="20" height="20" />,
                            label: '最近',
                            name: 'notes-home'
                        },
                        {
                            icon: <TaskTabBarSvg width="20" height="20" />,
                            label: '全部',
                            name: 'notes-all'
                        },
                        {
                            icon: <StatisticsBarSvg width="25" height="25" />,
                            label: '统计',
                            name: 'notes-statistics'
                        },
                    ]}
                    body={this.getCurrentBodyComponent()}
                >
                </Page>

                <Modal
                    visible={this.state.modalVisiable}
                    transparent
                    style={{ backgroundColor: '#ffffff' }}
                    maskClosable={true}
                    onClose={() => { this.setState({ modalVisiable: !this.state.modalVisiable, modalComponent: null }) }}
                >
                    {this.state.modalComponent}
                </Modal>
            </Provider>
        )
    }
}