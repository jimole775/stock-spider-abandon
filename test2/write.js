
const baseHq = require('../db/base_hq.json')
const baseDisHq = require('../db/base_dishq.json')
const fs = require('fs')

quest('http://50.push2.eastmoney.com/api/qt/clist/get?cb=jQuery1124033573549430679495_1565189323567&pn=1&pz=9999&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:80&fields=f12,f14&_=1565189323650')
.then((data)=>{            
    const wrongStationInHqStocks = queryWrongStationStocks(data)
    fs.writeFileSync('./src/db/base_dishq.json', JSON.stringify(Object.assign(baseDisHq, wrongStationInHqStocks)))
})

function quest(url) {
    return new Promise((s, j) => {
        const ip = Math.random(1 , 254)  
            + "." + Math.random(1 , 254)  
            + "." + Math.random(1 , 254)  
            + "." + Math.random(1 , 254)  
        try{
            require('http').get(url, (req, res) => {
                let data = ''
                req.on('data', (chunk)=>{
                    data += chunk
                })
                req.on('end', ()=>{
                    let dataString = data.toString().match(/\(\{.+\}\)/ig)[0]
                    dataString = dataString.replace(/f12/ig, 'code').replace(/f14/ig, 'name') 
                    const { data: { diff }} = dataString && eval(dataString) 
                    s(diff)
                })
                // let dataString = res.match(/\(\{.+\}\)/ig)[0]
                // dataString = dataString.replace(/f12/ig, 'code').replace(/f14/ig, 'name') 
                // const { data: { diff }} = dataString && eval(dataString) 
                // s(diff)
            })
            // require('superagent').get(url).set('X-Forwarded-For',ip).end((err, {text = ''}) => {
            //     debugger
            //     err && j(err)  
               
            // })
        }catch(e){
            j(e)
        }        
    })
}


function queryWrongStationStocks(gemStocks) {
    const keys = Object.keys(baseHq)
    const wrongStationStocks = {}
    keys.forEach((key) => {
        gemStocks.forEach((gemStock)=>{
            if (gemStock.code == key) {
                console.log('删除创业股：', gemStock.name)
                wrongStationStocks[key] = Object.assign(baseHq[key])
                delete baseHq[key]
            }
        })
    })
    fs.writeFileSync('./src/db/base_hq.json', JSON.stringify(baseHq))
    return wrongStationStocks
}
