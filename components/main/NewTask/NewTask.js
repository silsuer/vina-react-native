import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'

const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        backgroundColor:'#f5f5f5',
    }
})

class NewTask extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>新建任务页面</Text>
            </View>
        )
    }
}

export default NewTask