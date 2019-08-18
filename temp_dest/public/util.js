/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:43 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-08-04 01:40:18
 */
// const child = require('child_process')
class Util {
    constructor(){
    }
    isImgUrl(src) {
        return /(;base64,)|\.(png|jpe*g|gif|icon)/.test(src)
    }
    isHTMLUrl(src) {
        return /\.(s*html*)/.test(src)
    }
    isCSSUrl(src) {
        return /\.(sass|css|less)/.test(src)
    }
    isJSUrl(src) {
        return /\.(js)/.test(src)
    }
    // async loadYaml(url) {        
    //     console.log('yml path: ', url)
    //     const res = await new Promise(function(s, j){
    //         child.execFile('node', ['./app/public/yamlParser.js', url], null, function(err, out, outerr) {
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
