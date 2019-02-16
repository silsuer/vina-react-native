import React, { Component } from 'React';
import { Svg, Path } from 'react-native-svg';
export default class BottomNavigation extends Component {
    render() {
        let color = "darkgrey"
        if (this.props.selected) {
            color = "black"
        }
        return (
            <Svg t="1550315967545" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="7352" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 20} height={this.props.height ? this.props.height : 20}>
                <Path d="M873.96864 188.12416H150.02624c-26.30144 0-47.62624 21.32992-47.62624 47.63136v19.05152c0 26.30144 21.3248 47.63136 47.62624 47.63136h723.94752a47.63648 47.63648 0 0 0 47.63136-47.63136v-19.05152a47.62624 47.62624 0 0 0-47.62112-47.63136h-0.01536z m0 266.71104H150.02624A47.63136 47.63136 0 0 0 102.4 502.46656v19.05664a47.62624 47.62624 0 0 0 47.62624 47.62624h723.94752c26.30144 0 47.63136-21.3248 47.63136-47.62624v-19.05664c0.00512-26.30144-21.31968-47.62624-47.62112-47.62624h-0.01536z m0 266.73152H150.02624c-26.30144 0-47.62624 21.32992-47.62624 47.62624v19.06176c0 26.29632 21.3248 47.62624 47.62624 47.62624h723.94752c26.30144 0 47.63136-21.31968 47.63136-47.62624v-19.06176a47.616 47.616 0 0 0-47.62112-47.62624h-0.01536z" pid="7353" fill="#f5f5f5">
                </Path>
            </Svg>
        )
    }
}