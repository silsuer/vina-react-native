// 便签本主界面的全部便签页面，显示最近消息

import React, { Component } from 'react'
import Page from '../../../common/Page'
import { NoteSvg, EditorSvg } from '../../../assets/svgs/Common'
import { Provider, Modal } from '@ant-design/react-native'


// 新建笔记
export default class NewNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新建笔记',
            left: [
                <NoteSvg width="18" height="18" />
            ],
            editorType: 'rich-text',  // rich-text 富文本编辑器  markdown-text markdown编辑器 hand-account 手帐编辑器
        }
    }

    getCurrentBodyComponent() {
        let Comp = null
        switch (this.state.editorType) {
            case 'rich-text':
                Comp = require('../RichTextEditorContainer').default
                return (
                    <Comp />
                )
            case 'markdown-text':
                Comp = require('../RichTextEditorContainer').default
                return (
                    <Comp />
                )
            case 'hand-account':
                Comp = require('../RichTextEditorContainer').default
                return (
                    <Comp />
                )
            default:
                return null
        }

    }
    render() {
        return (
            <Provider>
                <Page
                    title={this.state.title}
                    left={this.state.left}
                    right={[
                        <EditorSvg width="20" height="20" onPress={() => {
                            Modal.operation([
                                {
                                    text: '富文本编辑器',
                                    onPress: () => {
                                        this.setState({ editorType: 'rich-text' })
                                    },
                                    style: {
                                        fontSize: 15,
                                    }
                                }, {
                                    text: 'Markdown编辑器',
                                    onPress: () => {
                                        this.setState({ editorType: 'markdown-text' })
                                    },
                                    style: {
                                        fontSize: 15,
                                    }
                                }, {
                                    text: '手帐编辑器',
                                    onPress: () => {
                                        this.setState({ editorType: 'hand-account' })
                                    },
                                    style: {
                                        fontSize: 15,
                                    }
                                }
                            ])
                        }} />
                    ]}
                    tabBarOptions={[]}
                    body={this.getCurrentBodyComponent()}
                />
            </Provider>
        )
    }
}