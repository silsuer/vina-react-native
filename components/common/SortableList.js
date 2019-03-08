// 这是一个可拖动排序的组件，当拖动的菜单折叠的时候，可像文件夹一样，变为二级菜单

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, UIManager, findNodeHandle, Alert,DeviceEventEmitter } from 'react-native'
import { Target } from '../assets/svgs/NotesSvg'
import { SequenceSvg, DeleteSvg } from '../assets/svgs/Common'
import { SwipeAction, Toast } from '@ant-design/react-native'
import SortableListView from 'react-native-sortable-listview'
import { Pigeonhole } from '../../services/model/pigeonhole'

// 传入一个list，将渲染成可排序的列表


class RowComponent extends Component {
    render() {
        let item = this.props.data
        return (
            <SwipeAction
                right={[
                    {
                        text: <DeleteSvg width="20" height="20" />,
                        onPress: () => {
                            // 点击删除，弹出删除归档选项：取消 删除归档及该归档下所有项目 仅删除归档
                            Alert.alert("确认删除?", "该操作不可逆！请谨慎操作!", [
                                {
                                    text: '删除归档及该归档下所有项目',
                                    onPress: () => {
                                        // 二次确认
                                        Alert.alert("再次确认?", "确认要删除该归档下的所有项目吗?(包含笔记、提醒、纪念日、账单、倒计时)", [
                                            {
                                                text: '取消',
                                            },
                                            {
                                                text: '确认删除',
                                                onPress: () => {
                                                    let p = new Pigeonhole()
                                                    p.deletePigeonholeWithRelation(item.id)
                                                        .then(() => {
                                                            // 删除逻辑
                                                            Toast.success("已删除")
                                                            this.props.onDeleted && this.props.onDeleted()
                                                        })
                                                }
                                            },
                                        ])
                                    }
                                },
                                {
                                    text: '仅删除归档',
                                    onPress: () => {
                                        // 删除归档逻辑
                                        let p = new Pigeonhole()
                                        // 删除归档关联，却不删除关联数据
                                        p.deletePigeonholeWithoutRelation(item.id)
                                            .then(() => {
                                                Toast.success("已删除")
                                                this.props.onDeleted && this.props.onDeleted()
                                            })

                                    }
                                },
                                {
                                    text: '取消',
                                }
                            ])
                        },
                        style: { backgroundColor: 'red' },

                    }
                ]}
            >
                <View
                >
                    <View style={{
                        backgroundColor: item.active ? '#cccccc99' : '#ffffff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 15 * item.layerNumber,
                        height: 40,
                        borderRadius: 5,
                    }} >
                        <Target width={10} height={10} color={item.color || '#000'} />
                        <Text style={{ marginLeft: 7, fontSize: 15 }} >{item.name}</Text>
                        <View style={{ position: 'absolute', right: 20 }}>
                            <TouchableOpacity {...this.props.sortHandlers}>
                                <SequenceSvg color="darkgrey" width={20} height={15} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 下边框 */}
                    <View style={{ backgroundColor: "#d4d4d4", height: 0.3, width: 350, marginLeft: 20 }}></View>
                </View>
            </SwipeAction>
        )
    }
}

class SortableDragList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],   // 最终这里成的多维数组
            list: {}, // 要渲染得数据，传入的数据要整理成合适的格式
            order: [],
            activeBoxId: 0,  // 当前拖拽行正要进入得父行id（拖到其他文件夹中）
            activeId: 0, // 当前正在拖拽得id（已放弃我，现在这个字段仅仅用来标记定时器是否继续运行）
            activeRow: {},  // 正在活动的数据
            activeFrom: -1,  // 移动row开始移动时候的索引
            activeTo: -1,   // 移动row结束移动时候的索引
            tmpList: [],  // 临时存储拖拽时子文件夹得数组

        }
        this.listComponent = {}
    }

    refreshList(list, layerNumber) {
        let n = layerNumber || 1
        let res = []
        for (let i = 0; i < list.length; i++) {
            let d = list[i]
            d.layerNumber = n
            res.push(d)
            if (d.children && d.children.length > 0) {
                let newD = this.refreshList(d.children, n + 1)
                for (let j = 0; j < newD.length; j++) {
                    res.push(newD[j])
                }
            }
        }
        return res
    }

    componentDidMount() {
        this.setState({ list: this.props.data.list, order: this.props.data.order })
    }

    componentWillReceiveProps(props) {
        // 获取数组，把数组变为对象
        this.setState({ list: props.data.list, order: props.data.order })
    }

    clearTimer() {
        this.timer && clearInterval(this.timer)
    }

    async getPageY(r) {
        const get = async (ref) => {
            return new Promise((resolve, reject) => {
                return UIManager.measure(findNodeHandle(ref), (x, y, width, height, pageX, pageY) => {
                    resolve(pageY)
                    // resolve(y)
                })
            })
        }
        let y = await get(r)
        return y
    }
    async getOthersPageY(id) {

        let order = this.state.order
        let res = []
        for (let i = 0; i < order.length; i++) {
            // if (parseInt(order[i]) === id) {
            //     continue
            // }
            res.push({
                index: order[i],
                pageY: await this.getPageY(this.rowComponentRef[order[i]])
            })
        }
        return res
    }



    // 开启一个死循环，执行代码
    async setupTimer(data) {
        const start = async () => {
            if (this.state.activeId == 0) {
                return
            }
            let currentY = await this.getPageY(this.rowComponentRef[data.id])
            let currentList = await this.getOthersPageY(data.id)

            // 设置to，得到当前pageY在整个order 中的索引
            currentList.sort(function (a, b) {
                if (a.pageY === 0) {
                    return 1
                }
                return a.pageY - b.pageY
            })


            let number = 0
            let id = 0
            for (let i = 0; i < currentList.length; i++) { // n是id 值是Y轴值
                if (parseInt(currentList[i].index) == data.id) {
                    this.RowTo = i
                    continue
                }
                if ((currentY - currentList[i].pageY) < 23 && (currentY - currentList[i].pageY) > -23) {

                    number += 1
                    id = parseInt(currentList[i].index)
                    if (currentY - currentList[i].pageY < 23 && currentY - currentList[i].pageY >= 0) {
                        this.activeBoxStatus = 'down' // 这是在要进入得文件夹下面
                    }
                    if (currentY - currentList[i].pageY > -23 && currentY - currentList[i].pageY < 0) {
                        this.activeBoxStatus = 'up'  // 这是在要进入得文件夹的下面
                    }
                }
            }



            // 如果判定出这个可以选中，那就直接改变list中的active，然后在渲染得时候设置
            if (number > 0 && this.state.activeId > 0) {
                this.setActiveStatus(id)
                    .then(() => {
                        start()
                    })
            } else {
                if (this.state.activeId > 0) {
                    this.setActiveStatus(0)
                        .then(() => {
                            start()
                        })
                } else {
                    return
                }
            }
        }

        await start()
    }

    async setActiveStatus(id) {
        // 将这个id对应的对象的active设置为true，其他的设置为false
        return new Promise((resolve, reject) => {
            let list = this.state.list
            for (let n in list) {
                if (parseInt(n) === id) {
                    list[n].active = true
                } else {
                    list[n].active = false
                }
            }
            return this.setState({ list: JSON.parse(JSON.stringify(list)) }, () => {
                resolve()
            })
        })
    }



    // 当开始拖拽排序时调用
    _onRowActive(row) {

        // 将当前文件夹下的所有数据隐藏
        // let list = JSON.parse(JSON.stringify(this.state.list))
        // let order = JSON.parse(JSON.stringify(this.state.order))
        let list = this.state.list
        let order = this.state.order

        let flag = false
        let tmpList = []
        let n = 0
        let index = -1

        // ======== 隐藏子文件夹 ===========
        for (let i = 0; i < order.length; i++) {
            if (parseInt(order[i]) === row.rowData.data.id) {
                flag = true
                index = i
                continue
            }
            if (flag === true) {
                if (list[order[i]].layerNumber > row.rowData.data.layerNumber) {
                    n += 1
                } else {
                    break
                }
            }
        }

        // 从order中删除
        if (n > 0 && index > -1) {
            let t = order.splice(index + 1, n)
            for (let i = 0; i < t.length; i++) {
                tmpList.push(list[t[i]])
                delete list[t[i]]
            }
        }

        // ========= END ================

        // 得到from 即当前row在order中的索引
        for (let i = 0; i < order.length; i++) {
            if (parseInt(order[i]) === row.rowData.data.id) {
                this.RowFrom = i
                break
            }
        }

        // 开启一个定时器，判断当前行的位置，和其他所有行得位置
        this.setState({
            activeId: row.rowData.data.id,
            activeRow: row.rowData.data,
            order: order,
            list: list,
            tmpList: tmpList
        }, () => {
            this.setupTimer(row.rowData.data)
        })
    }

    // 恢复列表,传入的是tmpList要跟着渲染的行的id
    restoreList(id, type) {

        let t = type || 'cancel' // 取消状态下不改变layerNumber active状态改变(表示拖拽进文件夹)

        return new Promise((resolve, reject) => {
            let order = this.state.order
            let list = this.state.list
            let tmpList = this.state.tmpList
            // 先从order里查出这个id的索引
            // 将tmpList 的索引加入order中
            // 将tmpList重新加入list中
            let n = -1
            for (let i = 0; i < order.length; i++) {
                if (parseInt(order[i]) === id) {
                    n = i + 1
                    break
                }
            }
            let res = []
            let nowObj = list[id]
            for (let i = 0; i < tmpList.length; i++) {
                if (t !== 'cancel') {
                    tmpList[i].layerNumber = parseInt(tmpList[i].layerNumber) + 1
                }
                list[tmpList[i].id] = tmpList[i] // 加入list
                res.push(tmpList[i].id)
            }
            order.splice(n, 0, ...res)  // 加入order
            this.setState({ order: order, list: list, tmpList: [] }, () => {
                return resolve()
            })
        })
    }

    // 刷新每个对象的layerNumber
    refreshLayerNumber() {
        // 遍历order 取出每一个对象，判断这是第几层级
        let order = this.state.order
        let list = this.state.list
        // 得到排序后的list
        for (let i = 0; i < order.length; i++) {
            for (let j = i - 1; j > 0; j--) {
                if (list[order[j]].layerNumber < list[order[i]].layerNumber) {
                    list[order[i]].layerNumber = list[order[j]].layerNumber + 1
                    break;
                }
            }
        }

        this.setState({ list: JSON.parse(JSON.stringify(list)) }, () => {
            let data = this.SortOutList()
            this.setState({ data: data }, () => {
                if (this.props.onSorted) {
                    this.props.onSorted(data)
                }
            })
        })

    }

    // 将排序后的数组整理成可折叠的二维数组
    SortOutList(oo, ll, ii, nn) {
        let order = oo || this.state.order
        let list = ll || this.state.list
        let res = []
        let initLayerNumber = nn || 1  // 初始化number为1
        let initIndex = ii || 0  // 初始化进入索引为0
        for (let i = initIndex; i < order.length; i++) {
            if (list[order[i]].layerNumber == initLayerNumber) {
                let o = list[order[i]]
                // 如果下一级layerNumber大于现在的，证明有children
                if (o.children) {
                    delete o.children
                }
                if (list[order[i + 1]] && list[order[i + 1]].layerNumber > o.layerNumber) {
                    o.children = this.SortOutList(order, list, i + 1, initLayerNumber + 1)
                    console.log(o.layerNumber, list[order[i + 1]].layerNumber)
                }
                res.push(o)
                if (list[order[i + 1]] && list[order[i + 1]].layerNumber < initLayerNumber) {
                    break
                }
            }
        }
        return res
    }

    _onRowMoveCancel() {
        this.restoreList(this.state.activeRow.id, 'cancel')
            .then(() => {
                // 停止定时器
                this.setState({ activeId: 0 }, () => {
                    this.setActiveStatus(0)
                        .then(() => {
                            this.refreshLayerNumber()
                        })
                })
            })

    }

    getActiveIdFromList() {
        let list = this.state.list
        for (let n in list) {
            if (list[n].active === true) {
                return n
            }
        }
        return 0
    }

    _onRowMoved(e) {

        // 获取传入的id在order 中的索引
        const getNowActiveFolderIndex = (id) => {
            let order = this.state.order
            for (let i = 0; i < order.length; i++) {
                if (parseInt(order[i]) === id) {
                    return i
                }
            }
            return false
        }


        let order = this.state.order
        let list = this.state.list
        let nowActiveFolderId = parseInt(this.getActiveIdFromList())

        // 如果存在选中项，获取选中项id，在order 中把当前row的id放到选中项后面
        let nowActiveFolder = list[nowActiveFolderId]
        let nowActiveRow = list[this.state.activeRow.id]

        this.tt = 'cancel'

        // 存在拖入文件夹的操作
        if (nowActiveFolderId > 0) {

            // 获取nowActiveFolder 的索引
            let nowActiveFolderIndex = getNowActiveFolderIndex(nowActiveFolderId)
            if (nowActiveFolderIndex !== false) {

                // 如果是拖入文件夹操作，layerNumber是拖入文件夹的LyerNumber+1,否则和下一级相等，如果没有下一级，和上一级相等
                nowActiveRow.layerNumber = nowActiveFolder.layerNumber + 1  // layerNumber +1


                let ind = nowActiveFolderIndex
                if (this.activeBoxStatus === 'down' && this.RowFrom >= this.RowTo) {
                    ind += 1
                }
                if (this.activeBoxStatus === 'up' && this.RowFrom >= this.RowTo) {
                    ind += 1
                }
                order.splice(ind, 0, order.splice(this.RowFrom, 1)[0])
                this.tt = 'active'
            }
        } else {

            // return
            if (list[order[this.RowTo + 1]]) {
                nowActiveRow.layerNumber = list[order[this.RowTo + 1]].layerNumber  // 和下一级相等
            } else {
                nowActiveRow.layerNumber = list[order[this.RowTo]].layerNumber  // 和上一级相等
            }

            // 不拖入文件夹，有两种可能：在同一文件夹下拖动，跨文件夹层级拖动
            // 如果移动到的位置是在和原来同一个文件夹下，则layerNumber不变，否则都变为0
            order.splice(this.RowTo, 0, order.splice(this.RowFrom, 1)[0])
            // 刷新layerNumber
        }
        list[this.state.activeRow.id] = nowActiveRow


        this.setState({ order: order, list: list }, () => {
            this.restoreList(this.state.activeId, this.tt)
                .then(() => {
                    this.setState({ activeId: 0 }, () => {
                        this.setActiveStatus(0)
                            .then(() => {
                                this.refreshLayerNumber()
                            })

                    })
                })
        })
    }





    render() {
        // 先渲染数据
        return (
            <View style={{ flex: 1 }}>
                <SortableListView
                    style={{ flex: 1 }}
                    data={this.state.list}
                    order={this.state.order}
                    renderRow={row => <RowComponent ref={(ref) => {
                        if (this.rowComponentRef == undefined) {
                            this.rowComponentRef = {}
                        }
                        this.rowComponentRef[row.id] = ref
                    }}
                        data={row}
                        onDeleted={()=>{
                            // 让上层组件重新渲染列表
                            DeviceEventEmitter.emit("refresh-pigeonhole-sortable-list")
                        }}
                    />}
                    onRowActive={(row) => {
                        this._onRowActive(row)
                    }}
                    onMoveEnd={(row) => {
                        this._onRowMoved()
                    }}
                    activeOpacity={0.8}
                    moveOnPressIn
                    pageSize={500}
                    onMoveCancel={() => this._onRowMoveCancel()}
                />
            </View>
        )
    }
}

// 导出
export default SortableDragList