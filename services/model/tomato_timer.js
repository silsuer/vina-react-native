import { exec, nowDateTime } from './base'
import { PushNotificationRecord } from './push_notification_records'
export class TomatoTimer {

    static STATUS_RUNNING = 0  // 正在执行
    static STATUS_PAUSE = 1  // 暂停
    static STAUS_NORMAL_STOP = 2 // 正常停止
    static STATUS_UNNORMAL_STOP = 3  // 使用了停止按钮或者强制退出了程序

    constructor() {
        this.tablename = 'tomato_timer'
    }

    // 插入一条初始化的数据，返回插入后的id
    async insertInit(id, mode) {
        let res = await exec(`insert into ${this.tablename} (start_at,relation_task_id,final_status,mode) values(?,?,?,?)`, [
            nowDateTime(),
            id,
            TomatoTimer.STATUS_RUNNING,  // 初始化的时候正在运行状态
            mode
        ])
        return res.result.insertId
    }

    updateToStopTimer(id, f_status) {
        let status = f_status || TomatoTimer.STAUS_NORMAL_STOP  // 默认是正常停止
        exec(`update ${this.tablename} set final_status=?,end_at=? where id=?`, [status, nowDateTime(), id])

        // 如果设为了强制停止状态，则撤销本地推送通知
        let p = new PushNotificationRecord()
        p.cancelLocalTomatoNotification(id)
        return true
    }

    // 定义一个定时器，每秒都执行一次
}