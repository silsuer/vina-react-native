// 这是一个可拖动排序的组件，当拖动的菜单折叠的时候，可像文件夹一样，变为二级菜单

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native'
// import SortableList from 'react-native-sortable-list'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { List } from '@ant-design/react-native'
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
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10 * item.layerNumber,
                    height: 40,
                }} >
                    <Target width="10" height="10" color={item.color || '#000'} />
                    <Text style={{ marginLeft: 7 }} >{item.name}</Text>
                    <View style={{ position: 'absolute', right: 20 }}>
                        <TouchableOpacity {...this.props.sortHandlers}>
                            <SequenceSvg color="darkgrey" width="20" height="15" />
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
            order: []
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

    // 开启定时器
    startTimer(row) {
        console.log(row)
    }

    // 当开始拖拽排序时调用
    _onRowActive(row) {
        // 开启一个定时器，判断当前行的位置，和其他所有行得位置
        this.startTimer(row.rowData.data)
    }

    // 当结束拖拽排序时调用
    _onRowMoveEnd(row) {
        // 清除定时器
        this.clearTimer()
        let order = this.state.order
        order.splice(e.to, 0, order.splice(e.from, 1)[0])
        this.setState({ order: order })
    }



    render() {
        // 先渲染数据
        return (
            <SortableListView
                style={{ flex: 1 }}
                data={this.state.list}
                order={this.state.order}
                renderRow={row => <RowComponent data={row} />}
                onRowMoved={this._onRowMoveEnd}
                onRowActive={this._onRowActive}
                activeOpacity={0.8}
                moveOnPressIn
            />
        )
    }
}

// 导出
export default SortableDragList