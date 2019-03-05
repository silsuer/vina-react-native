// 这是一个可拖动排序的组件，当拖动的菜单折叠的时候，可像文件夹一样，变为二级菜单

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, UIManager, findNodeHandle, LayoutAnimation } from 'react-native'
import { Target } from '../assets/svgs/NotesSvg'
import { SequenceSvg } from '../assets/svgs/Common'

import SortableListView from 'react-native-sortable-listview'


// 传入一个list，将渲染成可排序的列表


class RowComponent extends Component {
    render() {
        let item = this.props.data
        return (
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
        )
    }
}

class SortableDragList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: {}, // 要渲染得数据，传入的数据要整理成合适的格式
            order: [],
            activeBoxId: 0,  // 当前拖拽行正要进入得父行id（拖到其他文件夹中）
            activeId: 0  // 当前正在拖拽得id
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

    // 将数组变为对象（已index为key）
    convertListToObj(data) {
        let arr = this.refreshList(this.props.data)
        let r = {}
        for (let i = 0; i < arr.length; i++) {
            r[arr[i].id] = arr[i]
        }
        this.setState({ list: r, order: Object.keys(r) })
    }

    componentDidMount() {

        this.convertListToObj(this.props.data)
    }

    componentWillReceiveProps(props) {
        // 获取数组，把数组变为对象
        this.convertListToObj(props.data)
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
        let res = {}
        for (let i = 0; i < order.length; i++) {
            if (parseInt(order[i]) === id) {
                continue
            }
            res[order[i]] = await this.getPageY(this.rowComponentRef[order[i]])
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
            let number = 0
            let id = 0
            for (let n in currentList) {
                if ((currentY - currentList[n]) < 23 && (currentY - currentList[n]) > -23) {
                    if (parseInt(n) == data.id) {
                        continue
                    }
                    number += 1
                    id = parseInt(n)

                }
            }

            // 如果判定出这个可以选中，那就直接改变list中的active，然后在渲染得时候设置
            if (number > 0 && this.state.activeId > 0) {
                console.log("设置")
                this.setActiveStatus(id)
                    .then(() => {
                        start()
                    })
            } else {
                if (this.state.activeId > 0) {
                    this.setActiveStatus(0)
                        .then(() => {
                            console.log(222)
                            start()
                        })
                } else {
                    return
                }

                //  start()
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
        // 开启一个定时器，判断当前行的位置，和其他所有行得位置
        this.setState({ activeId: row.rowData.data.id }, () => {
            this.setupTimer(row.rowData.data)
        })
    }


    _onRowMoveCancel() {
        // 停止定时器
        this.setState({ activeId: 0 }, () => {
            this.setActiveStatus(0)
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

        if (nowActiveFolderId > 0) {
            // 如果存在选中项，获取选中项id，在order 中把当前row的id放到选中项后面，并且layerNumber是选中项layerNumber+1
            let nowActiveFolder = list[nowActiveFolderId]
            let nowActiveRow = list[e.row.data.id]
            nowActiveRow.layerNumber = nowActiveFolder.layerNumber + 1  // layerNumber +1
            list[e.row.data.id] = nowActiveRow
            // 获取nowActiveFolder 的索引
            let nowActiveFolderIndex = getNowActiveFolderIndex(nowActiveFolderId)
            console.log(nowActiveFolderId, nowActiveFolderIndex, order)
            if (nowActiveFolderIndex !== false) {
                console.log("当前被覆盖的数据id", nowActiveFolderIndex)
                order.splice(nowActiveFolderIndex, 0, order.splice(e.from, 1)[0])
            }



        } else {

            // 如果移动到的位置是在和原来同一个文件夹下，则layerNumber不变，否则都变为0

            order.splice(e.to, 0, order.splice(e.from, 1)[0])
        }

        console.log(order, this.getActiveIdFromList())
        this.setState({ order: order, activeId: 0, list: list }, () => {
            this.setActiveStatus(0)
        })
    }

    // 当结束拖拽排序时调用
    _onRowMoveEnd(e) {
        // console.log(111)
        // 清除定时器
        // this.setState({ activeId: 0 }, () => {
        //     this.setActiveStatus(0)
        // })
        // console.log("current:", this.getActiveIdFromList())
        // let activeId = this.state.activeId  // 运动的行得id
        // this.setState({ activeId: 0 }, () => {
        //     this.setActiveStatus(0)
        // })
        // console.log(this.state.activeBoxId, this.state.activeId)
        // this.setState({ activeId: 0, activeBoxId: 0 }, () => {


        // })
        // this.clearTimer()
        // let order = this.state.order
        // order.splice(e.to, 0, order.splice(e.from, 1)[0])

        // console.log(this.state.activeBoxId, e.row.data.id)

        // if (this.state.activeBoxId == e.row.data.id) {
        //     let list = this.state.list
        //     list[e.row.data.id] = e.row.data
        //     this.setState({ list: list })
        //     e.row.data.layerNumber += 1
        // }
        // // console.log(list)
        // // console.log(e.row)
        // // list[e.row.data.id] = e.row
        // // console.log(list[e.row.data.id])
        // this.setState({ order: order, activeBoxId: 0 })

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
                    />}
                    // rowHasChanged={(r1, r2) => r1 !== r2}
                    onMoveEnd={(row) => { this._onRowMoveEnd(row) }}
                    onRowMoved={(e) => { this._onRowMoved(e) }}
                    onRowActive={(row) => {
                        this._onRowActive(row)
                    }}
                    activeOpacity={0.8}
                    moveOnPressIn
                    onMoveCancel={() => this._onRowMoveCancel()}
                />
            </View>
        )
    }
}

// 导出
export default SortableDragList