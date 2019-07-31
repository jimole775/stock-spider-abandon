/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:02 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-07-31 10:11:32
 */
/**
 * 60%的交易日换手率超过1%
 */

module.exports = function(list) {
    let loop = list.length
    let baseRate = 1
    let beyandTimes = 0
    while (loop --) {
        const trunoverRate = list[loop]
        if (trunoverRate >= baseRate) beyandTimes ++
    }
    return beyandTimes / list.length >= 0.3
}