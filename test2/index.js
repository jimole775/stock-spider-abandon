
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
        priceRiseTimes: 0, // 上升了多少次
        priceFallTimes: 0, // 下跌了多少次
        priceBalanceTimes: 0, // 平盘了多少次
        priceTop: 0, // 最高价
        priceBottom: 9999, // 最低价
        amplitudeTop: 0, // 最高振幅
        amplitudeAvg: 0, // 平均振幅
        riseRateAvg: 0, // 平均上涨的幅度
        fallRateAvg: 0, // 平均下跌的幅度
        minedTimes: 0, // 暴雷次数
        seriesLimitFallTimes: 0, // 连续跌停多少天
        seriesLimitFallStartPrice: 0, // 连续跌停开始的价格
        seriesLimitFallStartDate: null, // 连续跌停开始的日期
        seriesLimitFallRollbackDate: null, // 连续跌停之后，经过多少天之后才恢复元气
        // seriesFallStopDate_afterLimitFall: null, //@todo 暴雷后的止跌日期
        // seriesFallStopPrice_afterLimitFall: 0, //@todo 暴雷后的止跌位
        seriesLimitRiseTimes: 0, // 连续涨停多少天
        seriesLimitRiseStartPrice: 0, // 连续涨停开始的价格
        seriesLimitRiseStartDate: null, // 连续涨停开始的日期
        seriesLimitRiseRollbackDate: null, // 连续跌停之后，经过多少天之后才回落到原来的位置
        // seriesMiniFallTimes: 0, //@todo 记录最长阴跌次数，如果中间出现超过3次连阳，或者股价超过起跌价，或者有涨停，就不记录（）
        seriesBoradTimes: 0,
        temp_riseRateSum: 0,
        temp_fallRateSum: 0,
        temp_amplitudeSum: 0,
        temp_seriesLimitFallTimes: 0,
        temp_seriesLimitRiseTimes: 0,
    }  
    data.forEach((item) => {
        const rowSplit = item.split(',')
        const date = rowSplit[0]
        const startPrice = Number.parseFloat(rowSplit[1])
        const endPrice = Number.parseFloat(rowSplit[2])
        const topPrice = Number.parseFloat(rowSplit[3])
        const botPrice = Number.parseFloat(rowSplit[4])
        const amplitude = (topPrice - botPrice) / startPrice
        const turnover = Number.parseFloat(rowSplit[8])
        const priceDivdRate = (endPrice - startPrice) / startPrice
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
        if (priceDivdRate > 0) {
            model.temp_riseRateSum += priceDivdRate
        } 
        if (priceDivdRate < 0) {
            model.temp_fallRateSum += Math.abs(priceDivdRate)
        }

        // 判断是否有连续3天跌幅超过9%
        if (priceDivdRate < -0.09) {
            model.temp_seriesLimitFallTimes ++

            model.seriesLimitFallTimes = 
                model.temp_seriesLimitFallTimes > model.seriesLimitFallTimes ? 
                model.temp_seriesLimitFallTimes : model.seriesLimitFallTimes

            if (model.temp_seriesLimitFallTimes >= 3) {                
                console.log('跌幅超过9%超3次')
                if (!model.seriesLimitFallStartPrice) model.seriesLimitFallStartPrice = startPrice * 1.1 * 1.1                
                if (!model.seriesLimitFallStartDate) model.seriesLimitFallStartDate = date
                model.minedTimes ++
            }
        } else {
            model.temp_seriesLimitFallTimes = 0
        }

        // 比较暴雷超跌后，股价回滚需要多久
        if (model.seriesLimitFallStartDate && 
            !model.seriesLimitFallRollbackDate &&
            model.temp_seriesLimitFallTimes === 0) {
            if (endPrice >= model.seriesLimitFallStartPrice) {
                model.seriesLimitFallRollbackDate = date
            }
        }

        // 判断是否有连续3天涨幅超过9%
        if (priceDivdRate > 0.09) {
            model.seriesLimitRiseStartPrice = startPrice
            model.temp_seriesLimitRiseTimes ++
            model.seriesLimitRiseTimes = 
                model.temp_seriesLimitRiseTimes > model.seriesLimitRiseTimes ? 
                model.temp_seriesLimitRiseTimes : model.seriesLimitRiseTimes
            if (model.temp_seriesLimitRiseTimes >= 3) {                
                console.log('涨幅超过9%超3次')                
                if (!model.seriesLimitRiseStartPrice) model.seriesLimitRiseStartPrice = startPrice / 1.1 / 1.1                
                if (!model.seriesLimitRiseStartDate) model.seriesLimitRiseStartDate = date
                model.seriesBoradTimes ++
            }
        } else { 
            model.temp_seriesLimitRiseTimes = 0
        }
        
        // 比较连板后，股价回滚需要多久
        if (model.seriesLimitRiseStartDate && 
            !model.seriesLimitRiseRollbackDate &&
            model.temp_seriesLimitRiseTimes === 0) {
            if (endPrice <= model.seriesLimitRiseStartPrice) {
                model.seriesLimitRiseRollbackDate = date
            }
        }

        model.temp_amplitudeSum += amplitude
    })

    model.riseRateAvg = (Math.round(model.temp_riseRateSum / data.length * 10000) / 100).toFixed(2) + '%'
    model.fallRateAvg = (Math.round(- model.temp_fallRateSum / data.length * 10000) / 100).toFixed(2) + '%'
    model.amplitudeAvg = (Math.round(model.temp_amplitudeSum / data.length * 10000) / 100).toFixed(2) + '%'
    model.amplitudeTop = (Math.round(model.amplitudeTop * 10000) / 100).toFixed(2) + '%'

    // // 如果没有暴雷，就置空暴雷的开始价格，没有暴雷，这个值就没有必要存在
    // if (model.minedTimes === 0) {
    //   delete model.seriesLimitFallStartPrice
    // }
    return clearDust(model)
}

function clearDust(model) {
    delete model.temp_riseRateSum
    delete model.temp_fallRateSum
    delete model.temp_amplitudeSum
    delete model.temp_seriesLimitFallTimes
    delete model.temp_seriesLimitRiseTimes
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
