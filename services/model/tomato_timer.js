import { exec, nowDateTime } from './base'

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
        let res = await exec(`insert into ${this.tablename} (start_at,relation_task_id,final_status,mode) values(?,?,?,?)`, [nowDateTime(), id, TomatoTimer.STATUS_UNNORMAL_STOP, mode])
        return res.result.insertId
    }
}