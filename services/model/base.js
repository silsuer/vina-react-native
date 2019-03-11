import db from '../init'

export const transaction = function () {
    return new Promise((resolve, reject) => {
        return db.transaction((tx) => resolve(tx))
    })
}

export const executeSql = function (tx, sql, values) {
    return new Promise((resolve, reject) => {
        return tx.executeSql(sql, values, (tx, res) => {
            resolve({ transaction: tx, result: res })
        }, (error) => { reject(error) })
    })
}

export const exec = async function (sql, values) {
    return transaction().then((tx) => {
        return executeSql(tx, sql, values)
    })
}





export const nowDateTime = () => { return new Date().toLocaleString('chinese', { hour12: false }) }

// 获取今天 2019/03/01 00:00:00
export const getTodayDateTime = () => {
    return getDateStr(0)
}

// 获取明天 2019/03/02 00:00:00
export const getTomorrowDateTime = () => {
    return getDateStr(1)
}


// 第一个参数是第几天 第二个参数是作为参照物的时间
export const getDateStr = (AddDayCount, nowTime) => {
    let n = nowTime || Date.now()
    var dd = new Date(n);
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "/" + m + "/" + d + ' 00:00:00';
}