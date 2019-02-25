// 应用初始化
// 建表

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase("vina.db", "1.0", "vina database", 200000, () => { console.log("opened database") }, (err) => { console.log("SqlErr:", err) })

// 创建任务表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists remind_task (
        id integer primary key not null,
        uid int not null default 0,  
        title varchar(255) not null default '',
        tomato_number int not null default 0,
        remind_at datetime ,
        remind_type text,
        repeat text, 
        content_id int not null default 0,
        pid int  not null default 0,
        created_at datetime,
        updated_at datetime
    )`)
}, (err) => {
    console.log("创建任务表出错：", err)
})

// 创建文章表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists posts(
        id integer primary key not null,
        uid int not null default 0,
        content text,
        type int not null default 0,
        relation_type not null default 0,
        created_at datetime,
        updated_at datetime
    )`)
}, (err) => {
    console.log("创建文章表出错:", err)
})

// 创建重复表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists task_repeat(
        id integer primary key not null,
        content text
    )`)
}, (err) => {
    console.log("创建重复表出错:", err)
})

// 创建任务/重复关联表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists remind_repeat_relations(
        id integer primary key not null,
        remind_id int,
        repeat_id int
    )`)
}, (err) => {
    console.log("创建任务-重复关联表")
})

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

export default db