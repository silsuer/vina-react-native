import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height
class Header extends Component {
    render() {

        let styles = StyleSheet.create({
            container: {
                width: windowWidth,
                height: 90,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundColor:'#1e2941',
            },
            main: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            title: {
                fontSize: 18,
                marginBottom: 10,
                color: this.props.fontColor ? this.props.fontColor : '#000',
                marginLeft: 10,
                marginTop: 10,
            },
            avatar: {
                width: 40,
                height: 40,
                borderRadius: 20,
                marginLeft: 20,
            }
        })

        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}>
                        <Image style={styles.avatar} source={this.props.avatar} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
            </View>
        )
    }
}

export default withNavigation(Header)