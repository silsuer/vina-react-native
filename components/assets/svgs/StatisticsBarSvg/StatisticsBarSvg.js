import React, { Component } from 'React';
import { Svg, Path } from 'react-native-svg';
export default class StatisticsBarSvg extends Component {
    render() {
        let color = "darkgrey"
        if (this.props.selected) {
            color = "grey"
        }
        return (
            <Svg t="1550211353629" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="8701" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width} height={this.props.height}>
                <Path fill={color} d="M179.2 716.8a25.6 25.6 0 0 1 25.6 25.6v102.4a25.6 25.6 0 1 1-51.2 0v-102.4a25.6 25.6 0 0 1 25.6-25.6z m204.8-102.4a25.6 25.6 0 0 1 25.6 25.6v204.8a25.6 25.6 0 1 1-51.2 0v-204.8a25.6 25.6 0 0 1 25.6-25.6z m204.8-102.4a25.6 25.6 0 0 1 25.6 25.6v307.2a25.6 25.6 0 1 1-51.2 0v-307.2a25.6 25.6 0 0 1 25.6-25.6z m204.8-102.4a25.6 25.6 0 0 1 25.6 25.6v409.6a25.6 25.6 0 1 1-51.2 0v-409.6a25.6 25.6 0 0 1 25.6-25.6zM424.6016 334.592L179.5072 514.048a25.6 25.6 0 0 1-30.208-41.3184l263.7824-193.1264a25.6 25.6 0 0 1 34.1504 3.584l87.9616 97.8944 235.0592-175.1552a25.6 25.6 0 1 1 30.6176 41.0624l-253.7984 189.0816a25.6 25.6 0 0 1-34.304-3.3792L424.6016 334.592z" pid="8702" >
                </Path>
            </Svg>
        )
    }
}