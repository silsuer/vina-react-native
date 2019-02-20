// 富文本编辑器部分
import React, { Component } from 'react'
import { View, Text, Dimensions, ScrollView, PanResponder, LayoutAnimation, Alert } from 'react-native'
import { CardContainer, CardHeader } from '../common/CardContainer'
import { RichTextEditor } from 'react-native-zss-rich-text-editor';
import RichTextToolbar from '../RichText/RichTextEditorToolBar'
import { RichTextEditorSvg } from '../assets/svgs/Common'
import { ToolBarSvg } from '../assets/svgs/RichTextEditor'
import ButtonRadius from '../common/ButtonRadius/ButtonRadius'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height
export default class RichTextEditorContainer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            top: 60,
            right: 20,
            toolBarOpen: false,  // 默认关闭,
            toolBarButtonDiameter: 65,
            toolBarMode: 'sub',  // 默认toolbar子栏是在主栏下方
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                // 开始的时候不设置pan，移动的时候才设置
                return false
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // 如果工具栏打开，禁止移动
                // 如果触摸点在button内部，则true，否则false
                // 只需要判断width即可
                // console.log("PageX", evt.nativeEvent.pageX)
                // console.log("左侧:", windowWidth - this.state.right - this.state.toolBarButtonDiameter)
                // console.log("右侧:", windowWidth - this.state.right)
                if ((evt.nativeEvent.pageX > (windowWidth - this.state.right - this.state.toolBarButtonDiameter)) && (evt.nativeEvent.pageX < (windowWidth - this.state.right))) {
                    return true
                } else {
                    return false
                }
                // return this.state.toolBarOpen ? false : true
            },
            onPanResponderGrant: (evt, gs) => {
                // 申请成功
                this._top = this.state.top
                this._right = this.state.right
            },
            onPanResponderMove: (evt, gs) => {
                // this.setState({
                //     top: this._top + gs.dy,
                //     right: this._right - gs.dx
                // })
                // 如果移动的靠上或者靠下，修改mode
                if (evt.nativeEvent.pageY < (windowHeight / 2)) {
                    this.setState({
                        top: this._top + gs.dy,
                        right: this._right - gs.dx,
                        toolBarMode: "sub",
                    })
                } else {
                    // 此时应该是bottom和right，计算
                    this.setState({
                        top: this._top + gs.dy,
                        right: this._right - gs.dx,
                        toolBarMode: "sup",
                    })
                }

            },
            onPanResponderRelease: (evt, gs) => {

                // 当移动距离不超过3时，判断是点击事件
                if (gs.dy < 3 && gs.dx < 3) {
                    this._buttonOnPress()
                    return
                }
                LayoutAnimation.spring()
                this.setState({
                    top: this._top + gs.dy,  // 松开手指时，高度不变，让图标重新回到屏幕右侧
                    right: this._right,
                })

            }
        })


    }

    _buttonOnPress() {
        LayoutAnimation.spring()
        this.setState({ toolBarOpen: !this.state.toolBarOpen })
    }

    componentWillReceiveProps() {

    }

    render() {




        return (
            <CardContainer>
                <CardHeader icon={<RichTextEditorSvg color="black" width="20" height="20" />} title="富文本编辑器" extra={[]} />
                <ScrollView>
                    <View style={{ height: windowHeight * 0.8, borderRadius: 15, padding: 10 }}>
                        <RichTextEditor style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                        }}
                            ref={(r) => { this.richText = r }}
                        />


                    </View>
                </ScrollView>


                <View
                    {...this._panResponder.panHandlers}
                    style={{
                        position: 'absolute',
                        top: this.state.top,
                        // left: this.state.left,
                        right: this.state.right,
                    }}
                >
                    <RichTextToolbar
                        mode={this.state.toolBarMode}
                        backgroundColor="#1e2941"
                        getEditor={() => this.richText}
                        open={this.state.toolBarOpen}
                        button={
                            < ButtonRadius
                                diameter={this.state.toolBarButtonDiameter}
                                color="#1e2941"
                                title={<ToolBarSvg width="20" height="20" />}
                                onPress={this._buttonOnPress.bind(this)}
                            />}
                    />

                </View>
            </CardContainer >
        )
    }
}


