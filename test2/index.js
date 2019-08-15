
/**
 * 根据所有交易日的详情
 * 计算出一些想要的数据
 */
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
        priceRiseTimes: 0,
        priceFallTimes: 0,
        priceBalanceTimes: 0,
        priceTop: 0,
        priceBottom: 9999,
        amplitudeTop: 0,
        amplitudeAvg: 0,
        riseRateAvg: 0,
        fallRateAvg: 0,
        temp_riseRateSum: 0,
        temp_fallRateSum: 0,
        temp_amplitudeSum: 0,
    }  
    data.forEach((item) => {
        const rowSplit = item.split(',')
        const startPrice = Number.parseFloat(rowSplit[1])
        const endPrice = Number.parseFloat(rowSplit[2])
        const topPrice = Number.parseFloat(rowSplit[3])
        const botPrice = Number.parseFloat(rowSplit[4])
        const amplitude = (topPrice - botPrice) / startPrice
        const turnover = Number.parseFloat(rowSplit[8])
        if (startPrice > endPrice) {
            model.priceRiseTimes ++
        }
        if (startPrice < endPrice) {
            model.priceFallTimes ++
        }
        if (startPrice === endPrice) {
            model.priceBalanceTimes ++
        }
        if (model.priceTop < topPrice) {
            model.priceTop = topPrice
        }
        if (model.priceBottom > botPrice) {
            model.priceBottom = botPrice
        }
        if (model.amplitudeTop < amplitude) {
            model.amplitudeTop = amplitude
        }
        if (endPrice - startPrice > 0) {
            model.temp_riseRateSum += (endPrice - startPrice) / startPrice
        } 
        if (endPrice - startPrice < 0) {
            model.temp_fallRateSum += Math.abs(endPrice - startPrice) / startPrice
        }
        
        model.temp_amplitudeSum += amplitude
    })

    model.riseRateAvg = (Math.round(model.temp_riseRateSum / data.length * 10000) / 100).toFixed(2) + '%'
    model.fallRateAvg = (Math.round(- model.temp_fallRateSum / data.length * 10000) / 100).toFixed(2) + '%'
    model.amplitudeAvg = (Math.round(model.temp_amplitudeSum / data.length * 10000) / 100).toFixed(2) + '%'
    model.amplitudeTop = (Math.round(model.amplitudeTop * 10000) / 100).toFixed(2) + '%'
    delete model.temp_riseRateSum
    delete model.temp_fallRateSum
    delete model.temp_amplitudeSum
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
