// 这里是每个页面的具体框架
import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated, ScrollView, LayoutAnimation, DeviceEventEmitter } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Config from '../../configs/app';
import Header from './Header/Header'
import FooterView from '../FooterView/FooterView'
class Page extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentBody: this.props.body,
            opacity: new Animated.Value(1),
            showModal: false,
            modalComponent: null,
        }

        this.fadeOutAnimated = Animated.timing(
            this.state.opacity,
            {
                toValue: 0,
                duration: 200,
            }
        )

        this.fadeInAnimated = Animated.timing(
            this.state.opacity,
            {
                toValue: 1,
                duration: 300,
            }
        )
    }


    componentWillReceiveProps(props) {
        if (props.body !== this.state.currentBody) {
            LayoutAnimation.easeInEaseOut()
            this.setState({ currentBody: props.body })
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            header: {
            },
            body: {
                flex: 6,
                marginTop: 10,
            },
            footer: {
                position: 'absolute',
                bottom: 0,
            },
        });

        return (
            <LinearGradient locations={[0.2, 1]} colors={[Config.mainColor, Config.finishColor]} style={styles.container} >
                <View style={styles.header}>
                    <Header title={this.props.title} fontColor={Config.headerFontColor} left={this.props.left} right={this.props.right} avatar={require('../assets/images/default_avatar.jpg')} />
                </View>
                <ScrollView>
                    <Animated.View opacity={this.state.opacity} style={styles.body}>
                        {this.state.currentBody}
                    </Animated.View>
                </ScrollView>
                <FooterView tabBarOptions={this.props.tabBarOptions} />

                {/* 留存dropList的所有 */}
                <View>
                    {this.props.children}
                </View>
            </LinearGradient>
        )
    }
}


export default Page