
import Config from '../../configs/app'
import { exec } from './base'
export class PushNotificationRecord {
    constructor() {
        this.tableName = 'push_notification_records'
    }

    static TYPE_TOMATO_TIMER = 1 // 番茄钟类型

    // 添加一个番茄钟推送
    async addTomatoLocationNotification(obj) {
        // 
        // 插入一个数据 类型 时间 关联id
        // let t = new Date(Date.now() + (obj.minute * 60 + obj.seconds) * 1000)
        let t = new Date(Date.now() + 3000)
        let res = await exec(`insert into ${this.tableName} (type,time,relation_id) values (?,?,?)`, [PushNotificationRecord.TYPE_TOMATO_TIMER, t.toString(), obj.tomatoTimerId])
            .catch((err) => {
                console.log("番茄钟添加到本地推送失败:", err)
            })

        pushNotification.localNotificationSchedule({
            id: res.result.insertId,
            message: obj.mode === 'work' ? '恭喜您完成一个番茄钟，休息一下吧！' : '休息时间到，准备开始下一个番茄钟吧!',
            date: t,
        })
        return res.result.insertId
    }
}