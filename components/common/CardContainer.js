import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { Target } from '../assets/svgs/NotesSvg'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

const borderRadiusSize = 5
export class CardHeader extends Component {
    constructor(props) {
        super(props)
        this.styles = StyleSheet.create({
            container: {
                height: 47,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#f2f3f5',
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 10,
                borderTopLeftRadius: borderRadiusSize,
                borderTopRightRadius: borderRadiusSize,
            },
            icon: {
                marginRight: 10,

            },
            titleArea: {

            },
            title: {
                fontSize: 14,
                fontWeight: 'bold',
            },
            left: {
                display: 'flex',
                flexDirection: 'row',
                // justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            },
            right: {
                flex: 2,
                display: 'flex',
                flexDirection: 'row-reverse',

            },
            extra: {
                marginRight: 10,
            }
        })
    }
    generateExtraRender() {
        return this.props.extra.map((el, index) => {
            return (
                <View style={this.styles.extra} key={index}>
                    {el}
                </View>
            )
        })
    }
    render() {

        return (
            <View style={this.styles.container}>
                <View style={this.styles.left}>
                    {this.props.icon ? <View style={this.styles.icon}>
                        {this.props.icon}
                    </View> : <View></View>}
                    <View style={this.styles.titleArea}>
                        <Text style={this.styles.title}>{this.props.title}</Text>
                    </View>
                </View>
                <View style={this.styles.right}>
                    {this.generateExtraRender()}
                </View>
            </View>
        )
    }
}

export class CardBody extends Component {
    render() {
        return (
            <View>
                {this.props.children}
            </View>
        )
    }
}


export class CardList extends Component {
    render() {
        let styles = StyleSheet.create({
            container: {
                borderRadius: borderRadiusSize,
            }
        })
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        )
    }
}


export class CardListItem extends Component {

    // 渲染上方右侧组件
    generateHeaderExtraRender() {
        return this.props.headerExtra.map((el, index) => {
            return (
                <View key={index}>
                    {el}
                </View>
            )
        })
    }

    // 渲染下方右侧组件
    generateContentExtraRender() {
        return this.props.contentExtra.map((el, index) => {
            return (
                <View key={index}>
                    {el}
                </View>
            )
        })
    }
    render() {
        let styles = StyleSheet.create({
            container: {
                backgroundColor: '#ffffff',
                height: 90,
                borderBottomLeftRadius: borderRadiusSize,
                borderBottomRightRadius: borderRadiusSize,
                display: 'flex',
                alignItems:'center',
            },
            header: {
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
            },
            headerIcon: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            headerTitle: {
                flex: 5,
                justifyContent: 'center',
            },
            headerTitleText: {
                fontWeight: 'bold',
            },
            headerExtra: {
                flex: 2,
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 10,
            },
            content: {
                flex: 1.5,
                display: 'flex',
                flexDirection: 'row',
            },
            contentDetail: {
                flex: 5,
                paddingTop: 0,
                paddingBottom: 2,
            },
            bottom: {
                borderBottomWidth: 0.3,
                borderBottomColor: '#d4d4d4',
                width: windowWidth * 0.7,
            }
        })
        return (
            <View style={styles.container}>
                {/* 上 */}
                <View style={styles.header}>
                    {/* 标记 */}
                    <View style={styles.headerIcon}><Target color={this.props.icon} width="10" height="10" /></View>
                    {/* 上左 */}
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerTitleText}>{this.props.title}</Text>
                    </View>
                    {/* 上右 */}
                    <View style={styles.headerExtra}>
                        {this.generateHeaderExtraRender()}
                    </View>
                </View>
                {/* 下 */}
                <View style={styles.content}>
                    {/* 下方标记 */}
                    <View style={styles.headerIcon}>

                    </View>
                    {/* 内容 */}
                    <View style={styles.contentDetail}>
                        <Text>{this.props.content}</Text>
                    </View>
                    {/* 下右（图片） */}
                    <View style={styles.headerExtra}>
                        {this.generateContentExtraRender()}
                    </View>
                </View>
                <View style={styles.bottom}>

                </View>
            </View>
        )
    }
}


export class CardContainer extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let styles = StyleSheet.create({
            container: {
                width: this.props.width ? this.props.width : windowWidth * 0.95,
                backgroundColor: 'white',
                borderRadius: 5,
                marginBottom: 10,
            }
        })

        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        )
    }
}

