import React, { Component } from 'React';
import { Svg, Path } from 'react-native-svg';
export default class MineBarSvg extends Component {
    render() {
        let color = "darkgrey"
        if (this.props.selected) {
            color = "white"
        }

        return (
            <Svg t="1550211395365" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="12406" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width} height={this.props.height}>
                <Path fill={color} d="M 1016.83 944.128 c 0 21.504 -17.408 38.912 -38.912 38.912 c -21.504 0 -38.912 -17.408 -38.912 -38.912 v -20.992 c 0 -97.28 -198.144 -235.008 -425.472 -235.008 c -180.736 0 -428.544 115.712 -428.544 230.912 v 25.088 c 0 21.504 -17.408 38.912 -38.912 38.912 s -38.912 -17.408 -38.912 -38.912 v -48.64 c 0 -58.368 86.528 -207.872 322.56 -263.168 c -84.992 -58.368 -141.312 -156.16 -141.312 -267.264 c 0 -178.688 144.896 -323.584 323.584 -323.584 c 178.688 0 323.584 144.896 323.584 323.584 c 0 109.056 -54.272 205.312 -137.216 264.192 c 238.592 53.248 318.464 210.432 318.464 266.24 v 48.64 Z M 757.76 364.544 c 0 -135.68 -110.08 -245.76 -245.76 -245.76 s -245.76 110.08 -245.76 245.76 s 110.08 245.76 245.76 245.76 s 245.76 -110.08 245.76 -245.76 Z" pid="12407">
                </Path>
            </Svg>
        )
    }
}