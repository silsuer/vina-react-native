import React, { Component } from 'React';
import { View } from 'react-native';
import { Svg, Path } from 'react-native-svg';
export default class TomatoSvg extends Component {
    render() {

        let number = 1;
        if (this.props.number !== undefined) {
            number = this.props.number
        }
        let d = [];
        for (let i = 0; i < number; i++) {
            d.push(1)
        }

        const renderSvg = () => {
            return d.map((data, index) => {
                return (
                    <Svg key={index} t="1548496252034" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" pid="3806" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width} height={this.props.height}>
                        <Path fillOpacity="0.8" d="M504 566.9m-366 0a366 366 0 1 0 732 0 366 366 0 1 0-732 0Z" fill="#FF3E3E" pid="3807">
                        </Path>
                        <Path fillOpacity="0.9" fill="#8ADA33" d="M648.1 82l50.4 136.6c1.6 4.2 5.5 7.1 10 7.2l145.5 5.7c10.3 0.4 14.5 13.4 6.4 19.8L746 341.4c-3.5 2.8-5 7.4-3.8 11.7l39.5 140.1c2.8 9.9-8.3 17.9-16.8 12.2l-121-80.9c-3.7-2.5-8.6-2.5-12.3 0l-121 80.9c-8.6 5.7-19.6-2.3-16.8-12.2l39.5-140.1c1.2-4.3-0.3-8.9-3.8-11.7l-114.3-90.1c-8.1-6.4-3.9-19.4 6.4-19.8l145.5-5.7c4.5-0.2 8.4-3 10-7.2L627.3 82c3.5-9.7 17.2-9.7 20.8 0z" pid="3808">
                        </Path>
                    </Svg>
                )
            })
        }

        return (
            <View style={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                {renderSvg()}

            </View>
        )
    }
}