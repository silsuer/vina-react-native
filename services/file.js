import RNFS from 'react-native-fs'


// 文件管理
export class FileManager {

    static SOUNDS_DIR = RNFS.LibraryDirectoryPath + "/"  // 音频文件夹路径

    static INSECTS_AND_BIRDS_TITLE = "insects-and-birds"
    static RAIN_SOUND_TITLE = 'rain'
    static THE_WAVES_TITLE = 'the-waves'
    static THUNDER_TITLE = 'thunder'

    static INSECTS_AND_BIRDS = FileManager.SOUNDS_DIR + FileManager.INSECTS_AND_BIRDS_TITLE + ".mp3" // 虫鸣鸟叫音频位置
    static RAIN_SOUND = FileManager.SOUNDS_DIR + FileManager.RAIN_SOUND_TITLE + ".mp3" // 雨声音频位置
    static THE_WAVES = FileManager.SOUNDS_DIR + FileManager.THE_WAVES_TITLE + ".mp3" // 海浪声音频位置
    static THUNDER = FileManager.SOUNDS_DIR + FileManager.THUNDER_TITLE + ".mp3" // 雷声音频位置

    static REMOTE_ADDR = 'http://192.168.105.69:8080'
    static REMOTE_SOUNDS_ADDR = FileManager.REMOTE_ADDR + '/sounds?name='

    static fileExists = async (path) => {  // 判断文件是否存在
        let res = await RNFS.exists(path)
            .then((value) => {
                return value
            }).catch((err) => {
                return false
            })
        return res
    }

    static DownloadSound = async (path) => {
        let source = FileManager.REMOTE_SOUNDS_ADDR + path + '.mp3'  // 从这个网址下载
        let dest = ''
        switch (path) {
            case FileManager.INSECTS_AND_BIRDS_TITLE: // 虫鸣鸟叫
                dest = FileManager.INSECTS_AND_BIRDS // 下载到这个位置
                break
            case FileManager.RAIN_SOUND_TITLE:
                dest = FileManager.RAIN_SOUND
                break
            case FileManager.THE_WAVES_TITLE:
                dest = FileManager.THE_WAVES
                break
            case FileManager.THUNDER_TITLE:
                dest = FileManager.THUNDER
                break
            default:
                break
        }
        if (source !== '' && dest !== '') {
            const options = {
                fromUrl: source,
                toFile: dest,
                background: true,
                begin: (res) => {
                    console.log("开始下载:", source)
                    console.log("下载位置:", dest)
                }
            }

            try {
                const ret = RNFS.downloadFile(options)
                let res = await ret.promise.catch((err) => { console.log("解析文件失败:", err) })
                console.log("下载完成:", res)
                return res
            } catch (e) {
                console.log("下载文件失败:", e)
            }
        }

    }

}