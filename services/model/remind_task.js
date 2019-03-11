import { nowDateTime, exec, getTodayDateTime, getTomorrowDateTime } from './base'
import { Post } from './posts'
import { TomatoTimer } from './tomato_timer'

// 任务模型，创建存储
export class RemindTask {
    constructor() {
        this.tableName = 'remind_task'
        this.structure = {
            uid: null,
            title: 'required',
            tomato_number: 'required',
            remind_type: 'required',
            repeat: 'required',
            remind_at: null,
            content_id: 'required',
            pid: null,
            start_date_at: 'required',
            end_date_at: 'required',
            created_at: 'required',
            updated_at: 'required'
        }
    }
    static modeBell = 1  // 响铃方式
    static modeShock = 2  // 震动
    static modeNotice = 3 // 通知

    static IS_DELETED = 1 // 标记软删除数据

    async create(obj) {
        // 获取带有占位符得插入语句和要插入的数据数组
        // 插入主任务
        const mainInsert = () => {
            insert = this.getInsertSql(obj)
            exec(insert.insert, insert.values).then((res) => {
                if (obj.subTaskData && obj.subTaskData.length > 0) {
                    handleSubTask(res.result.insertId).map((insert, index) => {
                        // 插入子任务
                        exec(insert.insert, insert.values).then((res) => {
                            // 插入成功
                        }).catch((err) => {
                            console.log("子任务插入失败:", err)
                        })
                    })
                }
                return res.result.insertId
            }).then((insertId) => {
                // 触发添加任务事件，定时提醒
                // 返回成功
                return insertId
            }).catch((err) => {
                return false
            })
        }

        // 处理子任务
        const handleSubTask = (pid) => {
            let res = []
            for (let i = 0; i < obj.subTaskData.length; i++) {
                let values = [obj.subTaskData[i].title, obj.subTaskData[i].tomatoNumber, pid, nowDateTime(), nowDateTime()]
                let subInsert = `insert into ${this.tableName} (title,tomato_number,pid,created_at,updated_at) values (?,?,?,?,?)`
                res.push({ insert: subInsert, values: values })
            }
            return res
        }

        // 先判断是否有备注,备注是个对象{type:富文本 markdown 手帐,content 内容,created_at,updated_at,uid 用户id}
        if (obj.comment) {
            // 有备注先把备注插进去
            obj.comment.created_at = nowDateTime()
            obj.comment.updated_at = nowDateTime()
            obj.comment.uid = 0  // TODO 登陆功能完善后这里要改为当前登陆用户
            obj.comment.type = Post.typeText  //TODO 暂时写成纯文本
            obj.comment.relation_type = Post.relationTypeRemindTask  // 关联提醒事项
            //TODO 备注应当加一列，来判断是否是其他类型的关联数据
            exec(`insert into posts (type,content,uid,relation_type,created_at,updated_at) values (?,?,?,?,?)`, [obj.comment.type, obj.comment.content, obj.comment.uid, obj.comment.relationTypeRemindTask, obj.comment.created_at, obj.comment.updated_at])
                .then((res) => {
                    obj.content_id = res.result.insertId
                }).catch((err) => {
                    console.log("插入posts失败:", err)
                }).then(() => {
                    mainInsert()
                })

        } else {
            return mainInsert()
        }

    }


    getInsertSql(obj) {
        obj.created_at = nowDateTime()
        obj.updated_at = nowDateTime()
        let columns = []
        let values = []
        let tmp = []  // 保存占位符
        // 过滤要上传的列
        for (let n in obj) {
            if (this.includeStructure(n)) {
                columns.push(n)
                values.push(obj[n])
                tmp.push('?')
            }
        }
        // 传入obj
        columnsInsert = columns.join(',')
        tmpInsert = tmp.join(',')
        let insert = `insert into ${this.tableName} (${columnsInsert}) values (${tmpInsert})`
        return { insert: insert, values: values }
    }
    includeStructure(column) {
        for (let n in this.structure) {
            if (n === column) {
                return true
            }
        }
        return false
    }

    // page 取出第几页数据
    // limit 取出的条数
    async getUnionAll(pageNumber, limitNumber) {
        const getTaskArray = async (list) => {
            let result = [];
            // 生成一个数组
            let tmpArr = []
            for (let i = 0; i < list.length; i++) {
                tmpArr.push('?')
            }
            let res = await exec(`select remind_task.*,posts.type as post_type,posts.content as comment,pigeonhole.id as pig_id,pigeonhole.color as pig_color from remind_task 
                                  left join posts on remind_task.content_id=posts.id  
                                  left join pigeonhole_relation on pigeonhole_relation.relation_id=remind_task.id and pigeonhole_relation.type=1
                                  left join pigeonhole on pigeonhole_relation.pigeonhole_id=pigeonhole.id and pigeonhole_relation.type=1
                                  where remind_task.is_deleted=0 and remind_task.id in (` + tmpArr.join(',') + `)`, list).catch((err) => {
                console.log("查找提醒任务失败:", err)
            })
            for (let i = 0; i < res.result.rows.length; i++) {
                let row = res.result.rows.item(i)
                row.operation_type = 'remind'
                result.push(row)
            }
            return result

        }
        const getNotesArray = async (list) => {

            let result = []
            let tmpArr = []
            for (let i = 0; i < list.length; i++) {
                tmpArr.push('?')
            }
            let res = await exec(`select * from posts where id in (` + tmpArr.join(',') + `)`, list).catch((err) => {
                console.log("查找笔记数据失败:", err)
            })

            for (let i = 0; i < res.result.rows.length; i++) {
                let row = res.result.rows.item(i)
                row.operation_type = 'post'
                result.push(row)
            }
            return result
        }

        const searchObj = (list, id) => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    return list[i]
                } else {
                    continue
                }
            }
            return false
        }

        const mainLogic = async () => {
            //TODO 当写好其他类型的数据表时，这里要union一下
            let res = await exec(`select * from (
                select rowid,id,created_at,1 AS operation_type from remind_task where remind_task.pid=0 and remind_task.is_deleted=0
                union all
                select rowid,id,created_at,2 AS operation_type from posts
                ) order by created_at desc limit ${limitNumber} offset ${(pageNumber - 1) * limitNumber}`, []).catch((err) => {
                console.log("查找联合数据失败:", err)
            })

            let remind_task_list = []
            let notes_list = []
            let list = []   // 保存每行，当全部查找完成后，根据这里的顺序，重新组装数组
            // 根据里面的数据拆出每个表中的id，然后根据id，分别去对应表中取出全部数据，然后整合到一起
            for (let i = 0; i < res.result.rows.length; i++) {
                let row = res.result.rows.item(i)
                switch (row.operation_type) {
                    case 1:
                        remind_task_list.push(row.id)
                        break
                    case 2:
                        notes_list.push(row.id)
                        break
                }
            }

            // 提醒任务的数据
            let r1 = await getTaskArray(remind_task_list)
            // 笔记数据
            let r2 = await getNotesArray(notes_list)


            let result = []
            // 遍历联合数组，将取出的详细数据重新插入
            for (let i = 0; i < res.result.rows.length; i++) {
                let row = res.result.rows.item(i)
                let obj
                switch (row.operation_type) {
                    case 1:  // 去提醒数组中找
                        obj = r1
                        break
                    case 2:  // 去笔记数组中找
                        obj = r2
                        break
                }
                let s = searchObj(obj, row.id)
                if (s) {
                    result.push(s)
                } else {
                    continue
                }
            }

            return result
        }

        return await mainLogic()
    }

    // 根据传入的id，搜索出对应的数据
    async findOne(id) {
        let result = []
        // 要关联子任务、备注
        let selectSql = `select remind_task.*,posts.id as post_id,posts.type as post_type,posts.content as comment from remind_task 
        left join posts on remind_task.content_id=posts.id
      where remind_task.id=` + id
        // 获取详情和备注
        let res = await exec(selectSql, []).catch((err) => console.log("获取提醒任务详情失败：", err))
        // 获取子任务
        let subRes = await exec(`select * from remind_task where pid=?`, [id]).catch((err) => { console.log("获取子任务详情失败", err) })
        if (res.result.rows.length > 0) {
            result = res.result.rows.item(0)
            result.repeat = JSON.parse(result.repeat)
            result.subTaskData = []
        }

        // 获取今天已经完成了几个番茄
        let selectTodayTaskCountSql = `select count(*) as c from tomato_timer 
                                       where mode=? 
                                       and
                                       relation_task_id=?
                                       and
                                       final_status=?
                                       and 
                                       start_at > ?
                                       and
                                       start_at < ? `


        let todayTaskCount = await exec(selectTodayTaskCountSql, [
            'work',
            result.id,
            TomatoTimer.STAUS_NORMAL_STOP,
            getTodayDateTime(),
            getTomorrowDateTime()
        ]).catch((err) => {
            console.log(`获取id为${result.id}的任务的今日完成番茄数失败:`, err)
        })

        result.current_finish_tomato_number = todayTaskCount.result.rows.item(0).c
        // 遍历子任务
        for (let i = 0; i < subRes.result.rows.length; i++) {
            let row = subRes.result.rows.item(i)
            let obj = {
                id: row.id,
                title: row.title,
                tomatoNumber: row.tomato_number,
            }
            result.subTaskData.push(obj)
        }
        return result
    }

    // 更新
    async update(obj) {
        if (!obj.id) {
            return
        }
        // 根据id取出数据
        let res = await this.findOne(obj.id)

        // 先修改comment
        let commentInserId = 0
        if (obj.comment) {
            if (res.post_id > 0) {  // 更新comment
                await exec(`update posts set type=?,content=? where id=? `, [
                    obj.comment.type,
                    obj.comment.content,
                    res.post_id
                ]).catch((err) => {
                    console.log("更新提醒备注失败:", err)
                })
                commentInserId = res.post_id
            } else {  // 新建comment
                commentInserId = await exec(`insert into posts (uid,content,type,relation_type,created_at,updated_at) values(?,?,?,?,?,?)`, [
                    0,
                    obj.comment.content,
                    obj.comment.type,
                    Post.relationTypeRemindTask,
                    nowDateTime(),
                    nowDateTime()
                ]).then((res) => {
                    return res.result['insertId']
                })
            }

        }

        // 开始准备保存
        // 修改主任务
        let updateSql = `update remind_task set title=?,tomato_number=?,content_id=?,remind_at=?,remind_type=?,repeat=?,updated_at=?,start_date_at=?,end_date_at=? where id=?`
        console.log(obj)

        let mainRes = await exec(updateSql, [
            obj.title,
            obj.tomato_number,
            commentInserId ? commentInserId : 0,
            obj.remind_at,
            obj.remind_type,
            obj.repeat,
            nowDateTime(),
            obj.start_date_at,
            obj.end_date_at,
            obj.id
        ]).catch((err) => { console.log("修改主任务失败:", err) })

        // 删除多余的子任务
        let flag
        for (let i = 0; i < res.subTaskData.length; i++) {
            flag = false
            for (let j = 0; j < obj.subTaskData.length; j++) {
                if (res.subTaskData[i].id === obj.subTaskData[j].id) {
                    flag = true  // 这项没有被删除
                }
            }
            if (flag === false) {
                // 删除这行数据
                // exec(`delete from remind_task where id=?`, [res.subTaskData[i]]).catch((err) => { console.log("移除多余子任务失败：", err) })
                this.softDelete(res.subTaskData[i])
            }
        }
        // 修改/添加子任务
        obj.subTaskData && obj.subTaskData.map((data) => {
            console.log(data)
            // 判断子任务是否存在,存在则修改，不存在则删除
            if (data.id === 0) { // 新建
                exec(`insert into remind_task (title,tomato_number,pid,created_at,updated_at) values (?,?,?,?,?)`, [
                    data.title,
                    data.tomatoNumber,
                    obj.id,
                    nowDateTime(),
                    nowDateTime()
                ]).catch((err) => { console.log("更新主任务时创建新子任务失败:", err) })
            } else {  // 修改
                exec(`update remind_task set title=?,tomato_number=?,updated_at=? where id=?`, [
                    data.title,
                    data.tomatoNumber,
                    nowDateTime(),
                    data.id
                ]).catch((err) => { console.log("更新主任务时更新子任务失败:", err) })
            }
        })
    }


    // 软删除数据
    softDelete(id) {
        return exec(`update ${this.tableName} set is_deleted=?,deleted_at=? where id=?`, [
            RemindTask.IS_DELETED,
            nowDateTime(),
            id
        ])
    }

    save() {

    }
}

