/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:36 
 * @Last Modified by:   Rongxis 
 * @Last Modified time: 2019-07-25 14:23:36 
 */

module.exports = function(msg) {
    switch(Object.prototype.toString.call(msg)){
        case '[object Object]':
        case '[object Array]':
            console.log('object like:', JSON.stringify(msg))
            break            
        case '[object Arguments]':
            for (var i = 0; i < msg.length; i ++) {
                console.log('参数列表：', msg[i])
            }
            break
        default:
            // console.log('srouce code msg:', msg.toString())
            break
    }    
}