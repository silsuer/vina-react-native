import { nowDateTime, exec } from './base'

export class Post {
    static typeText = 0       // 存储纯文本类型的数据
    static typeRichText = 1   // 存储富文本类型的数据
    static typeMarkdown = 2   // 存储markdown类型的数据
    static typeHandAccount = 3  // 存储手帐类型的数据
    static relationTypeNote = 0    // 表示没有任何关联项，就是纯粹的笔记
    static relationTypeRemindTask = 1  // 表示这是关联在提醒事项中的备注
    static relationTypeAccount = 2    // 关联账本
    static relationTypeTomatoTimer = 3  // 关联某个番茄钟
    static relationTypeAnniversary = 4  // 关联某个纪念日
    static relationTypeCountdown = 5    // 关联倒计时

    constructor() {
        this.tableName = 'posts'

    }
}