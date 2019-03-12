import React, { Component } from 'React';
import { Svg, Path } from 'react-native-svg';


// 与账单相关的svg图标

// 收入
export class IncomeSvg extends Component {
    render() {
        let color = this.props.color ? this.props.color : 'white'
        return (
            <Svg t="1552306059229" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="1143" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M986 571.2v-372C986 73.6 732 4.5 493.2 4.5S0 73.6 0 199.2v602.2c0 125.3 254 192.9 492.8 192.9 34.5 0 67.3 0 100.1-4.1 150.5 71.5 330.4 7.5 401.9-143 41.8-88 38.6-190.8-8.8-276zM493.2 58c252.3 0 440.7 74.5 440.7 141.2S745.1 340.3 492.8 340.3s-441-74.5-441-141.1S240.5 58 493.2 58zM51.8 288.6c86.3 69 267.5 103.5 441.1 103.5S847.7 357.6 934 288.6v214.3c-118.3-117.2-309-116.4-426.2 1.8-11.2 11.3-21.6 23.5-30.9 36.5C232.6 538.1 51.8 465.6 51.8 400V288.6z m0 200.8c78.7 61.8 236.4 97 395.5 103.5-18.1 39.3-27.6 82-27.6 125.3v22.1c-214-13.1-367.9-80.1-367.9-139.8V489.4z m441.4 453.2c-252.6 0-441.4-75.2-441.4-141.2V690c75.6 59.4 224.7 94.2 377.6 103.5 14.9 57.3 46.4 108.9 90.4 148.4l-26.6 0.7zM722 967.8c-138.2 0-250.2-112-250.2-250.2s112-250.2 250.2-250.2 250.2 112 250.2 250.2c-0.2 138.1-112.1 250-250.2 250.2z" fill={color} pid="1144">
                </Path>
                <Path d="M747.9 691.7V545c0-14.3-11.6-25.9-25.9-25.9s-25.9 11.6-25.9 25.9v146.7h-147c-14.3 0-25.9 11.6-25.9 25.9s11.6 25.9 25.9 25.9h146.7v146.7c0 14.3 11.6 25.9 25.9 25.9 14.3 0 25.9-11.6 25.9-25.9V743.4h146.7c14.3 0 25.9-11.6 25.9-25.9s-11.6-25.9-25.9-25.9H747.9z" fill={color} pid="1145">
                </Path>
            </Svg>
        )
    }
}

// 支出
export class PaySvg extends Component {
    render() {
        let color = this.props.color ? this.props.color : 'white'
        return (
            <Svg t="1552369316361" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="5154" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M986 571.2v-372C986 73.6 732 4.5 493.2 4.5S0 73.6 0 199.2v602.2c0 125.3 254 192.9 492.8 192.9 34.5 0 67.3 0 100.1-4.1 150.5 71.5 330.4 7.5 401.9-143 41.8-88 38.6-190.8-8.8-276zM493.2 58c252.3 0 440.7 74.5 440.7 141.2S745.1 340.3 492.8 340.3s-441-74.5-441-141.1S240.5 58 493.2 58zM51.8 288.6c86.3 69 267.5 103.5 441.1 103.5S847.7 357.6 934 288.6v214.3c-118.3-117.2-309-116.4-426.2 1.8-11.2 11.3-21.6 23.5-30.9 36.5C232.6 538.1 51.8 465.6 51.8 400V288.6z m0 200.8c78.7 61.8 236.4 97 395.5 103.5-18.1 39.3-27.6 82-27.6 125.3v22.1c-214-13.1-367.9-80.1-367.9-139.8V489.4z m441.4 453.2c-252.6 0-441.4-75.2-441.4-141.2V690c75.6 59.4 224.7 94.2 377.6 103.5 14.9 57.3 46.4 108.9 90.4 148.4l-26.6 0.7zM722 967.8c-138.2 0-250.2-112-250.2-250.2s112-250.2 250.2-250.2 250.2 112 250.2 250.2c-0.2 138.1-112.1 250-250.2 250.2z" fill={color} pid="5155">
                </Path>
                <Path d="M549.1 691.7c-14.3 0-25.9 11.6-25.9 25.9s11.6 25.9 25.9 25.9h345.1c14.3 0 25.9-11.6 25.9-25.9s-11.6-25.9-25.9-25.9H549.1z" fill={color} pid="5156">
                </Path>
            </Svg>
        )
    }
}