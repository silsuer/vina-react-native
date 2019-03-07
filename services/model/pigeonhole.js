
import { exec } from './base'
export class Pigeonhole {
    constructor() {
        this.tableName = 'pigeonhole'

    }

    // 插入数据
    async insert(data) {
        let res = await exec(`insert into ${this.tableName} (name,color,sequence,pid) values(?,?,?,?)`, [
            data.name,
            data.color,
            data.sequence,
            data.pid,
        ]).catch((err) => { console.log("插入归档数据失败:", err) })
        return res.result.insertId
    }

    // 获取所有归档数据（按照层级显示）
    async findAll() {
        let res = await exec(`select * from pigeonhole order by sequence`)
        let r = []
        for (let i = 0; i < res.result.rows.length; i++) {
            r.push(res.result.rows.item(i))
        }
        return r
        // refreshResult(r)
    }

    // 将获取的rows重新按照pid整理成多维数组
    refreshResult(rows) {
        console.log(rows)
    }


    updatePid(id, pid, sequence) {
        exec(`update ${this.tableName} set pid=?,sequence=? where id=?`, [pid, sequence, id]).catch((err) => { console.log("更新归档pid失败:", err) })
    }
}