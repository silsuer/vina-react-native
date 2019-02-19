// 富文本编辑器部分
import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { CardContainer, CardHeader } from '../../common/CardContainer'
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';
import { RichTextEditorSvg } from '../../assets/svgs/Common'
const mainWindow = Dimensions.get('window')
const windowWidth = mainWindow.width
const windowHeight = mainWindow.height
export default class RichTextEditorContainer extends Component {
    render() {
        return (
            <CardContainer>
                <CardHeader icon={<RichTextEditorSvg color="black" width="20" height="20" />} title="富文本编辑器" extra={[]} />
                <View style={{ height: windowHeight * 0.8, borderRadius: 15, padding: 10 }}>
                    <RichTextEditor style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        marginTop: 55,
                    }}
                        ref={(r) => { this.richText = r }}
                    // contentInset={{ bottom: -10 }}
                    />
                    <RichTextToolbar style={{
                        borderRadius: 5,
                        position: 'absolute',
                        top: 0,
                        backgroundColor: 'white',
                        // height: 40,
                        paddingTop: 2,

                    }}
                        getEditor={() => this.richText}
                        selectedButtonStyle={{
                            backgroundColor: '#f0f0f0',
                            borderRadius: 5,
                        }}

                        // renderAction={(data) => {
                        //     console.log(data)
                        //     return (
                        //         <View>
                        //             <Text>{data}</Text>
                        //         </View>
                        //     )
                        // }}
                    />
                </View>
            </CardContainer>
        )
    }
}