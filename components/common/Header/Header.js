import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation'
import Config from '../../../configs/app'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height
class Header extends Component {

    // 生成左侧渲染
    generateLeftRender() {
        // console.log(this.props.left.length)
        // console.log(this.props)
        if (this.props.left && this.props.left.length > 0) {
            return this.props.left.map((option, index) => {
                return (
                    <TouchableOpacity key={index} onPress={option.props.onPress ? option.props.onPress.bind(this) : null}>
                        {option}
                    </TouchableOpacity>
                )
            })
        } else {
            return null
        }

    }

    generateRightRender() {
        if (this.props.right && this.props.right.length > 0) {
            return this.props.right.map((option, index) => {
                return (
                    <TouchableOpacity style={{ marginRight: 13 }} key={index} onPress={option.props.onPress ? option.props.onPress.bind(this) : null}>
                        {option}
                    </TouchableOpacity>
                )
            })
        } else {
            return null
        }
    }

    render() {

        let styles = StyleSheet.create({
            container: {
                width: windowWidth,
                height: Config.PageHeaderHeight,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundColor: '#1e2941',
            },
            main: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: 15,
            },
            title: {
                fontSize: 18,
                marginBottom: 10,
                color: this.props.fontColor ? this.props.fontColor : '#000',
                marginLeft: 10,
                marginTop: 10,
                fontWeight: 'bold',
            },
            avatar: {
                width: 40,
                height: 40,
                borderRadius: 20,
                marginLeft: 20,
            },
            rightIcon: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flex: 2,
                paddingRight: 15,
            },
            leftIcon: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flex: 3,
            }
        })

        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <View style={styles.leftIcon}>
                        {this.generateLeftRender()}
                        <Text style={styles.title}>{this.props.title}</Text>
                    </View>
                    <View style={styles.rightIcon}>
                        {this.generateRightRender()}
                    </View>
                </View>

            </View>
        )
    }
}

export default withNavigation(Header)