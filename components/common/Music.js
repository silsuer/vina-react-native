
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { List, Switch, Slider } from '@ant-design/react-native'
import { DownloadSvg } from '../assets/svgs/Common'
import SmallLoading from './SmallLoading'
import { FileManager } from '../../services/file'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
// 音频播放modal



export default class Music extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startMusic: global.musicSetting.start,  // 是否开启音效
            insectsAndBirdsExists: false,  // 虫鸣鸟叫音频是否存在
            rainExists: false,  // 雨声 音频是否存在
            theWavesExists: false,   // 海浪音频是否存在,
            thunderExists: false,  // 雷声音频是否存在
        }
    }

    changeVolumns(name, volumn) {
        volumn = volumn * 100
        switch (name) {
            case FileManager.INSECTS_AND_BIRDS_TITLE:
                if (global.musicSetting.insectsAndBirdsPlayer == null) {
                    this.createPlayers()
                }
                if (this.state.insectsAndBirdsExists === true) {
                    global.musicSetting.insectsAndBirdsPlayer.setVolume(volumn)
                    global.musicSetting.insectsAndBirdsPlayerVolumn = volumn
                }
                break
            case FileManager.RAIN_SOUND_TITLE:
                if (global.musicSetting.rainPlayer == null) {
                    this.createPlayers()
                }
                if (this.state.rainExists === true) {
                    global.musicSetting.rainPlayer.setVolume(volumn)
                    global.musicSetting.rainPlayerVolumn = volumn
                }
                break
            case FileManager.THUNDER_TITLE:
                if (global.musicSetting.thunderPlayer == null) {
                    this.createPlayers()
                }
                if (this.state.thunderExists === true) {
                    global.musicSetting.thunderPlayer.setVolume(volumn)
                    global.musicSetting.thunderPlayerVolumn = volumn
                }
                break
            case FileManager.THE_WAVES_TITLE:
                if (global.musicSetting.theWavesPlayer == null) {
                    this.createPlayers()
                }
                if (this.state.theWavesExists === true) {
                    global.musicSetting.theWavesPlayer.setVolume(volumn)
                    global.musicSetting.theWavesPlayerVolumn = volumn
                }
                break
            default:
                break
        }
    }

    closePlayers() {
        if (global.musicSetting.insectsAndBirdsPlayer !== null) {
            global.musicSetting.insectsAndBirdsPlayer.stop()
        }
        if (global.musicSetting.rainPlayer !== null) {
            global.musicSetting.rainPlayer.stop()
        }
        if (global.musicSetting.theWavesPlayer !== null) {
            global.musicSetting.theWavesPlayer.stop()
        }
        if (global.musicSetting.thunderPlayer !== null) {
            global.musicSetting.thunderPlayer.stop()
        }
    }

    createPlayers() {

        // 虫鸣鸟叫
        if (global.musicSetting.insectsAndBirdsPlayer !== null) {
            global.musicSetting.insectsAndBirdsPlayer.play()
        }
        if (global.musicSetting.insectsAndBirdsPlayer == null && this.state.insectsAndBirdsExists === true) {  // 如果音频存在且播放器不存在
            global.musicSetting.insectsAndBirdsPlayer = new Sound(FileManager.INSECTS_AND_BIRDS_TITLE + ".mp3", RNFS.LibraryDirectoryPath, (err) => {
                if (err) {
                    console.log("创建虫鸣鸟叫播放器失败:", err)
                    return
                }
                global.musicSetting.insectsAndBirdsPlayer.play()  // 加载完成后就播放
                global.musicSetting.insectsAndBirdsPlayer.setCategory('Playback')
                global.musicSetting.insectsAndBirdsPlayer.setVolume(0)
                global.musicSetting.insectsAndBirdsPlayer.setNumberOfLoops(-1)
            })
        }

        if (global.musicSetting.theWavesPlayer !== null) {
            global.musicSetting.theWavesPlayer.play()
        }
        // 海浪
        if (global.musicSetting.theWavesPlayer == null && this.state.theWavesExists === true) {
            global.musicSetting.theWavesPlayer = new Sound(FileManager.THE_WAVES_TITLE + ".mp3", RNFS.LibraryDirectoryPath, (err) => {
                if (err) {
                    console.log("创建海浪播放器失败:", err)
                    return
                }
                global.musicSetting.theWavesPlayer.play()
                global.musicSetting.theWavesPlayer.setCategory('Playback')
                global.musicSetting.theWavesPlayer.setVolume(0)
                global.musicSetting.theWavesPlayer.setNumberOfLoops(-1)
            })
        }

        if (global.musicSetting.rainPlayer !== null) {
            global.musicSetting.rainPlayer.play()
        }
        // 雨声
        if (global.musicSetting.rainPlayer == null && this.state.rainExists === true) {
            global.musicSetting.rainPlayer = new Sound(FileManager.RAIN_SOUND_TITLE + ".mp3", RNFS.LibraryDirectoryPath, (err) => {
                if (err) {
                    console.log("创建雨声播放器失败:", err)
                    return
                }
                global.musicSetting.rainPlayer.play()
                global.musicSetting.rainPlayer.setCategory('Playback')
                global.musicSetting.rainPlayer.setVolume(0)
                global.musicSetting.rainPlayer.setNumberOfLoops(-1)
            })
        }

        if (global.musicSetting.thunderPlayer !== null) {
            global.musicSetting.thunderPlayer.play()
        }
        // 雷声
        if (global.musicSetting.thunderPlayer == null && this.state.thunderExists === true) {
            global.musicSetting.thunderPlayer = new Sound(FileManager.THUNDER_TITLE + ".mp3", RNFS.LibraryDirectoryPath, (err) => {
                if (err) {
                    console.log("创建雷声播放器失败:", err)
                    return
                }
                global.musicSetting.thunderPlayer.play()
                global.musicSetting.thunderPlayer.setCategory('Playback')
                global.musicSetting.thunderPlayer.setVolume(0)
                global.musicSetting.thunderPlayer.setNumberOfLoops(-1)
            })
        }
    }



    // 初始化信息
    componentDidMount() {
        // 判断虫鸣音频是否存在
        const logic = async () => {
            if (await FileManager.fileExists(FileManager.INSECTS_AND_BIRDS)) {
                this.setState({ insectsAndBirdsExists: true })
            }
            if (await FileManager.fileExists(FileManager.RAIN_SOUND)) {
                this.setState({ rainExists: true })
            }
            if (await FileManager.fileExists(FileManager.THE_WAVES)) {
                this.setState({ theWavesExists: true })
            }
            if (await FileManager.fileExists(FileManager.THUNDER)) {
                this.setState({ thunderExists: true })
            }
        }
        logic()
    }


    // 点击下载某些音频
    async  _onPressDownload(name) {
        let dir = ''
        flag = ''
        switch (name) {
            case FileManager.INSECTS_AND_BIRDS_TITLE:
                dir = FileManager.INSECTS_AND_BIRDS
                flag = 'insectsAndBirdsExists'
                break
            case FileManager.RAIN_SOUND_TITLE:
                dir = FileManager.RAIN_SOUND
                flag = 'rainExists'
                break
            case FileManager.THE_WAVES_TITLE:
                dir = FileManager.THE_WAVES
                flag = 'theWavesExists'
                break
            case FileManager.THUNDER_TITLE:
                dir = FileManager.THUNDER
                flag = 'thunderExists'
                break
            default:
                break
        }

        if (dir !== '' && flag !== '') {
            this.setState({ [flag]: 'loading' }, () => {
                // 判断音频是否存在，如果不存在,再下载
                FileManager.fileExists(dir)
                    .then((exist) => {
                        if (!exist) {
                            FileManager.DownloadSound(name)
                                .then(() => {
                                    this.setState({ [flag]: true })
                                })
                        }
                    })
            })
        }
    }

    render() {

        const styles = StyleSheet.create({
            musicItem: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            },
            musicIcon: {
                flex: 1
            },
            musicItemText: {
                flex: 3
            },
            musicItemSlider: {
                flex: 10
            }
        })

        // 获取下载图标的颜色（禁用是灰色）
        const getDownloadSvgColor = (name) => {
            let color = '#108ee9'
            if (!this.state.startMusic) {
                color = "#d4d4d4"
            }
            return color
        }

        // 获取某行下载图标的状态
        const getDownloadSvgStatus = (name) => {
            let dir = ''
            let flag = ''
            if (this.state.startMusic) { // 音效开启着
                // 判断是否存在这个数据
                switch (name) {
                    case FileManager.INSECTS_AND_BIRDS_TITLE:
                        flag = 'insectsAndBirdsExists'
                        break
                    case FileManager.RAIN_SOUND_TITLE:
                        flag = 'rainExists'
                        break
                    case FileManager.THE_WAVES_TITLE:
                        flag = 'theWavesExists'
                        break
                    case FileManager.THUNDER_TITLE:
                        flag = 'thunderExists'
                        break
                    default:
                        break
                }
                if (this.state[flag] === true) { // 存在
                    return false
                } else {
                    return true
                }

            } else {
                return true
            }
        }

        const getIcon = (name) => {
            let flag = ''
            switch (name) {
                case FileManager.INSECTS_AND_BIRDS_TITLE:
                    flag = 'insectsAndBirdsExists'
                    break
                case FileManager.RAIN_SOUND_TITLE:
                    flag = 'rainExists'
                    break
                case FileManager.THE_WAVES_TITLE:
                    flag = 'theWavesExists'
                    break
                case FileManager.THUNDER_TITLE:
                    flag = 'thunderExists'
                    break
            }

            if (flag == '' || this.state[flag] !== 'loading') {
                return (
                    <TouchableOpacity disabled={getDownloadSvgColor(name) === '#d4d4d4' ? true : false}
                        onPress={this._onPressDownload.bind(this, name)}
                    >
                        <DownloadSvg color={getDownloadSvgColor(name)} width="20" height="20" />
                    </TouchableOpacity>
                )
            } else {
                if (this.state[flag] === 'loading') {
                    return (
                        <SmallLoading />
                    )
                }
                return null
            }


        }


        return (
            <View>
                <List>
                    <List.Item extra={<Switch checked={this.state.startMusic} onChange={() => {
                        this.setState({ startMusic: !this.state.startMusic }, () => {
                            if (this.state.startMusic === true) {  // 如果开启了，就创建数据
                                global.musicSetting.start = true
                                this.createPlayers()
                            } else {
                                global.musicSetting.start = false
                                this.closePlayers()
                            }
                        })
                    }} />}>
                        <Text>开启音效</Text>
                    </List.Item>
                </List>
                <View style={styles.musicItem}>
                    <View style={styles.musicIcon}>
                        <View style={{ display: this.state.insectsAndBirdsExists === true ? 'none' : 'flex' }}>
                            {getIcon(FileManager.INSECTS_AND_BIRDS_TITLE)}
                        </View>
                    </View>
                    <View style={styles.musicItemText}>
                        <Text style={{ color: getDownloadSvgStatus(FileManager.INSECTS_AND_BIRDS_TITLE) ? '#d4d4d4' : '#000000' }} >虫鸣</Text>
                    </View>
                    <View style={styles.musicItemSlider}>
                        <Slider disabled={getDownloadSvgStatus(FileManager.INSECTS_AND_BIRDS_TITLE) ? true : false}
                            onChange={(value) => {
                                // 改变声音大小
                                this.changeVolumns(FileManager.INSECTS_AND_BIRDS_TITLE, value)
                            }}
                            defaultValue={global.musicSetting.insectsAndBirdsPlayerVolumn / 100}
                        />
                    </View>
                </View>
                <View style={styles.musicItem}>
                    <View style={styles.musicIcon}>
                        <View style={{ display: this.state.theWavesExists === true ? 'none' : 'flex' }}>
                            {getIcon(FileManager.THE_WAVES_TITLE)}
                        </View>
                    </View>
                    <View style={styles.musicItemText}>
                        <Text style={{ color: getDownloadSvgStatus(FileManager.THE_WAVES_TITLE) ? '#d4d4d4' : '#000000' }} >海浪</Text>
                    </View>
                    <View style={styles.musicItemSlider}>
                        <Slider disabled={getDownloadSvgStatus(FileManager.THE_WAVES_TITLE) ? true : false}
                            onChange={(value) => {
                                // 改变声音大小
                                this.changeVolumns(FileManager.THE_WAVES_TITLE, value)
                            }}
                            defaultValue={global.musicSetting.theWavesPlayerVolumn / 100}
                        />
                    </View>
                </View>
                <View style={styles.musicItem}>
                    <View style={styles.musicIcon}>
                        <View style={{ display: this.state.rainExists === true ? 'none' : 'flex' }}>
                            {getIcon(FileManager.RAIN_SOUND_TITLE)}
                        </View>
                    </View>
                    <View style={styles.musicItemText}>
                        <Text style={{ color: getDownloadSvgStatus(FileManager.RAIN_SOUND_TITLE) ? '#d4d4d4' : '#000000' }} >雨声</Text>
                    </View>
                    <View style={styles.musicItemSlider}>
                        <Slider disabled={getDownloadSvgStatus(FileManager.RAIN_SOUND_TITLE) ? true : false}
                            onChange={(value) => {
                                // 改变声音大小
                                this.changeVolumns(FileManager.RAIN_SOUND_TITLE, value)
                            }}
                            defaultValue={global.musicSetting.rainPlayerVolumn / 100}
                        />
                    </View>
                </View>
                <View style={styles.musicItem}>
                    <View style={styles.musicIcon}>
                        <View style={{ display: this.state.thunderExists === true ? 'none' : 'flex' }}>
                            {getIcon(FileManager.THUNDER_TITLE)}
                        </View>
                    </View>
                    <View style={styles.musicItemText}>
                        <Text style={{ color: getDownloadSvgStatus(FileManager.THUNDER_TITLE) ? '#d4d4d4' : '#000000' }} >雷声</Text>
                    </View>
                    <View style={styles.musicItemSlider}>
                        <Slider disabled={getDownloadSvgStatus(FileManager.THUNDER_TITLE) ? true : false}
                            onChange={(value) => {
                                // 改变声音大小
                                this.changeVolumns(FileManager.THUNDER_TITLE, value)
                            }}
                            defaultValue={global.musicSetting.thunderPlayerVolumn / 100}
                        />
                    </View>
                </View>
            </View>
        )
    }
}
