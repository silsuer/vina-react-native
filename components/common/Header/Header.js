import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height
export default class Header extends Component {
    render() {

        let styles = StyleSheet.create({
            container: {
                width: windowWidth,
                height: 90,
                backgroundColor: 'white',
                display:'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            title: {
                fontSize: 18,
                marginBottom:10,
            }
        })

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        )
    }
}