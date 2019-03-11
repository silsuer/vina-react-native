
import Config from '../../configs/app'
import { exec, getDateStr, nowDateTime } from './base'
import { RemindTask } from './remind_task';
export class PushNotificationRecord {
    constructor() {
        this.tableName = 'push_notification_records'
    }

    static TYPE_TOMATO_TIMER = 1 // 番茄钟类型
    static TYPE_REMIND_TASK = 2  // 提醒任务类型

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
            },
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
            // 取消后删除这一行
            this.deleteNotificationRecord(row.id)
                .then((res) => {
                    pushNotification.cancelLocalNotifications({ id: row.id })
                })

        } else {
            return
        }
    }


    async deleteNotificationRecord(id) {
        let res = await exec(`update ${this.tableName} set is_deleted=? where id=?`, [PushNotificationRecord.IS_DELETED, id])
        return res
    }


    // 添加 提醒任务的 本地通知,传入任务id
    async addRemindTaskLocationNotification(id) {

        const insertToNotification = async (time, id, sound, vibration, advance) => {
            if (new Date(time) > new Date(Date.now())) {

                // 添加提前提醒
                if (advance > 0) {
                    let tt = new Date(parseInt(Date.parse(new Date(time)) - (advance * 60 * 1000))).format("yyyy-MM-dd hh:mm:ss")
                    insertToNotification(tt, id, sound, vibration, 0)
                }

                let insertRes = await exec(`insert into ${this.tableName} (type,time,relation_id) values (?,?,?)`, [PushNotificationRecord.TYPE_REMIND_TASK, time, id])
                    .catch((err) => {
                        console.log("提醒添加到本地推送失败:", err)
                    })
                console.log("添加推送:", time)
                pushNotification.localNotificationSchedule({
                    id: insertRes.result.insertId,
                    message: res.title,
                    date: new Date(time),
                    userInfo: {
                        id: insertRes.result.insertId
                    },
                    ongoing: true,
                    playSound: sound ? sound : false, // 声音 默认没声音
                    vibrate: vibration ? vibration : false,  // 震动，默认不震动
                    vibration: 300
                })
            }
        }
        // 从数据库中取出
        let r = new RemindTask()
        let res = await r.findOne(id)
        if (res.pid !== 0) { // 如果是子任务，则跳过
            return
        }

        let repeats = res.repeat

        // 先删除所有通知，再添加
        let rr = await exec(`select * from ${this.tableName} where type=? and relation_id=?`, [PushNotificationRecord.TYPE_REMIND_TASK, id])
        for (let i = 0; i < rr.result.rows.length; i++) {  // 取消通知
            pushNotification.cancelLocalNotifications({ id: rr.result.rows.item(i).id })
            this.deleteNotificationRecord(rr.result.rows.item(i).id)
        }

        if (!res.remind_at) { // 如果提醒时间不存在，删除所有通知
            return
        }

        // 判断震动 和声音
        let b = false
        let ss = false
        let remindType = res.remind_type.split(',')
        for (let i = 0; i < remindType.length; i++) {
            if (parseInt(remindType[i]) === RemindTask.modeBell) {
                ss = true
            }
            if (parseInt(remindType[i]) === RemindTask.modeShock) {
                b = true
            }
        }

        // 添加这个提醒的最近10次通知
        let start_at = new Date(nowDateTime()).format("yyyy-MM-dd")
        if (res.start_date_at) { // 存在开始时间
            start_at = res.start_date_at
        }

        // 通知,里面存的是时间
        let notifications = []

        // TODO  如果里面有仅一次，则提前先加入通知里
        let f = false
        for (let i = 0; i < repeats.length; i++) {
            if (repeats[i].length === 1 && repeats[i][0] === 'only') {
                f = true
                repeats.splice(i, 1) // 去掉
                i--
            }
        }
        start_at = new Date(start_at)

        if (f === true) { // 如果repeat里有仅一次的话，添加
            let t = start_at.format("yyyy-MM-dd") + " " + res.remind_at
            if (new Date(res.created_at) > new Date(t)) {
                t = new Date(getDateStr(1, res.created_at)).format("yyyy-MM-dd") + " " + res.remind_at
                insertToNotification(t, id, ss, b, res.advance_notify)
            } else {
                insertToNotification(t, id, ss, b, res.advance_notify)
            }
        }

        const searchInRepeats = (repeats, time) => {
            for (let i = 0; i < repeats.length; i++) {
                let row = repeats[i]
                if (row.length === 1 && row[0] === 'only') {
                    continue // 仅一次的，直接跳过
                }
                if (row.length === 1 && row[0] === 'everyday') {
                    return true
                }
                if (row.length === 2) {
                    switch (row[0]) {
                        case 'everyweek':
                            if (time.getDay() === parseInt(row[1])) {
                                return true
                            }
                            break
                        case 'everymonth':
                            let pd = row[1].split('-')
                            if (time.getDate() === parseInt(pd[1])) {
                                return true
                            }
                            break
                        default:
                            break
                    }
                }
            }
            return false
        }

        while (true) {

            if (repeats.length === 0) {
                break
            }

            // 判断现在这个日期是否符合重复中的数
            let flag = searchInRepeats(res.repeat, start_at)
            // 如果符合标准,把这一天的提醒时间加入notifications数组中
            if (flag) {
                let time = start_at.format("yyyy-MM-dd") + " " + res.remind_at
                notifications.push(time)
                insertToNotification(time, id, ss, b, res.advance_notify)
            }


            if (notifications.length >= 10) { // 直到通知数大于10或者到达结束日期时跳出循环
                break
            }
            if (res.end_date_at !== null) {
                if (start_at > new Date(res.end_date_at)) { // 直到
                    break
                }
            }
            start_at = new Date(getDateStr(1, start_at.format("yyyy-MM-dd"))) // 将start_at向后移动一天
        }


    }


}