import { exec, nowDateTime } from "./base";

// 账单表
export class Accounts {
    constructor() {
        this.tableName = "accounts"
    }

    // 添加一条账单，obj包括uid,amount、comment、category_id
    async create(obj) {
        //TODO 登陆功能完成后，这里添加uid
        obj.uid = obj.uid || 0
        let res = exec(`insert into ${this.tableName} (uid,amount,comment,category_id,created_at) values (?,?,?,?,?)`, [
            obj.uid,
            obj.amount,
            obj.comment,
            obj.category_id,
            nowDateTime()
        ])
    }
}