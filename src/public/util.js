/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:43 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-07-30 15:39:32
 */
// const child = require('child_process')
class Util {
    constructor(){
    }
    isImgUrl(src) {
        return /\.(png|jpe*g|gif|icon)$/ig.test(src)
    }
    isHTMLUrl(src) {
        return /\.(s*html*)$/ig.test(src)
    }
    isCSSUrl(src) {
        return /\.(sass|css|less)$/ig.test(src)
    }
    isJSUrl(src) {
        return /\.(js)$/ig.test(src)
    }
    // async ymlParsing(url) {        
    //     console.log('yml path: ', url)
    //     const res = await new Promise(function(s, j){
    //         child.spawn('node', ['./app/public/yamlParser.js', url], null, function(err, out, outerr) {
    //             console.log('err:', err,'out:', out, 'outerr', outerr)
    //             out && s(out)
    //             !out && j('read yml error')
    //         })
    //     })
    //     console.log('yml pars:', res)
    //     return res
    // }
}

module.exports = new Util()
