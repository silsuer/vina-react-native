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