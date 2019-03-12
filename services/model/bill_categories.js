import { exec } from "./base";

export class BillCategories {
    constructor() {
        this.tableName = 'bill_categories'
    }

    static CUSTOM_TYPE = 1  // 自定义分类的标识

    async create(message) {
        let res = await exec(`insert into ${this.tableName} (name,type) values(?,?) `, [message, BillCategories.CUSTOM_TYPE])
        if (res.result.insertId > 0) {
            return res.result.insertId
        }
        return 0
    }

    async findAll() {
        let res = await exec(`select * from ${this.tableName}`)
        let r = []
        for (let i = 0; i < res.result.rows.length; i++) {
            let row = res.result.rows.item(i)
            r.push(row)
        }
        return r
    }
}