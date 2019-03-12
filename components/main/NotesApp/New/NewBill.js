
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, FlatList } from 'react-native'
import { Provider, List, TextareaItem, Toast } from '@ant-design/react-native'
import Page from '../../../common/Page'
import { CardContainer, CardBody, CardHeader, CardList, CardListItem, CardBottom } from '../../../common/CardContainer'
import { CloseSvg, DetermineSvg, RightSvg, CircleSaveSvg } from '../../../assets/svgs/Common'
import { IncomeSvg, PaySvg } from '../../../assets/svgs/BillSvg'
import Keyboard from 'react-native-keyboard'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

// 新建账单
export default class NewBill extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'pay',  // pay是支出 income是收入
            inputFocus: true,  // 如果input获得了焦点，则显示数字键盘（只有当备注获取焦点的时候，才会隐藏数字键盘）
            keys: [],       // 键入的数据
            categories: ['j', 'jj']  // 分类列表
        }
    }


    // 渲染分类列表
    renderCategories() {
        let list = this.state.categories
        list.push({ // 添加分类
            type: 'add'
        })

        return list.map((data, index) => {
            // 获取图标
            // 分类表：id name 分类名 icon 分类对应的图标
            return (
                <View key={index}>
                    <Text>{data.name}</Text>
                </View>
            )
        })
    }

    render() {

        const styles = StyleSheet.create({
            inputContainer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            },
            inputIcon: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            },
            inputTextView: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            },
            inputText: {
                fontSize: 45,
                fontWeight: 'bold'
            },
        })

        const getBody = () => {

            const getIcon = () => {
                if (this.state.type === 'pay') {
                    return (
                        <PaySvg color="#d4d4d4" width="60" height="90" />
                    )
                }
                return (
                    <IncomeSvg color="#d4d4d4" width="60" height="90" />
                )
            }

            const getTitle = () => {
                if (this.state.type === 'income') {
                    return '收入账单'
                } else {
                    return '支出账单'
                }
            }

            const getPriceText = () => {
                if (this.state.keys.length === 0) {
                    return <Text style={[{
                        color: "#d4d4d4"
                    }, styles.inputText]}>￥</Text>
                } else {
                    return (
                        <Text style={styles.inputText}>{this.state.keys.join('')}</Text>
                    )
                }
            }

            return (
                <View>
                    <CardContainer>
                        <CardHeader
                            icon={<TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                                <CloseSvg color="#1e294199" width="17" height="17" />
                            </TouchableOpacity>}
                            title={this.props.navigation.getParam('id') ? getTitle() : '新建' + getTitle()}
                            extra={[<TouchableOpacity >
                                <DetermineSvg color="#1e294199" width="17" height="17" />
                            </TouchableOpacity>]}
                        />
                        <CardBody>
                            <CardList>
                                {/* 输入框，输入收支情况 */}
                                <View style={styles.inputContainer}>
                                    {/* 收入/支出 图标 */}
                                    <View style={styles.inputIcon}>
                                        <TouchableOpacity onPress={() => {
                                            if (this.state.type === 'pay') {
                                                this.setState({ type: 'income' })
                                            } else {
                                                this.setState({ type: 'pay' })
                                            }
                                        }}>
                                            {getIcon()}

                                        </TouchableOpacity>
                                    </View>
                                    {/* 收支输入框 */}
                                    <View style={styles.inputTextView}>
                                        {getPriceText()}

                                    </View>
                                </View>
                                <View >
                                    <List>
                                        <View style={{ height: 60, justifyContent: 'center', paddingLeft: 20 }}>
                                            <TouchableOpacity onPress={() => Alert.alert("123")}>
                                                <Text style={{ fontSize: 17 }}>分类</Text>
                                                <View style={{ position: 'absolute', right: 10 }}>
                                                    <RightSvg color="#d4d4d4" width="16" height="16" />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        {/* 分类列表，一个横向的FlatList */}
                                        <View>
                                            <FlatList
                                                horizontal
                                                data={this.state.categories}
                                                renderItem={this.renderCategories.bind(this)}
                                                extraData={this.state}
                                            />
                                        </View>
                                        <View style={{ width: windowWidth * 0.8, backgroundColor: '#d4d4d4dd', height: 0.4 }}></View>
                                        <View style={{ padding: 5 }}>
                                            <TextareaItem
                                                onFocus={() => {
                                                    this.setState({ inputFocus: false })
                                                }}
                                                onBlur={() => {
                                                    this.setState({ inputFocus: true })
                                                }}
                                                last style={{ fontSize: 15 }} autoHeight placeholder="备注"></TextareaItem>
                                        </View>
                                    </List>
                                </View>
                            </CardList>
                        </CardBody>
                        <CardBottom color="#f2f3f5" >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 12,
                            }}>
                                <CircleSaveSvg color="#007bff" width="17" height="17" />
                                <Text style={{
                                    color: "#007bff",
                                    fontSize: 14,
                                    marginLeft: 5,
                                    fontWeight: 'bold',
                                }}>保存</Text>
                            </View>
                        </CardBottom>
                    </CardContainer>

                </View>
            )
        }

        return (
            <Provider>
                <Page
                    noScrollView
                    title={false}
                    left={[]}
                    right={[]}
                    tabBarOptions={[]}
                    body={getBody()}
                />


                <View style={{ marginBottom: 20, position: 'absolute', bottom: 0, left: 0, width: windowWidth }}>
                    <Keyboard
                        keyboardType="decimal-pad"
                        onClear={() => {
                            // 清空输入
                            this.setState({ keys: [] })
                        }}
                        onDelete={() => {
                            let keys = this.state.keys
                            keys.pop()
                            this.setState({ keys: keys })
                        }}
                        onKeyPress={(key) => {
                            // 输入数字
                            let keys = this.state.keys
                            // 验证
                            // 判断是否存在小数点，以及小数点后有几位
                            let flag = false // 默认不存在小数点
                            let n = 0 // 现在是小数点后几位？
                            for (let i = 0; i < keys.length; i++) {
                                if (keys[i] == ".") {
                                    flag = true
                                }
                                if (flag === true && keys[i] !== ".") {
                                    n += 1
                                }
                            }

                            if (flag == true) {
                                if (key === ".") {
                                    // Toast.info("格式无效")
                                    return
                                }
                                if (n >= 2) {
                                    return
                                }
                            } else {

                            }

                            // 放入数据中
                            keys.push(key)
                            this.setState({ keys: keys })
                        }}
                    />
                </View>
            </Provider>
        )
    }
}