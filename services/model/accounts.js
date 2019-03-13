import { exec, nowDateTime } from "./base";

// 账单表
export class Accounts {
    constructor() {
        this.tableName = "accounts"
    }

    static TYPE_INCOME = 1  // 收入类型
    static TYPE_PAY = 0  // 支出类型

    static IS_DELETED = 1 // 软删除标记

    // 添加一条账单，obj包括uid,amount、type、comment、category_id
    async create(obj) {
        //TODO 登陆功能完成后，这里添加uid
        obj.uid = obj.uid || 0
        let res = await exec(`insert into ${this.tableName} (uid,amount,type,comment,category_id,created_at) values (?,?,?,?,?,?)`, [
            obj.uid,
            obj.amount,
            obj.type,
            obj.comment,
            obj.category_id,
            nowDateTime()
        ])
        return res.result.insertId
    }

    async findOne(id) {
        let res = await exec(`select * from ${this.tableName} where id=?`, [id])
        if (res.result.rows.length > 0) {
            return res.result.rows.item(0)
        }
        return false
    }

    async update(obj) {
        obj.uid = obj.uid || 0
        let res = await exec(`update ${this.tableName} set uid=?,amount=?,type=?,comment=?,category_id=? where id=?`, [
            obj.uid,
            obj.amount,
            obj.type,
            obj.comment,
            obj.category_id,
            obj.id
        ])
        return res
    }

    softDelete(id) {
        return exec(`update ${this.tableName} set is_deleted=?,deleted_at=? where id=?`, [
            Accounts.IS_DELETED,
            nowDateTime(),
            id
        ])
    }
}