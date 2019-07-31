/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:25:22 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-07-31 10:11:10
 */
/**
 * 60%的交易日振幅超过3%
 */

module.exports = function(list) {
    let loop = list.length
    let baseRate = 3
    let beyandTimes = 0
    while (loop --) {
        const trunoverRate = parseFloat(list[loop])
        if (trunoverRate >= baseRate) beyandTimes ++
    }
    return beyandTimes / list.length >= 0.3
}