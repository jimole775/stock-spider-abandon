/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:14 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-07-31 10:30:00
 */

/**
 * 筛选逻辑
 * 1. 60%的交易日振幅超过4%，换手率超过1%
 * 2. 当前市盈率不超过150，不低于0 (这个可以在)
 * 3. 名字不带 "ST" "退市"
 * 4. 交易日总数 超过 半年（365/7*5/2 - [节假日:国庆3 + 劳动3 + 清明3 + 中秋3 + 春节7]）
 * 5. 屏蔽板块 - 房地产，医药，生物，汽车
 */
/**
 * 执行逻辑
 * 从 http://guba.eastmoney.com/remenba.aspx?type=1 拉取所有股票的列表
 * 使用 http://quote.eastmoney.com/sh[stockCode].html 模型来拼接每个股票的主页
 * 监听页面的接口信息
 * 过滤出一条 带有 "EM_UBG_PDTI_Fast" 字段的请求url
 * 使用http来访问url 
 */
// import http from 'http'
// import parser from './parser'
// import amplitudeQuery from './query-amplitude'
// import dealQuery from './query-deal-days'
// import trunoverQuery from './query-turnover'
const http = require('http')
// var parser = require('./parser')
const amplitudeQuery = require('./query-amplitude')
const dealDaysQuery = require('./query-deal-days')
const trunoverQuery = require('./query-turnover')
const fs = require('fs')
const path = require('path')

const argv = process.argv.pop()
const { params } = JSON.parse(argv)

if (params && params.url) {
    exc(params.url)
}

function exc(url) {
    const id = queryStockId(url)
    quest(url)
    .then(function(resData){
        // 拿到每日交易概况，从里面分析出个股的股性
        const columnConstructor = parser(resData)
        // process.stdout.write('node子进程对接成功 ' + JSON.stringify(columnConstructor))
        fs.writeFileSync('./temp-amplitude.json', JSON.stringify(columnConstructor['amplitude']), 'utf8')
        fs.writeFileSync('./temp-turnover.json', JSON.stringify(columnConstructor['turnover']), 'utf8')
        // process.stdout.write('amplitude: ' + JSON.stringify(columnConstructor['amplitude']))
        if (dealDaysQuery(columnConstructor['date']) && amplitudeQuery(columnConstructor['amplitude']) && trunoverQuery(columnConstructor['turnover'])) {
            console.log('高质通过:', id)
        }
    }).catch(function(e){
        console.log('/app/src/process/sniff-hq-stock/index.js: ', e)
    })
}

function quest(url) {
    return new Promise((s, j) => {
        http.get(url, (res) => {
            let rawData = ''
            res.on('data', (chunk) => { 
                rawData += chunk 
            })
            res.on('end', () => {
                try {
                    if (rawData.length) {
                        // console.log('rawData:', rawData)
                        const dataString = rawData.match(/\(\{.*?\}\)/ig)[0]

                        const { data: list } = dataString && eval(dataString)


                        s(list)
                    }
                } catch(e) {
                    j(__dirname + ':' + e)
                    console.error(__dirname + ':', e)
                }
            })
            res.on('error', (e) => {
                j(__dirname  + ':' + e)
                console.error(__dirname + ':', e)
            })
        })
    })
}
function parser(list = []) {
    const enumMap = {
        0: 'date', // '日期'
        1: 'startPrice', // '开盘价'
        2: 'endPrice', // '收盘价'
        3: 'topPrice', // '最高价'
        4: 'bottomPrice', // '最低价'
        5: 'dealCount', // '交易量(手)'
        6: 'dealSum', // '交易额(元)'
        7: 'amplitude', // '振幅'
        8: 'turnover', // '换手率'
    }
    const result = {}
    // [2017-03-28,0.941,0.933,0.941,0.928,2499,232748,1.39%,0.14]
    // ['日期','开盘价','收盘价','最高价','最低价','交易量(手)','交易额(元)','振幅','换手率']
    let loop = list.length
    while(loop --) {
        const dayItem = list[loop].split(',')
        dayItem.forEach((element, index) => {
            if (!result[enumMap[index]]) result[enumMap[index]] = []
            result[enumMap[index]].push(element)
        })
    }
    return result
}
function queryStockId(url){
    return url.match(/[\&\?]id\=\d+/ig)[0].replace(/[\&\?]id\=/, '')
}

module.exports = exc