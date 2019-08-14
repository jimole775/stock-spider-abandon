var phantom = require('phantom')
phantom.create().then((instance)=>{
    instance.createPage().then((page)=>{
        page.open('https://mp.weixin.qq.com/cgi-bin/singlesendpage?t=message/send&action=index&tofakeid=oGGIys8eR28urpJfCPyASO-OXUXU&token=820054068&lang=zh_CN').then(function(){

            // $('.emotion_editor.edit_area js_editorArea')

            page.property('content').then(function(pageContent){
                require('fs').writeFileSync('./test.html', pageContent)
                console.log(/edit_area js_editorArea/ig.test(pageContent))
            })
        })
    })
})
