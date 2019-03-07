import React, { Component } from 'react'
import { View, TouchableOpacity, Dimensions, Text, StyleSheet } from 'react-native'
import { CardContainer, CardHeader, CardBody, CardList, CardListItem } from '../../common/CardContainer'
import { CloseSvg, DetermineSvg, EmptySvg, CreatePigeonholeSvg, PigeonholeSvg } from '../../assets/svgs/Common'
import { List, SwipeAction, InputItem, Toast } from '@ant-design/react-native'
import Collapsible from 'react-native-collapsible'
import { Provider, Modal } from '@ant-design/react-native'
import Page from '../../common/Page'
import { Target } from '../../assets/svgs/NotesSvg'
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import { Pigeonhole as P } from '../../../services/model/pigeonhole'
import SortableDragList from '../../common/SortableList'
import { ToolBarSvg } from '../../assets/svgs/RichTextEditor'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

// 归档
class Pigeonhole extends Component {

    static TmpPigeonholeList = []
    constructor(props) {
        super(props)
        this.state = {
            showCreatePigeonholeModal: false,
            showSelectColorModal: false,
            tmpPigeonhole: {},  // 临时归档对象 title pid color sequence id
            pigeonholeList: [],  // 这里是正常渲染的数据列表
            status: 'common',     // edit 是正在编辑状态 common 是正常选择状态
        }
    }


    // 保存输入框中的数据
    saveTmpPigeonhole() {

        let data = this.state.tmpPigeonhole
        if (!data.name) {
            Toast.fail("归档名称不能为空")
            return
        }
        data.pid = data.pid || 0   // 父分类
        data.color = data.color || '#000000'  // 颜色
        data.sequence = data.sequence || 0       // 排序

        let p = new P()
        // 入库
        if (data.id) {  // 存在id  更新

        } else {  // 不存在id  插入
            p.insert(data)
                .then((id) => {
                    data.id = id
                    let list = this.state.pigeonholeList
                    list.push(data)
                    // 重设列表，并清空临时对象
                    this.setState({ pigeonholeList: list, tmpPigeonhole: {} })
                })
        }

        // 关闭模态框并重新渲染列表
        this.setState({ showCreatePigeonholeModal: false })
    }

    // 刷新列表
    refreshPigeonholeList() {
        // 从归档表中取出所有数据
        let p = new P()
        p.findAll()
            .then((list) => {
                this.setState({ pigeonholeList: list })
            })
    }

    componentDidMount() {
        this.refreshPigeonholeList()

        // 做个实验  输出接收到的数据和转换出的数据
        // let received = JSON.parse(`[{"sequence":0,"id":1,"name":"Hhh","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":2,"name":"Asd","pid":0,"color":"#000000","layerNumber":1,"active":false,"children":[{"sequence":0,"id":3,"name":"Ddd","pid":0,"color":"#000000","layerNumber":2,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":3,"active":false},{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]}]}]},{"sequence":0,"id":7,"name":"3","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":8,"name":"4","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":9,"name":"5","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":10,"name":"7","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":11,"name":"33","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":12,"name":"22","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":13,"name":"44","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":14,"name":"234","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":15,"name":"432","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":16,"name":"334","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":17,"name":"443","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":18,"name":"445","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":19,"name":"444","pid":0,"color":"#000000","layerNumber":1,"active":false}]`)
        // let converted = JSON.parse(`{"1":{"sequence":0,"id":1,"name":"Hhh","pid":0,"color":"#000000","layerNumber":1,"active":false},"2":{"sequence":0,"id":2,"name":"Asd","pid":0,"color":"#000000","layerNumber":1,"active":false,"children":[{"sequence":0,"id":3,"name":"Ddd","pid":0,"color":"#000000","layerNumber":2,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":3,"active":false},{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]}]}]},"3":{"sequence":0,"id":3,"name":"Ddd","pid":0,"color":"#000000","layerNumber":2,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":3,"active":false},{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]}]},"4":{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]},"5":{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]},"6":{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false},"7":{"sequence":0,"id":7,"name":"3","pid":0,"color":"#000000","layerNumber":1,"active":false},"8":{"sequence":0,"id":8,"name":"4","pid":0,"color":"#000000","layerNumber":1,"active":false},"9":{"sequence":0,"id":9,"name":"5","pid":0,"color":"#000000","layerNumber":1,"active":false},"10":{"sequence":0,"id":10,"name":"7","pid":0,"color":"#000000","layerNumber":1,"active":false},"11":{"sequence":0,"id":11,"name":"33","pid":0,"color":"#000000","layerNumber":1,"active":false},"12":{"sequence":0,"id":12,"name":"22","pid":0,"color":"#000000","layerNumber":1,"active":false},"13":{"sequence":0,"id":13,"name":"44","pid":0,"color":"#000000","layerNumber":1,"active":false},"14":{"sequence":0,"id":14,"name":"234","pid":0,"color":"#000000","layerNumber":1,"active":false},"15":{"sequence":0,"id":15,"name":"432","pid":0,"color":"#000000","layerNumber":1,"active":false},"16":{"sequence":0,"id":16,"name":"334","pid":0,"color":"#000000","layerNumber":1,"active":false},"17":{"sequence":0,"id":17,"name":"443","pid":0,"color":"#000000","layerNumber":1,"active":false},"18":{"sequence":0,"id":18,"name":"445","pid":0,"color":"#000000","layerNumber":1,"active":false},"19":{"sequence":0,"id":19,"name":"444","pid":0,"color":"#000000","layerNumber":1,"active":false}}`)

        // console.log("接受了:", received)
        // console.log("转换后:", converted)

    }

    changeTmpPigeonholeTitleValue(value) {
        let data = this.state.tmpPigeonhole
        data.name = value
        this.setState({ tmpPigeonhole: data })
    }

    // 递归渲染折叠面板
    recursionRenderCollapsiblePanel(list, layerNumber) {
        let n = layerNumber || 1
        return list.map((data, index) => {
            return (
                <View key={index}>
                    {/* 头部 */}
                    <List.Item>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5 * n }}>
                            <Target width="10" height="10" color={data.color} />
                            <Text style={{ marginLeft: 7 }}>{data.name}</Text>
                        </View>
                    </List.Item>
                    {/* 折叠部分 */}
                    {data.children ? this.recursionRenderCollapsiblePanel(data.children, n + 1) : null}
                </View>
            )
        })
    }

    // 将归档列表转换为sort组件可识别的多维数组
    convertListToObj() {
        let l = this.state.pigeonholeList
        console.log("接收到的数据：")
        console.log(JSON.stringify(l))
        this.tmpP = []
        this.refreshList(this.state.pigeonholeList)
        let r = {}
        let order = []
        for (let i = 0; i < this.tmpP.length; i++) {
            r[this.tmpP[i].id] = this.tmpP[i]
            order.push(this.tmpP[i].id)
        }
        // console.log("数组编程对象:", arr)
        // this.setState({ list: r, order: Object.keys(r) })
        // console.log("转换后的数据:")
        // console.log(r)

        // console.log(Object.keys(r))
        return { list: r, order: order }
    }

    // 传入的数据需要
    refreshList(list, layerNumber) {
        let n = layerNumber || 1
        for (let i = 0; i < list.length; i++) {
            let d = list[i]
            d.layerNumber = n

            if (!(this.tmpP)) {
                this.tmpP = []
            }
            console.log(d)
            this.tmpP.push(d)

            if (d.children && d.children.length > 0) {
                this.refreshList(d.children, n + 1)
            }
        }
        // return res
    }

    // 保存排序后的数据
    saveSortedData() {
        // console.log("11", Pigeonhole.TmpPigeonholeList)
        this.setState({ pigeonholeList: Pigeonhole.TmpPigeonholeList })
    }

    saveTmpPigeonholeList(data) {


        // console.log("接收到的数据:")
        // console.log(JSON.stringify(data))
        Pigeonhole.TmpPigeonholeList = data
    }

    render() {

        const styles = StyleSheet.create({
            emptyText: {
                fontSize: 16,
                color: 'darkgrey',
                marginTop: 5,
            }
        })

        /**
         [{"sequence":0,"id":1,"name":"Hhh","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":2,"name":"Asd","pid":0,"color":"#000000","layerNumber":1,"active":false,"children":[{"sequence":0,"id":3,"name":"Ddd","pid":0,"color":"#000000","layerNumber":2,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":3,"active":false},{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]}]}]},{"sequence":0,"id":7,"name":"3","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":8,"name":"4","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":9,"name":"5","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":10,"name":"7","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":11,"name":"33","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":12,"name":"22","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":13,"name":"44","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":14,"name":"234","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":15,"name":"432","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":16,"name":"334","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":17,"name":"443","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":18,"name":"445","pid":0,"color":"#000000","layerNumber":1,"active":false},{"sequence":0,"id":19,"name":"444","pid":0,"color":"#000000","layerNumber":1,"active":false}]

    {"1":{"sequence":0,"id":1,"name":"Hhh","pid":0,"color":"#000000","layerNumber":1,"active":false},"2":{"sequence":0,"id":2,"name":"Asd","pid":0,"color":"#000000","layerNumber":1,"active":false,"children":[{"sequence":0,"id":3,"name":"Ddd","pid":0,"color":"#000000","layerNumber":2,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":3,"active":false},{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]}]}]},"3":{"sequence":0,"id":3,"name":"Ddd","pid":0,"color":"#000000","layerNumber":2,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":3,"active":false},{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]}]},"4":{"sequence":0,"id":4,"name":"Bbb","pid":0,"color":"#000000","layerNumber":3,"active":false,"children":[{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]}]},"5":{"sequence":0,"id":5,"name":"1","pid":0,"color":"#000000","layerNumber":4,"active":false,"children":[{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false}]},"6":{"sequence":0,"id":6,"name":"2","pid":0,"color":"#000000","layerNumber":5,"active":false},"7":{"sequence":0,"id":7,"name":"3","pid":0,"color":"#000000","layerNumber":1,"active":false},"8":{"sequence":0,"id":8,"name":"4","pid":0,"color":"#000000","layerNumber":1,"active":false},"9":{"sequence":0,"id":9,"name":"5","pid":0,"color":"#000000","layerNumber":1,"active":false},"10":{"sequence":0,"id":10,"name":"7","pid":0,"color":"#000000","layerNumber":1,"active":false},"11":{"sequence":0,"id":11,"name":"33","pid":0,"color":"#000000","layerNumber":1,"active":false},"12":{"sequence":0,"id":12,"name":"22","pid":0,"color":"#000000","layerNumber":1,"active":false},"13":{"sequence":0,"id":13,"name":"44","pid":0,"color":"#000000","layerNumber":1,"active":false},"14":{"sequence":0,"id":14,"name":"234","pid":0,"color":"#000000","layerNumber":1,"active":false},"15":{"sequence":0,"id":15,"name":"432","pid":0,"color":"#000000","layerNumber":1,"active":false},"16":{"sequence":0,"id":16,"name":"334","pid":0,"color":"#000000","layerNumber":1,"active":false},"17":{"sequence":0,"id":17,"name":"443","pid":0,"color":"#000000","layerNumber":1,"active":false},"18":{"sequence":0,"id":18,"name":"445","pid":0,"color":"#000000","layerNumber":1,"active":false},"19":{"sequence":0,"id":19,"name":"444","pid":0,"color":"#000000","layerNumber":1,"active":false}}
         */

        const getHeaderExtra = () => {
            const navigation = this.props.navigation

            let extra = []
            if (this.state.status === 'edit') {
                // 一个添加按钮，一个完成按钮
                extra = [
                    <TouchableOpacity onPress={this.saveSortedData.bind(this)}>
                        <DetermineSvg color="#1e294199" width="17" height="17" />
                    </TouchableOpacity>,
                    <TouchableOpacity onPress={() => {
                        // 弹出创建归档的model 
                        this.setState({ showCreatePigeonholeModal: true })
                    }}>
                        <CreatePigeonholeSvg color="#1e294199" width="15" height="15" />
                    </TouchableOpacity>

                ]
            } else {
                extra = [
                    <TouchableOpacity onPress={() => {
                        this.setState({ status: 'edit' })
                    }}>
                        <ToolBarSvg color="#1e294199" width="17" height="17" />
                    </TouchableOpacity>,
                ]
            }
            return extra
        }

        const getCardBody = () => {
            //  如果rows长度为0，则返回提醒为空的view
            if (this.state.pigeonholeList.length > 0) {
                // 如果当前状态是编辑状态，则返回可拖拽组件
                if (this.state.status === 'edit') {
                    return (
                        <SortableDragList
                            onSorted={this.saveTmpPigeonholeList.bind(this)}
                            data={this.convertListToObj()} />
                    )
                } else {
                    //  根据数据拼接手风琴
                    return this.recursionRenderCollapsiblePanel(this.state.pigeonholeList, 0)
                }

            } else {
                return (
                    <View style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <EmptySvg width={windowWidth / 2.5} height={windowHeight / 2.5} color="darkgrey" />
                        <Text style={styles.emptyText}>空空如也~</Text>
                        <Text style={styles.emptyText}>快去创建归档来整理你的笔记吧</Text>
                    </View>
                )
            }
        }

        const getBody = () => {
            return (
                <CardContainer>
                    <CardHeader
                        icon={<TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <CloseSvg color="#1e294199" width="17" height="17" />
                        </TouchableOpacity>}
                        title={this.props.navigation.getParam('id') ? '归档' : '归档管理'}
                        extra={getHeaderExtra()}
                    />
                    <View style={{ height: windowHeight * 0.9, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
                        {getCardBody()}
                    </View>
                </CardContainer>
            )
        }

        return (
            <Provider>
                <Page
                    title={false}
                    left={[]}
                    right={[]}
                    tabBarOptions={[]}
                    body={getBody()}
                    noScrollView
                />

                <Modal visible={this.state.showCreatePigeonholeModal}
                    transparent
                    maskClosable
                    onClose={() => { this.setState({ showCreatePigeonholeModal: false }) }}
                    title="新归档"
                    footer={[
                        { text: '取消', onPress: () => { this.setState({ showCreatePigeonholeModal: false }) } },
                        { text: '保存', onPress: () => { this.saveTmpPigeonhole() } },
                    ]}
                >
                    <List style={{ marginTop: 20 }}>
                        <InputItem textAlign="right" onChange={this.changeTmpPigeonholeTitleValue.bind(this)} value={this.state.tmpPigeonhole.name}>
                            <Text>名称</Text>
                        </InputItem>
                        <List.Item
                            textAlign='center'
                            extra={
                                <TouchableOpacity onPress={() => { this.setState({ showSelectColorModal: true }) }}>
                                    <Target color={this.state.tmpPigeonhole.color || '#000000'} />
                                </TouchableOpacity>
                            }
                        >
                            <Text>颜色</Text>
                        </List.Item>
                    </List>

                </Modal>

                <Modal
                    visible={this.state.showSelectColorModal}
                    popup
                    animationType="slide-up"
                    maskClosable
                    onClose={() => { this.setState({ showSelectColorModal: false }) }}
                >
                    <View style={{ height: 300 }}>
                        <ColorPicker
                            style={{ flex: 1, marginBottom: 0, padding: 30 }}
                            onColorSelected={(color) => {
                                let data = this.state.tmpPigeonhole
                                data.color = typeof (color) === 'string' ? color : fromHsv(color)
                                this.setState({ tmpPigeonhole: data, showSelectColorModal: false })
                            }}
                            onColorChange={(color) => {
                                let data = this.state.tmpPigeonhole
                                data.color = typeof (color) === 'string' ? color : fromHsv(color)
                                this.setState({ tmpPigeonhole: data })
                            }}
                        />
                    </View>
                </Modal>
            </Provider >
        )
    }
}

export default Pigeonhole