
import React, { Component } from 'react'
import { DeviceEventEmitter, Text, StyleSheet, View } from 'react-native'
import Page from '../common/Page'
import { MenuIcon } from '../common/SlideIcons'
import { PigeonholeSvg, FilterSvg, SearchSvg, NewNoteSvg, NoteSvg, ScheduleSvg, AccountRecordSvg, AnniversarySvg, CountdownSvg } from '../assets/svgs/Common'
import { TaskIcon } from '../assets/svgs/NotesSvg'
import { IndexSvg, TaskTabBarSvg, StatisticsBarSvg } from '../assets/svgs/TabBarIconSvg'
import { Modal, Provider } from '@ant-design/react-native'
import BottomTabBar from '../common/TabBar/BottomTabBar'
import Statistics from './NotesApp/Statistics';
import All from './NotesApp/All';
import Recent from './NotesApp/Recent';

// 便签本主界面
export default class NotesMainApp extends Component {


    constructor(props) {
        super(props)

        this.PageConfig = {
            'notes-home': {
                title: '最近',
                headerLeft: [
                    <MenuIcon width="25" height="25" onPress={() => { this.props.navigation.openDrawer() }} />,
                ],
                headerRight: [
                    <PigeonholeSvg width="15" height="15" />,
                    <FilterSvg width="20" height="20" />,
                    <SearchSvg width="15" height="15" />,
                ],
                mainPage: <Recent />,
            },
            'notes-statistics': {
                title: '统计',
                headerLeft: [
                    <MenuIcon width="25" height="25" onPress={() => { this.props.navigation.openDrawer() }} />,
                ],
                headerRight: [],
                mainPage: <Statistics />
            },
            'notes-all': {
                title: '全部',
                headerLeft: [
                    <MenuIcon width="25" height="25" onPress={() => { this.props.navigation.openDrawer() }} />,
                ],
                headerRight: [
                    <PigeonholeSvg width="15" height="15" />,
                    <FilterSvg width="20" height="20" />,
                    <SearchSvg width="15" height="15" />,
                    <NewNoteSvg width="20" height="20" onPress={this.newNote.bind(this)} />
                ],
                mainPage: <All />
            }
        }

        let pageName = 'notes-home'
        if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.pageName) {
            pageName = this.props.navigation.state.params.pageName
        }
        this.state = {
            currentPage: pageName,
            modalVisiable: false,
            modalComponent: null,
            headerTitle: this.PageConfig[pageName].title,
            headerLeft: this.PageConfig[pageName].headerLeft,
            headerRight: this.PageConfig[pageName].headerRight,
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
                            label: '提醒',
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
            if (this.PageConfig[name]) {
                let title = this.PageConfig[name].title
                let left = this.PageConfig[name].headerLeft
                let right = this.PageConfig[name].headerRight
                this.setState({ currentPage: name, headerLeft: left, headerRight: right, headerTitle: title })
            } else {
                if (this.state.modalVisiable === true) {
                    this.setState({ modalVisiable: false })
                }
                switch (name) {
                    case 'notes-new-note':
                        // 跳转路由
                        this.props.navigation.navigate('notesNewNote')
                        break
                    case 'notes-new-task':
                        this.props.navigation.navigate('newRemindTask')
                        break
                    case 'notes-navigate-to-tomato-timer':
                        this.props.navigation.navigate('tomatoTimer')
                        break
                    case 'notes-new-account-record':
                        this.props.navigation.navigate('newBill', {
                            callback: () => {
                                DeviceEventEmitter.emit("refresh-all-list")
                            }
                        })
                        break
                }
            }


        })
    }

    componentWillUnmount() {
        this.selectTabBarListener.remove()
    }

    // 获取当前页面中的body
    getCurrentBodyComponent() {
        const switchRender = () => {
            return this.PageConfig[this.state.currentPage].mainPage
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
                            icon: <IndexSvg width="23" height="20" />,
                            label: '最近',
                            name: 'notes-home'
                        },
                        {
                            icon: <TaskTabBarSvg width="30" height="25" />,
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