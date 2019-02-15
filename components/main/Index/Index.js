import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { StackNavigator, TabBarBottom, createBottomTabNavigator, createAppContainer } from 'react-navigation'
import NewTask from '../NewTask/NewTask'
import TomatoTimer from '../../common/TomatoTimer/TomatoTimer'
// 首页组件
class Index extends Component {
    static navigationOptions = {
        tabBarLabel: '首页'
    }

    // 在这个组件里加一个底部导航栏
    render() {
        return (
            <View>
                <Text>哈哈哈哈</Text>
            </View>
        )
    }
}
export default Index

// const TabNavigator = createBottomTabNavigator({
//     Home: Index,
//     task: NewTask,
//     timer: TomatoTimer
// })

// export default createAppContainer(TabNavigator)
