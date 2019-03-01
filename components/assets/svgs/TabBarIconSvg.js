// 所有tabBar可能用到的图标
import React, { Component } from 'React';
import { Svg, Path } from 'react-native-svg';
export class IndexSvg extends Component {
    render() {
        let color = "white"
        if (this.props.selected) {
            color = "white"
        }
        return (
            <Svg t="1551453623764" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="3759" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M869.9904 421.2736c-25.6-44.2368-48.9472-92.5696-46.8992-145.8176 0.6144-14.9504-4.3008-28.672-14.1312-38.7072-16.5888-17.2032-45.056-20.6848-68.1984-7.7824-39.5264 21.9136-68.1984 55.296-85.1968 99.1232-1.8432 4.9152-3.6864 9.8304-5.3248 14.7456-27.4432-72.0896-34.816-151.3472-23.3472-247.808 3.072-25.1904-1.4336-44.6464-12.9024-57.5488-15.5648-17.408-41.984-20.2752-73.3184-6.7584-114.8928 49.152-190.0544 139.0592-223.6416 267.4688-12.9024 49.152-16.1792 106.0864-15.5648 156.0576-9.0112-20.6848-17.6128-42.3936-26.0096-64.7168-6.7584-18.0224-16.9984-45.4656-50.176-48.9472-2.2528-0.2048-4.5056-0.4096-6.7584-0.4096-31.3344 0-45.056 24.576-54.0672 40.7552-19.8656 35.84-36.2496 76.8-48.3328 121.2416-45.8752 168.3456-5.12 306.9952 121.0368 412.0576C309.248 974.2336 395.4688 1003.52 500.5312 1003.52c21.7088 0 44.4416-1.2288 67.584-3.8912 133.9392-14.5408 250.0608-94.8224 310.8864-214.8352 58.7776-116.3264 55.5008-252.1088-9.0112-363.52z m-334.4384-72.704c10.6496 34.6112 24.9856 65.7408 41.5744 90.3168 10.0352 14.9504 41.3696 50.176 54.0672 61.8496 43.008 39.7312 57.1392 28.672 62.464 24.3712 4.9152-3.8912 6.3488-9.4208 6.9632-12.0832l10.8544-34.2016c5.5296-17.2032 10.8544-34.4064 16.5888-51.4048l4.5056-13.5168c2.2528-6.9632 4.5056-14.1312 7.168-21.0944 4.5056 26.0096 10.6496 46.4896 26.624 74.3424 60.0064 104.448 67.7888 178.7904 27.4432 256.6144-46.6944 90.112-134.9632 150.528-235.7248 161.3824-110.3872 11.8784-193.9456-8.8064-260.7104-64.512-64.9216-54.0672-85.8112-105.6768-82.944-204.1856l0.4096-15.5648c0.4096-21.7088 0.8192-36.0448 5.12-63.0784 0.8192-4.5056 1.2288-8.8064 1.8432-12.6976 3.2768 7.168 6.9632 14.1312 10.4448 21.0944 11.6736 22.7328 24.576 44.032 38.0928 63.6928 30.5152 44.2368 48.9472 66.3552 81.3056 98.5088l5.3248 5.7344c6.144 6.5536 13.1072 14.1312 23.9616 20.8896l24.3712 15.36 2.048-235.9296c1.8432-18.0224 3.072-36.4544 4.3008-55.0912 2.8672-45.056 5.9392-91.5456 18.432-138.0352 26.0096-97.0752 37.0688-106.9056 82.5344-147.456l7.168-5.7344c-8.3968 60.2112-3.072 119.6032 15.7696 180.4288z" pid="3760" fill={color}>
                </Path>
            </Svg>
        )
    }
}

export class MineBarSvg extends Component {
    render() {
        let color = "white"
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

export class StatisticsBarSvg extends Component {
    render() {
        let color = "white"
        if (this.props.selected) {
            color = "white"
        }
        return (
            <Svg t="1550211353629" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="8701" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width} height={this.props.height}>
                <Path fill={color} d="M179.2 716.8a25.6 25.6 0 0 1 25.6 25.6v102.4a25.6 25.6 0 1 1-51.2 0v-102.4a25.6 25.6 0 0 1 25.6-25.6z m204.8-102.4a25.6 25.6 0 0 1 25.6 25.6v204.8a25.6 25.6 0 1 1-51.2 0v-204.8a25.6 25.6 0 0 1 25.6-25.6z m204.8-102.4a25.6 25.6 0 0 1 25.6 25.6v307.2a25.6 25.6 0 1 1-51.2 0v-307.2a25.6 25.6 0 0 1 25.6-25.6z m204.8-102.4a25.6 25.6 0 0 1 25.6 25.6v409.6a25.6 25.6 0 1 1-51.2 0v-409.6a25.6 25.6 0 0 1 25.6-25.6zM424.6016 334.592L179.5072 514.048a25.6 25.6 0 0 1-30.208-41.3184l263.7824-193.1264a25.6 25.6 0 0 1 34.1504 3.584l87.9616 97.8944 235.0592-175.1552a25.6 25.6 0 1 1 30.6176 41.0624l-253.7984 189.0816a25.6 25.6 0 0 1-34.304-3.3792L424.6016 334.592z" pid="8702" >
                </Path>
            </Svg>
        )
    }
}

export class TaskTabBarSvg extends Component {
    render() {
        let color = "white"
        if (this.props.selected) {
            color = "white"
        }
        return (
            <Svg t="1551453757065" class="icon" style="" viewBox="0 0 1727 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="4585" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M838.071146 441.675889L780.395257 428.774704c19.225296-76.774704 76.774704-115.225296 166.450593-108.774704 96 0 147.225296 44.774704 140.774703 140.774704v147.225296c0 38.450593 6.450593 70.450593 19.225297 83.225296h-51.225297c-12.774704-12.774704-19.225296-32-19.225296-51.225296-25.549407 44.774704-76.774704 64-140.774704 64-76.774704-6.450593-115.225296-32-121.549407-96 0-70.450593 44.774704-108.774704 134.450593-115.225296 70.450593-6.450593 115.225296-12.774704 128-25.549408 6.450593-64-25.549407-96-89.549407-96-70.577075-6.450593-102.577075 19.225296-108.901186 70.450593z m192 108.774704v-44.774704c-6.450593 12.774704-38.450593 19.225296-102.450593 25.549407-64 6.450593-96 32-96 70.450593s32 57.549407 83.225297 57.549407c70.450593-6.450593 108.774704-44.774704 115.225296-108.774703z m153.549407 140.774703V192h51.225297v499.225296h-51.225297z m140.774704 0V192h51.225296v499.225296h-51.225296z m-185.549407 76.774704c-70.450593 0-128 57.549407-128 128 0 12.774704 0 19.225296 6.450593 32-51.225296 19.225296-102.450593 25.549407-153.549407 25.549407-243.225296 0-448-198.450593-448-448S614.071146 57.549407 863.620553 57.549407c96 0 185.549407 25.549407 256 83.225297l38.450593-51.225297C1074.84585 32 972.395257 0 863.620553 0 582.071146 0 351.620553 230.450593 351.620553 512c0 281.549407 230.450593 512 512 512 64 0 128-12.774704 185.549407-38.450593 25.549407 25.549407 57.549407 38.450593 96 38.450593 70.450593 0 128-57.549407 128-128 0.126482-70.324111-63.873518-128-134.32411-128z m0 192c-38.450593 0-64-25.549407-64-64 0-38.450593 25.549407-64 64-64S1202.84585 857.549407 1202.84585 896c0 38.450593-25.549407 64-64 64z" pid="4586" fill={color}>
                </Path>
            </Svg>
        )
    }
}

export class TomatoTarBarSvg extends Component {
    render() {
        let color = this.props.color ? this.props.color : 'white'
        return (
            <Svg t="1551263685772" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="513" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M508.754694 997.056153c-247.557743 0-448.900545-201.365106-448.900545-448.855936L91.883424 548.200218c0 229.847963 187.023306 416.848965 416.893574 416.848965 229.803354 0 416.826661-187.045611 416.826661-416.848965 0-229.825659-187.045611-416.848965-416.826661-416.848965L508.776998 99.366587c247.468525 0 448.855936 201.320497 448.855936 448.833631C957.588325 795.691048 756.223219 997.056153 508.754694 997.056153" pid="514" fill={color}>
                </Path>
                <Path d="M508.754694 997.056153c-247.557743 0-448.900545-201.365106-448.900545-448.855936L91.883424 548.200218c0 229.847963 187.023306 416.848965 416.893574 416.848965 229.803354 0 416.826661-187.045611 416.826661-416.848965 0-229.825659-187.045611-416.848965-416.826661-416.848965L508.776998 99.366587c247.468525 0 448.855936 201.320497 448.855936 448.833631C957.588325 795.691048 756.223219 997.056153 508.754694 997.056153z" pid="515" fill={color}>
                </Path>
                <Path d="M510.026051 235.4687 306.095927 117.723198 510.026051 0Z" pid="516" fill={color}>
                </Path>
                <Path d="M679.094228 782.375256 473.491266 579.560357 473.491266 341.838902 505.498236 341.838902 505.498236 566.222261 701.599477 759.580048Z" pid="517" fill={color}>
                </Path>
                <Path d="M679.094228 782.375256 473.491266 579.560357 473.491266 341.838902 505.498236 341.838902 505.498236 566.222261 701.599477 759.580048Z" pid="518" fill={color}>
                </Path>
            </Svg>
        )
    }
}