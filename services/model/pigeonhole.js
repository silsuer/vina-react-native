
import { exec } from './base'
import { PigeonholeRelation } from './pigeonhole_relation'
import { RemindTask } from './remind_task';
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

    // 删除归档和归档关联，却并不删除和归档相关联的数据
    async deletePigeonholeWithoutRelation(id) {
        // 先删除关联
        let delete1Res = await exec(`delete from ${PigeonholeRelation.TABLE_NAME} where pigeonhole_id=?`, [id])
        // 再删除归档
        let delete2Res = await exec(`delete from ${this.tableName} where id=?`, [id])
        return {
            relationResult: delete1Res, // 删除关联的结果
            tableResult: delete2Res, // 删除归档的结果
        }
    }

    // 删除归档和与归档相关的所有数据
    async deletePigeonholeWithRelation(id) {
        // 查出所有归档相关数据
        let res = await exec(`select * from ${PigeonholeRelation.TABLE_NAME} where pigeonhole_id=?`, [id])

        let rt = new RemindTask()
        // 遍历删除
        for (let i = 0; i < res.result.rows.length; i++) {
            let row = res.result.rows.item(0)
            // 根据类型，去那个表中删除
            switch (row.type) {
                case PigeonholeRelation.TYPE_REMIND_TASK:
                    rt.softDelete(row.relation_id)
                    break
                default:
                    break
            }
        }

        // 删除关联和归档
        return await this.deletePigeonholeWithoutRelation(id)
    }
}