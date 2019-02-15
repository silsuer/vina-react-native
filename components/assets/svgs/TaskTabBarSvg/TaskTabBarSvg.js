import React, { Component } from 'React';
import { Svg, Path } from 'react-native-svg';
export default class TaskTabBarSvg extends Component {
    render() {
        let color = "darkgrey"
        if (this.props.selected) {
            color = "grey"
        }
        return (
            <Svg t="1550211340357" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="7850" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width} height={this.props.height}>
                <Path fill={color} d="M407.24 938.46L88.36 386.14 613.42 83l4.58 7.84 314.3 544.48zM113.09 392.77l300.78 521 493.7-285-300.78-521z" fill="#d4d4d4" pid="7851">
                </Path>
                <Path fill={color} d="M407.24 938.46L88.36 386.14 613.42 83 776.6 365.63a132.45 132.45 0 0 1 13.93 34.59c5.6 22.66 16.16 66.89 24.06 108.48 13.28 69.93 11 89.31 8.17 97.8l-8.58-2.88 8.58 2.88C813.55 634 732 722.18 684.23 772.33a132.66 132.66 0 0 1-29.71 23.36zM113.09 392.77l300.78 521L645.47 780a114 114 0 0 0 25.65-20.17c77.21-81 128.74-142 134.48-159.1 5.61-16.71-6.9-91.88-32.64-196.18a114.44 114.44 0 0 0-12-29.87l-154.13-267z" pid="7852">
                </Path>
                <Path fill={color} d="M154 499.76L88.36 386.14 613.42 83 679 196.61z m-40.87-107L160.58 475l493.71-285-47.5-82.26zM276.664 533.242l365.948-211.28 9.05 15.675-365.948 211.28zM323.133 613.734l365.948-211.28 9.05 15.675-365.948 211.28zM375.812 704.969l201.074-116.09 9.05 15.675-201.074 116.09z" pid="7853">
                </Path>
            </Svg>
        )
    }
}