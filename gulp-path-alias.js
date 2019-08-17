
var path = require('path')
module.exports = function alias(aliasConfig) {
    return require('gulp-filter')((file) =>{        
        var content = file._contents.toString()
        Object.keys(aliasConfig).forEach((alias)=>{
            var realPath = aliasConfig[alias]
           
            // 判断有没有分隔符
            realPath = /[\/\\]$/.test(realPath) ? realPath : realPath + '/'

            // 动态创建正则
            var requireReg =  new RegExp('require\\([\\\'\\\"]' + alias + '[\\\\/]', 'g')
            var importReg =  new RegExp('from\\s[\\\'\\\"]' + alias + '[\\\\/]', 'g')

            // 进行全局替换
            content = content.replace(requireReg, 'require(\'' + pathCompatible(path.join(__dirname, realPath)))
            content = content.replace(importReg, 'from \'' + pathCompatible(path.join(__dirname, realPath)))
        })
        file._contents = Buffer.from(content)
        return file
    })
    
    function pathCompatible(src){
        /**
         * 因为path.join()返回的路劲片段分隔符为 '\\'
         * 但是在输出之后，就被转义了一次，变成了 '\'
         * 这种情况下，出现'\b \s' 一类的路径会无法解析
         * 所以在这里统一转成 '/'
         */
        return src.replace(/\\/g, '/')
    }
}