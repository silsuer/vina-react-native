/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, DeviceEventEmitter, Animated, Easing } from 'react-native';
import FooterView from './components/FooterView/FooterView';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import TomatoTimer from './components/common/TomatoTimer/TomatoTimer'
import HomeButton from './components/main/HomeButton/HomeButtom'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height


class App extends Component {

  // static navigationOptions = {
  //   tabBarLabel: 'Home!',
  // };
  constructor(props) {
    super(props)
    this.proportion = 0.65
    this.state = {
      currentViewHeight: new Animated.Value(windowHeight),
      currentViewWidth: new Animated.Value(windowWidth),
    }

    this.narrowCurrentViewHeight = Animated.timing(
      this.state.currentViewHeight,
      {
        toValue: windowHeight * this.proportion,
        duration: 200,
        easing: Easing.linear
      }
    )

    this.narrowCurrentViewWidth = Animated.timing(
      this.state.currentViewWidth,
      {
        toValue: windowWidth * this.proportion,
        duration: 200,
        easing: Easing.linear
      }
    )

    this.reductionCurrentViewHeight = Animated.timing(
      this.state.currentViewHeight,
      {
        toValue: windowHeight,
        duration: 200,
        easing: Easing.linear
      }
    )

    this.reductionCurrentViewWidth = Animated.timing(
      this.state.currentViewWidth,
      {
        toValue: windowWidth,
        duration: 200,
        easing: Easing.linear
      }
    )
  }

  // 挂载监听事件
  componentDidMount() {
    this.narrowCurrentViewListener = DeviceEventEmitter.addListener("narrowCurrentView", () => {
      this.narrowCurrentViewHeight.start()
      this.narrowCurrentViewWidth.start()
    })

    this.reductionCurrentViewListener = DeviceEventEmitter.addListener("reductionCurrentView", () => {
      this.reductionCurrentViewHeight.start()
      this.reductionCurrentViewWidth.start()
    })
  }

  // 组件销毁时移除事件
  componentWillUnmount() {
    this.narrowCurrentViewListener.remove()
  }


  render() {

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#bed4e9',
      },
      pageView: {

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
      <View style={styles.container}>

        {/* pageView是一个view，当拖拽home得时候，pageView会等比缩放 */}
        <Animated.View style={{
          backgroundColor: '#f5f5f5',
          shadowColor: 'blue',
          shadowOffset: {
            width: 5,
            height: 5,
          },
          shadowOpacity: 0.2,
          width: this.state.currentViewWidth,
          height: this.state.currentViewHeight,
          borderRadius: 15
        }}>
          {/* header */}
          <View style={styles.header}>
            {/* <Text>title</Text> */}
          </View>
          {/* body */}
          <View style={styles.body}>
            <Text>body</Text>
          </View>

        </Animated.View>
        {/* footer */}
        <View style={styles.footer}>
          <FooterView />
        </View>

      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: App,
    navigationOptions: {
      header: null
    }
  },
  TomatoTimer: {
    screen: TomatoTimer,
    navigationOptions: {
      header: null
    }
  },
})



export default createAppContainer(AppNavigator)