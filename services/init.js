// 应用初始化
// 建表

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase("vina.db", "1.0", "vina database", 200000, () => { console.log("opened database") }, (err) => { console.log("SqlErr:", err) })


// db.transaction((tx) => {
//     tx.executeSql(`drop table remind_task`, [], () => {
//         console.log("success")
//     })
// })
// 创建任务表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists remind_task (
        id integer primary key not null,
        uid int not null default 0,  
        title varchar(255) not null default '',
        tomato_number int not null default 0,
        start_date_at datetime,
        end_date_at datetime,
        remind_at datetime ,
        remind_type text,
        repeat text, 
        content_id int not null default 0,
        advance_notify int not null default 0,
        pid int  not null default 0,
        is_deleted int not null default 0,
        created_at datetime,
        updated_at datetime,
        deleted_at datetime
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
    console.log("创建任务-重复关联表失败:", err)
})

// db.transaction((tx) => {
//     tx.executeSql(`drop table tomato_timer`, [], () => {
//         console.log("success")
//     })
// })

// 创建番茄钟历史表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists tomato_timer (
       id integer primary key not null,
       final_status int not null default 0,
       start_at datetime,
       end_at datetime,
       mode varchar(200) not null default 'work',
       relation_task_id int not null default 0,
       post_id int not null default 0
   )`)
}, (err) => {
    console.log("创建番茄钟历史表:", err)
})


// db.transaction((tx) => {
//     tx.executeSql(`drop table push_notification_records`, [], () => {
//         console.log("success")
//     })
// })
// 创建推送通知表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists push_notification_records (
        id integer primary key not null,
        type int,
        time datetime,
        relation_id int not null default 0,
        is_deleted int not null default 0
    )`)
})



// db.transaction((tx) => {
//     tx.executeSql(`drop table pigeonhole`, [], () => {
//         console.log("success")
//     })
// })

// 创建归档管理表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists pigeonhole (
        id integer primary key not null,
        name varchar(255) not null default '',
        color varchar(255) not null default '#000000',
        sequence int not null default 0,
        pid int not null default 0
    )`)
})


// db.transaction((tx) => {
//     tx.executeSql(`drop table pigeonhole_relation`, [], () => {
//         console.log("success")
//     })
// })
// 创建归档关联表
db.transaction((tx) => {
    tx.executeSql(`create table if not exists pigeonhole_relation(
        id integer primary key not null,
        type int not null default 0,
        pigeonhole_id int not null default 0,
        relation_id int not null default 0
    )`)
})


// db.transaction((tx) => {
//     tx.executeSql(`drop table bill_categories`, [], () => {
//         console.log("success")
//     })
// })
// 创建账单分类表
db.transaction((tx)=>{
    tx.executeSql(`create table if not exists bill_categories(
        id integer primary key not null,
        name varchar(200) not null default '',
        icon varchar(200) not null default ''
    )`)
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

// 本地存储
import Storage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

const storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true, // 你可以在构造函数这里就写好sync的方法 // 或是在任何时候，直接对storage.sync进行赋值修改 // 或是写到另一个文件里，这里require引入
});
global.storage = storage




// 设置本地推送
import { PushNotificationIOS } from 'react-native'
var PushNotification = require('react-native-push-notification')

PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
        console.log('TOKEN:', token);
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM (OR FCM) SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },



    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

global.pushNotification = PushNotification

// 对于音效的全局设置
global.musicSetting = {
    start: false,  // 音效默认关闭
    insectsAndBirdsPlayer: null,  // 虫鸣鸟叫播放器
    insectsAndBirdsPlayerVolumn: 0,
    rainPlayer: null,  // 雨声播放器
    rainPlayerVolumn: 0,
    theWavesPlayer: null, // 海浪播放器
    theWavesPlayerVolumn: 0,
    thunderPlayer: null,  // 雷声播放器
    thunderPlayerVolumn: 0,
}


global.log = (str) => {
    console.log(str)
}

export default db