/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:29:52 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-07-30 21:54:31
 */
/**
 * 交易日总数 超过 半年（365/7*5/2 - [节假日:国庆3 + 劳动3 + 清明3 + 中秋3 + 春节5]）
 */

module.exports = function isBeyandHalfYear(list) {
    return list.length >= 365 / 7 * 5 / 2 - (3 + 3 + 3 + 3 + 5)
}