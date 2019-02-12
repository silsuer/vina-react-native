import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';


class ButtonRadius extends Component {


    render() {

        let selectButtonBackgroundColor = () => {
            if (this.props.primary) {
                return '#0C66FF'
            }
            if (this.props.success) {
                return '#22C993'
            }
            if (this.props.error) {
                return '#F03D3D'
            }
            if (this.props.alert) {
                return '#FFAD0D'
            }
            if (this.props.color) {
                return this.props.color
            }
            return '#FFF'
        }

        // 根据按钮类别设置按钮内的文字的颜色
        let selectButtonFontColor = () => {
            // if (this.props.primary) {
            //     return '#FFF'
            // }
            // if (this.props.success) {
            //     return '#FFF'
            // }
            // if (this.props.error) {
            //     return '#FFF'
            // }
            // if (this.props.alert) {
            //     return '#FFF'
            // }
            if (this.props.fontColor) {
                return this.props.fontColor
            }
            return '#FFF'
        }

        let styles = StyleSheet.create({
            container: {
                width: 50,
                height: 50,
                backgroundColor: selectButtonBackgroundColor(),
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
            },
            text: {
                color: selectButtonFontColor(),
                fontSize: 25,
            },

        })

        return (
            <TouchableOpacity onPress={this.props.onPress} >

                <View
                    style={styles.container}>
                    <Text style={styles.text}>{this.props.title}</Text>
                </View>

            </TouchableOpacity>
        )
    }
}



export default ButtonRadius;