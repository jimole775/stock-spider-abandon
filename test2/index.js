const hq_stocks = require('../src/db/base_hq.json')
const stockCodes = Object.keys(hq_stocks)
loopQuest()
function loopQuest() {
    if (!stockCodes.length) return 
    console.log(stockCodes.length)
    const stockCode = stockCodes.pop()
    const stock = hq_stocks[stockCode]
    if (stock && stock.allDealUrl) {
        quest(stock.allDealUrl).then(({ data, code, name })=>{
            middleHandle(data, code, name)
            setTimeout(() => {
                loopQuest()
            }, Math.random() * 500 + Math.random() * 300 + Math.random() * 100)
        })
    } else {
        loopQuest()
    }    
}

function middleHandle(data, code, name) {    
    writeToDB(spillSingleModel(data, code, name))
}

function spillSingleModel(data, code, name) {
    const model = {
        code,
        name,
        rise:0,
        fall:0,
        balance: 0
    }  
    data.forEach((item) => {
        const rowSplit = item.split(',')
        const startPrice = rowSplit[1]
        const endPrice = rowSplit[2]
        if (startPrice > endPrice) {
            model.rise ++
        }
        if (startPrice < endPrice) {
            model.fall ++
        }
        if (startPrice === endPrice) {
            model.balance ++
        }
    })

    return model
}

function writeToDB(data) {
    writeToDB.tempStore = !writeToDB.tempStore ? [] : writeToDB.tempStore    
    writeToDB.tempStore.push(data)
    !stockCodes.length && require('fs').writeFileSync('./temp.json', JSON.stringify(writeToDB.tempStore))
}

function quest(url) {
    return new Promise((s, j) => {
        const ip = Math.random(1 , 254)  
            + "." + Math.random(1 , 254)  
            + "." + Math.random(1 , 254)  
            + "." + Math.random(1 , 254)  
        try{
            require('superagent').get(url).set('X-Forwarded-For',ip).end((err, {text = ''}) => {
                err && j(err)            
                const dataString = text.match(/\(\{.+\}\)/ig)[0]
                const data = dataString && eval(dataString)
                s(data)
            })
        }catch(e){
            j(e)
        }        
    })
}
