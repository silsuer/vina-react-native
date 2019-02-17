import React, { Component } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { Svg, Path } from 'react-native-svg';
const styles = StyleSheet.create({
    container: {
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#00000000',
        padding: 20,
        paddingLeft: 10,
        overflow: 'hidden',
    },
    image: {
        marginLeft: 0,
    },
    text: {
        marginLeft: 15,
        color: '#f5f5f5',
        fontSize: 22,
        // overflow: 'scroll',
    }
})
export class SlideAvatar extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../assets/images/default_avatar.jpg')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                <Text style={styles.text}>silsuer</Text>
            </View>
        )
    }
}



export class PassowrdBoxSvg extends Component {
    render() {
        let color = "white"
        return (
            <Svg t="1550377555195" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="2521" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M699.2 418.4h-26.4v-53.6c0-92.8-67.2-168-150.4-168h-12C427.2 196.8 360 272 360 364.8v53.6h-26.4v-53.6c0-107.2 79.2-194.4 176.8-194.4h12c97.6 0 176.8 87.2 176.8 194.4v53.6z" fill={color} pid="2522">
                </Path>
                <Path d="M741.6 853.6H282.4c-39.2 0-72-31.2-72-68.8v-304c0-38.4 32-68.8 72-68.8h459.2c39.2 0 72 31.2 72 68.8V784c-0.8 38.4-32.8 69.6-72 69.6zM282.4 439.2c-24 0-43.2 18.4-43.2 41.6V784c0 22.4 19.2 41.6 43.2 41.6h459.2c24 0 43.2-18.4 43.2-41.6V480.8c0-22.4-19.2-41.6-43.2-41.6H282.4z" fill={color} pid="2523">
                </Path>
                <Path d="M523.2 664c-44 0-79.2-35.2-79.2-79.2s35.2-79.2 79.2-79.2 79.2 35.2 79.2 79.2-35.2 79.2-79.2 79.2z m0-138.4c-32.8 0-60 26.4-60 60s26.4 60 60 60c32.8 0 60-26.4 60-60s-27.2-60-60-60z" fill={color} pid="2524">
                </Path>
                <Path d="M523.2 776.8c-5.6 0-9.6-4-9.6-9.6V654.4c0-5.6 4-9.6 9.6-9.6s9.6 4 9.6 9.6v112.8c0 4.8-4 9.6-9.6 9.6z" fill={color} pid="2525">
                </Path>
                <Path d="M566.4 720h-41.6c-4 0-7.2-4-7.2-9.6s3.2-9.6 7.2-9.6h41.6c4 0 7.2 4 7.2 9.6s-3.2 9.6-7.2 9.6zM566.4 764h-41.6c-4 0-7.2-4-7.2-9.6s3.2-9.6 7.2-9.6h41.6c4 0 7.2 4 7.2 9.6s-3.2 9.6-7.2 9.6z" fill={color} pid="2526">
                </Path>
            </Svg>
        )
    }
}


export class CloudStorageSvg extends Component {
    render() {
        let color = "white"
        return (
            <Svg t="1550377619207" class="icon" style="" viewBox="0 0 1636 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="3614" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M1105.59658329 268.82677499c-58.10119-121.450229-178.252844-204.826775-316.972781-204.826775-174.316956 0-319.11476 131.571081-348.633913 304.696562C346.15780729 396.11389699 277.33333329 486.14396699 277.33333329 593.02873599c0 125.386116 94.782586 227.665629 213.367917 232.672506h598.817101v-0.240973c140.982403-8.099359 252.793725-129.857498 252.793724-279.113296 0-143.351968-103.47099-261.482128-236.715492-277.546973z m-2.021493 482.239874l0.120486-0.602431h-0.240972v0.950503H493.33856229v-0.120486c-80.498261-3.561041-144.797804-72.974559-144.797803-158.265499 0-87.513244 67.753484-158.372598 151.277291-158.372598 2.677474 0 5.127363 0.120486 7.617414 0.240973-0.120486-3.212969-0.240973-6.546424-0.240973-9.759394a294.187475 294.187475 0 0 1 7.148856-64.420028h-0.361459c31.192574-127.996653 142.294365-222.658753 274.574977-222.658753 99.066545 0 186.338816 53.228187 236.956465 133.71306-72.519388 14.043352-134.676951 58.583135-174.035821 120.258753l55.129193 44.887855c32.12969-53.696745 87.151785-90.726213 150.862283-96.389071 5.595921-0.481945 11.312328-0.843404 17.149222-0.843404a188.092561 188.092561 0 0 1 58.703621 9.290835v-0.120486c80.725847 26.078599 139.429468 104.662466 139.429468 197.664531 0 103.952935-73.469891 190.100667-169.202981 204.572415z m0 0" fill={color} pid="3615">
                </Path>
            </Svg>
        )
    }
}

export class SettingSvg extends Component {
    render() {
        let color = "white"
        return (
            <Svg t="1550377659599" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="1120" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width ? this.props.width : 25} height={this.props.height ? this.props.height : 25}>
                <Path d="M912.8 423.5l-98.5-23.7c-0.4-1.1-0.8-2.1-1.2-3.1l56.3-90.5 8.7-14-11.7-11.5-113.8-112-11.1-11-13.1 8.4-82.9 53.5c-2.4-1.1-4.9-2.2-7.4-3.2l-21.2-102.2-3.3-16H422.8l-3.7 15.4-24 99.1-90.3-56-13.2-8.2-11 11.1-112 113.6-11.4 11.8 9 13.9 53.3 82.2c-0.5 1-0.9 2.1-1.4 3.1l-104.8 25.3-15.3 3.7v191.7l15.9 3.3 98.6 20.4 1.2 3-57.7 94.3-8.5 13.8 11.4 11.4 112.7 112.5 11.2 11.2 13.2-8.7 88.1-57.9c0.2 0.1 0.3 0.1 0.5 0.2l25.2 104.4 3.7 15.4h190.8l3.3-16 20.3-98.1c0.8-0.3 1.7-0.6 2.5-1l95 58 13 8 10.9-10.9L862 755.7l11.8-11.8-9.2-14-56.7-86.2 104.3-21.5 15.9-3.3V427.1l-15.3-3.6zM732.6 828.4l-90.3-55.2-8.6-5.2-9.2 3.9c-6.5 2.8-13.2 5.4-19.9 7.7l-10.7 3.7-2.3 11.3-19.3 93.2H444.4l-23.9-99-2.5-10.2-9.6-3.8c-6-2.4-11.9-5-17.7-7.8l-9.9-4.7-9.2 6-83.9 55.1-90-89.9 54.7-89.4 5.6-9.1-4.3-9.8c-3-6.8-5.7-13.8-8.1-20.9l-3.7-10.9-11-2.3-93.5-19.3V445.2l99.3-23.9 9.9-2.4 3.9-9.7c2.8-7 5.9-13.8 9.2-20.6l5.2-10.5-6.4-9.8-50.5-78 89.5-90.8 86.3 53.5 8.6 5.3 9.3-4c5.4-2.3 10.8-4.4 16.3-6.4l10.1-3.6 2.6-10.6 23-95.1h127.8l20.1 96.8 2.3 10.9 10.2 3.9c8.3 3.2 16.4 6.7 24.3 10.6l9.9 4.9 9.3-6 78.9-50.9 90.9 89.4-53.1 85.4-5.7 9.1 4.2 9.9c2.9 6.8 5.6 13.8 7.9 20.8l3.6 10.5 10.6 2.6 93.6 22.6v126.5l-99.1 20.5-10.3 2.1-4 10c-2.4 5.9-5 11.8-7.8 17.6l-5.1 10.6 6.4 9.8 54.1 82.2-90.1 90z" fill={color} pid="1121">
                </Path>
                <Path d="M511.3 338.8c-95.4 0-173 77.6-173 173s77.6 173 173 173 173-77.6 173-173-77.6-173-173-173z m0 306c-73.3 0-133-59.6-133-133s59.6-133 133-133c73.3 0 133 59.6 133 133s-59.7 133-133 133z" fill={color} pid="1122">
                </Path>
            </Svg>
        )
    }
}

export class MenuIcon extends Component{
    render(){
        let color = "white"

        return (
            <Svg t="1550390275424" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="1127" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width?this.props.width:25} height={this.props.height?this.props.height:25}>
            <Path d="M377.724 478.795h415.79v66.41h-415.79v-66.41z" pid="1128" fill={color}>
            </Path>
            <Path d="M377.724 266.021h415.79v66.41h-415.79v-66.41z" pid="1129" fill={color}>
            </Path>
            <Path d="M230.486 247.525h103.402v103.402h-103.402v-103.402z" pid="1130" fill={color}>
            </Path>
            <Path d="M230.486 460.3h103.402v103.402h-103.402v-103.402z" pid="1131" fill={color}>
            </Path>
            <Path d="M230.486 673.073h103.402v103.402h-103.402v-103.402z" pid="1132" fill={color}>
            </Path>
            <Path d="M377.724 691.569h415.79v66.41h-415.79v-66.41z" p-id="1133" fill={color}>
            </Path></Svg>
        )
    }
}