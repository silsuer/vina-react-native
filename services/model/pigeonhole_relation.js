import { exec } from './base'

export class PigeonholeRelation {
    static TABLE_NAME = 'pigeonhole_relation'
    constructor() {
        this.tableName = 'pigeonhole_relation'
    }

    static TYPE_REMIND_TASK = 1  // 提醒类型
    static TYPE_NOTES = 2 // 笔记类型
    static TYPE_HAND_ACOUNT = 3 // 手帐类型
    static TYPE_ACCOUNT = 4  // 账本类型
    static TYPE_COUNTDOWN = 5 // 倒计时类型
    static TYPE_ANNIVERSARY = 6 // 纪念日类型


    // 关联对象的id 归档的id 关联类型
    async updateRelation(rid, pid, type) {
        // 查询，如果有，则修改，否则添加一条
        let selectRes = await exec(`select * from ${this.tableName} where relation_id=?  and type=?`, [rid, type])

        if (selectRes.result.rows.length > 1) {  // 清除所有再添加
            await exec(`delete from ${this.tableName} where relation_id=? and type=?`, [rid, type])
            return await exec(`insert into ${this.tableName} (pigeonhole_id,relation_id,type) values (?,?,?)`, [pid, rid, type])
        }

        if (selectRes.result.rows.length > 0) { // 存在 修改
            let updateRes = await exec(`update ${this.tableName} set pigeonhole_id=? where relation_id=? and type=?`, [pid, rid, type])
            return updateRes
        } else { // 不存在，插入
            let insertRes = await exec(`insert into ${this.tableName} (pigeonhole_id,relation_id,type) values (?,?,?)`, [pid, rid, type])
            return insertRes
        }
    }
}

