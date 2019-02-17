// 这里是每个页面的具体框架
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Config from '../../configs/app';
import Header from './Header/Header'
import FooterView from '../FooterView/FooterView'
class Page extends Component {
    render() {

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            header: {
                flex: 1,
            },
            body: {
                flex: 6,
            },
            footer: {
                position: 'absolute',
                bottom: 0,
            }
        });

        return (
            <LinearGradient locations={[0.2, 1]} colors={[Config.mainColor, Config.finishColor]} style={styles.container} >
                <View style={styles.header}>
                    <Header title={this.props.title} fontColor={Config.headerFontColor} left={this.props.left} right={this.props.right} avatar={require('../assets/images/default_avatar.jpg')} />
                </View>
                <FooterView tabBarOptions={this.props.tabBarOptions} />
            </LinearGradient>
        )
    }
}


export default Page