import React, { Component } from 'react'
import { View, ScrollView, Dimensions, DeviceEventEmitter } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView, DrawerItems } from 'react-navigation'
const mainWindow = Dimensions.get('window')
const windowHeight = mainWindow.height
import Config from '../../configs/app'
import { SlideAvatar } from '../common/SlideIcons'

export default class DrawerContentComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            colors: [Config.mainColor, Config.finishColor]
        }
    }

    componentDidMount() {
        this.changeColorListener = DeviceEventEmitter.addListener("change-drawer-colors", (mode) => {
            let colors = [Config.mainColor, Config.finishColor]
            switch (mode) {
                case 'work':
                    colors = [Config.WorkTimerStartColor, Config.WorkTimerEndColor]
                    break
                case 'rest':
                    colors = [Config.RestTimerStartColor, Config.RestTimerEndColor]
                    break
                default:
                    break
            }
            this.setState({ colors: colors })
        })
    }

    componentWillUnmount() {
        this.changeColorListener.remove()
    }

    render() {
        return (
            <LinearGradient locations={[0.2, 1]} colors={this.state.colors} >
                <ScrollView>
                    <SafeAreaView style={{ height: windowHeight }} forceInset={{ top: 'always', horizontal: 'never' }}>
                        <View style={{ margin: 10 }}>
                            <SlideAvatar />
                        </View>
                        <DrawerItems  {...this.props} />
                    </SafeAreaView>
                </ScrollView>
            </LinearGradient>
        )
    }
}