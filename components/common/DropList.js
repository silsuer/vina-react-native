import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import { Modal, Provider } from '@ant-design/react-native'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height
export default class DropList extends Component {
    constructor(props) {
        super(props)
    }

    generateDropListRender() {
        // 遍历传入的list，生成list
        return this.props.list.map((box, index) => {
            return (
                <View key={index}>
                    {box}
                </View>
            )
        })
    }

    _onPress() {
        // 通过事件，把组件传递出去
        DeviceEventEmitter.emit("pageShowModal", this.props.dropName)

    }
    render() {
        let styles = StyleSheet.create({
            container: {

            },
            droplist: {
                position: 'absolute',
                width: 50,
                height: 50,
                bottom: -50,
                left: -50,
                zIndex: 9,
            }
        })
        return (

            <View style={styles.container}>
                <Provider>
                    {/* 这里是可点击的icon */}
                    <TouchableOpacity onPress={this._onPress.bind(this)}>
                        <View style={styles.icon}>
                            {this.props.icon}
                        </View>
                    </TouchableOpacity>
                </Provider>
            </View>
        )
    }
}