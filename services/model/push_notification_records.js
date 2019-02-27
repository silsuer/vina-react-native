
import Config from '../../configs/app'
import { exec } from './base'
export class PushNotificationRecord {
    constructor() {
        this.tableName = 'push_notification_records'
    }

    static TYPE_TOMATO_TIMER = 1 // 番茄钟类型

    static IS_NOT_DELETED = 0  // 未软删除
    static IS_DELETED = 1   // 已软删除
    // 添加一个番茄钟推送
    // minute seconds tomatoTimerId mode
    async addTomatoLocationNotification(obj) {
        // 
        // 插入一个数据 类型 时间 关联id
        let t = new Date(Date.now() + (obj.minute * 60 + obj.seconds) * 1000)
        // let t = new Date(Date.now() + 3000)
        let res = await exec(`insert into ${this.tableName} (type,time,relation_id) values (?,?,?)`, [PushNotificationRecord.TYPE_TOMATO_TIMER, t.toString(), obj.tomatoTimerId])
            .catch((err) => {
                console.log("番茄钟添加到本地推送失败:", err)
            })

        pushNotification.localNotificationSchedule({
            id: res.result.insertId,
            message: obj.mode === 'work' ? '恭喜您完成一个番茄钟，休息一下吧！' : '休息时间到，准备开始下一个番茄钟吧!',
            date: t,
            userInfo: {
                id: res.result.insertId
            }
        })
        return res.result.insertId
    }

    // 撤销番茄钟推送,传入番茄钟id
    async cancelLocalTomatoNotification(id) {
        // 根据番茄钟的id，查出推送id
        let res = await exec(`select * from ${this.tableName} where type=? and relation_id=? and is_deleted=?`, [
            PushNotificationRecord.TYPE_TOMATO_TIMER,
            id,
            PushNotificationRecord.IS_NOT_DELETED
        ])
        if (res.result.rows.length > 0) {
            // 获取第一行
            let row = res.result.rows.item(0)
            pushNotification.cancelLocalNotifications({ id: row.id })
        } else {
            return
        }
    }
}