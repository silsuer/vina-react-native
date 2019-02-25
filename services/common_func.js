// 记录常用方法

// 将分钟数转换为小时数
export const convertMinuteToHour = (minutes) => {
    if (minutes < 60) {
        return minutes + 'min'
    }
    // 精确到小数点后两位
    return (minutes / 60).toFixed(2) + 'h'
}

// 将传入的  19:00:00 只返回 19:00
export const convertTimeToManual = (time) => {
    let arr = time.split(":")
    if (arr.length === 3) {
        return arr[0] + ":" + arr[1]
    }
    return time
}