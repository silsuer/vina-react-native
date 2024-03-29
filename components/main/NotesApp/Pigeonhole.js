import React, { Component } from 'react'
import { View, TouchableOpacity, Dimensions, Text, StyleSheet, FlatList, DeviceEventEmitter } from 'react-native'
import { CardContainer, CardHeader } from '../../common/CardContainer'
import { CloseSvg, DetermineSvg, EmptySvg, CreatePigeonholeSvg, TakeSelectedSvg, RightSvg, DownSvg } from '../../assets/svgs/Common'
import { List, InputItem, Toast, Provider, Modal } from '@ant-design/react-native'
import Collapsible from 'react-native-collapsible'
import Page from '../../common/Page'
import { Target } from '../../assets/svgs/NotesSvg'
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import { Pigeonhole as P } from '../../../services/model/pigeonhole'
import SortableDragList from '../../common/SortableList'
import { ToolBarSvg } from '../../assets/svgs/RichTextEditor'
import { PigeonholeRelation } from '../../../services/model/pigeonhole_relation'
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
            collapsedStatus: {},
            selectedPigeonholeId: 0,   // 当前正在选择的归档id，只在给数据归档的时候有用处
            defaultCollapsedStatus: this.props.navigation.getParam('id') ? false : true // 如果是给数据进行归档，默认打开所有折叠
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
            p.update(data)
                .then(() => {
                    this.refreshPigeonholeList()
                })
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

        const getListFromPid = (list, pid) => {
            let res = []
            for (let i = 0; i < list.length; i++) {
                if (list[i].pid === pid) {
                    list[i].children = getListFromPid(list, list[i].id)
                    res.push(list[i])
                }
            }
            return res
        }

        // 从归档表中取出所有数据
        let p = new P()
        p.findAll()
            .then((list) => {
                let res = getListFromPid(list, 0)
                // 将得到的list根据pid重新组装成数组
                this.setState({ pigeonholeList: res })
            })


    }

    componentDidMount() {
        this.refreshPigeonholeList()
        if (this.props.navigation.getParam('selectedId')) {
            this.setState({ selectedPigeonholeId: this.props.navigation.getParam('selectedId') })
        }
        this.refreshPigeonholeListListener = DeviceEventEmitter.addListener("refresh-pigeonhole-sortable-list", () => {
            this.refreshPigeonholeList()
        })

        this.modifyPigeonholeDataEmitterListener = DeviceEventEmitter.addListener("modify-pigeonhole-data-emmiter", (id) => {
            // 从数据库中查出这条归档信息，然后赋值给临时数据，并显示Modal
            let p = new P()
            p.findOne(id)
                .then((res) => {
                    let data = {
                        id: id,
                        pid: res.pid,
                        color: res.color || '#000000',
                        sequence: res.sequence || 0,
                        name: res.name
                    }
                    this.setState({ tmpPigeonhole: data, showCreatePigeonholeModal: true })
                })
        })
    }

    componentWillUnmount() {
        this.refreshPigeonholeListListener.remove()
        this.modifyPigeonholeDataEmitterListener.remove()
    }

    changeTmpPigeonholeTitleValue(value) {
        let data = this.state.tmpPigeonhole
        data.name = value
        this.setState({ tmpPigeonhole: data })
    }

    // 点击折叠行
    _onPressCollapsedStatusListItem = (id) => {

        // 如果传来了id，证明是要选择一行进行归档，将这一行选中
        if (this.props.navigation.getParam('id')) {
            this.setState({ selectedPigeonholeId: id })
        }
        let s = this.state.collapsedStatus
        if (s[id] === undefined || s[id] === true) {
            s[id] = false
        } else {
            s[id] = true
        }
        this.setState({ collapsedStatus: s })
    }


    // 将归档列表转换为sort组件可识别的多维数组
    convertListToObj() {
        let tmpP = this.refreshList(this.state.pigeonholeList)
        let r = {}
        let order = []
        for (let i = 0; i < tmpP.length; i++) {
            r[tmpP[i].id] = tmpP[i]
            order.push(tmpP[i].id)
        }
        return { list: r, order: order }
    }

    // 传入的数据需要
    refreshList(list, layerNumber) {
        let n = layerNumber || 1
        let res = []
        for (let i = 0; i < list.length; i++) {
            let d = list[i]
            d.layerNumber = n

            res.push(d)

            if (d.children && d.children.length > 0) {
                let children = this.refreshList(d.children, n + 1)
                for (let j = 0; j < children.length; j++) {
                    res.push(children[j])
                }
            }
        }
        return res
    }

    // 点击确认后保存排序后的数据
    saveSortedData() {
        // 递归保存归档层级
        this.recursionSavePigeonhole(Pigeonhole.TmpPigeonholeList, 0);

        this.setState({ pigeonholeList: Pigeonhole.TmpPigeonholeList, status: 'common' }, () => {
            // 重新刷新数据
            this.refreshPigeonholeList()
        })
    }

    // 递归保存数据
    recursionSavePigeonhole(list, pid) {
        for (let i = 0; i < list.length; i++) {
            if (!(this.globalP)) {
                this.globalP = new P()
            }
            this.globalP.updatePid(list[i].id, pid, i)
            if (list[i].children && list[i].children.length > 0) {
                this.recursionSavePigeonhole(list[i].children, list[i].id)
            }
        }
    }

    // 保存排序后的临时数据
    saveTmpPigeonholeList(data) {
        Pigeonhole.TmpPigeonholeList = data
    }

    renderFlatListItem(item, layerNumber) {
        let n = layerNumber || 1

        return (
            <View>
                <TouchableOpacity onPress={this._onPressCollapsedStatusListItem.bind(this, item.item.id)} >
                    <View style={{
                        backgroundColor: item.item.id === this.state.selectedPigeonholeId ? '#f4f4f455' : '#ffffff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 15 * n,
                        height: 40,
                        borderRadius: 5,
                    }} >
                        <Target width={10} height={10} color={item.item.color || '#000'} />
                        <Text style={{ marginLeft: 7, fontSize: 15 }} >{item.item.name}</Text>
                        <View style={{ position: 'absolute', right: 20 }}>

                            {
                                item.item.children && item.item.children.length > 0 ?
                                    this.state.collapsedStatus[item.item.id] === undefined || this.state.collapsedStatus[item.item.id] === true ?
                                        <RightSvg color="darkgrey" width={20} height={15} /> :
                                        <DownSvg color="darkgrey" width={20} height={15} /> :
                                    null
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                {/* 下边框 */}
                <View style={{ backgroundColor: "#d4d4d4", height: 0.3, width: 350, marginLeft: 20 }}></View>
                {/* children 组件 */}
                {item.item.children && item.item.children.length > 0 ?
                    <Collapsible collapsed={this.state.collapsedStatus[item.item.id] === undefined ? this.state.defaultCollapsedStatus : this.state.collapsedStatus[item.item.id]}>
                        <View>
                            <FlatList
                                data={item.item.children}
                                renderItem={(item) => {
                                    return this.renderFlatListItem(item, n + 1)
                                }}
                                extraData={this.state}
                                keyExtractor={(item, index) => {
                                    return item.id + "indexChild"
                                }}
                            />
                        </View>
                    </Collapsible>
                    : <View></View>}

            </View>
        )
    }


    render() {

        const styles = StyleSheet.create({
            emptyText: {
                fontSize: 16,
                color: 'darkgrey',
                marginTop: 5,
            }
        })

        const getHeaderExtra = () => {

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
                        // 设置编辑状态时就先设置 要传入的数据
                        this.setState({ status: 'edit' })
                    }}>
                        <ToolBarSvg color="#1e294199" width="17" height="17" />
                    </TouchableOpacity>,
                ]

                if (this.props.navigation.getParam('id')) { // 存在id 要显示确认
                    extra.push(
                        <TouchableOpacity onPress={() => {
                            if (this.state.selectedPigeonholeId === 0) {
                                Toast.fail("请选择归档")
                                return
                            }
                            let id = this.props.navigation.getParam('id')
                            let type = this.props.navigation.getParam('type')  // 类型
                            // 添加或修改归档关联
                            let pl = new PigeonholeRelation()
                            pl.updateRelation(id, this.state.selectedPigeonholeId, type)
                                .then((res) => {
                                    // 更新完成，返回
                                    if (this.props.navigation.getParam('goBackCallback')) {
                                        const { state } = this.props.navigation
                                        state.params.goBackCallback()
                                    }
                                    this.props.navigation.goBack()
                                })
                        }}>
                            <TakeSelectedSvg color="#1e294199" width="19" height="19" />
                        </TouchableOpacity>
                    )
                }

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
                    return (
                        <FlatList
                            data={this.state.pigeonholeList}
                            renderItem={(item) => {
                                return this.renderFlatListItem(item, 0)
                            }}
                            extraData={this.state}
                            keyExtractor={(item, index) => {
                                return item.id + "index"
                            }}
                        />
                    )
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
                    <View style={{ height: windowHeight * 0.89, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
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