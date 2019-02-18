// 这里是每个页面的具体框架
import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Config from '../../configs/app';
import Header from './Header/Header'
import FooterView from '../FooterView/FooterView'
class Page extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentBody: this.props.body,
            opacity: new Animated.Value(1)
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
        // console.log(props)
        if (props.body !== this.state.currentBody) {
            // 执行动画
            // 先让旧组件淡出
            this.fadeOutAnimated.start(() => {
                // 替换组件
                this.setState({ currentBody: props.body }, () => {
                    // 新组件淡入
                    this.fadeInAnimated.start()
                })
            })
        }
    }

    render() {

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            header: {
                // flex: 1,
            },
            body: {
                flex: 6,
                marginTop: 10,
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
                <ScrollView>
                    <Animated.View opacity={this.state.opacity} style={styles.body}>
                        {this.state.currentBody}
                    </Animated.View>
                </ScrollView>
                <FooterView tabBarOptions={this.props.tabBarOptions} />
            </LinearGradient>

        )
    }
}


export default Page