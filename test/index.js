/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:14 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-08-06 17:25:58
 */

/**
 * 筛选逻辑
 * 1. 30%的交易日振幅超过4%，换手率超过1%
 * 2. 当前市盈率不超过150，不低于0
 * 3. 名字不带 "ST" "退市" "中国" "银行" "钢"
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
const mock = ["2019-04-01,10.40,10.79,10.80,10.30,168327,178934583,4.85%,7.01",
"2019-04-02,10.77,10.71,10.99,10.65,200292,216954705,3.15%,8.34",
"2019-04-03,10.68,10.92,11.07,10.55,186594,203114093,4.86%,7.77",
"2019-04-04,10.90,10.70,10.91,10.60,161296,172986110,2.84%,6.71",
"2019-04-08,10.70,10.38,10.76,10.22,155393,162888126,5.05%,6.47",
"2019-04-09,10.35,10.56,10.68,10.35,112158,118166653,3.18%,4.65",
"2019-04-10,10.50,10.57,10.75,10.25,138939,145686354,4.73%,5.77",
"2019-04-11,10.65,10.69,10.87,10.47,190043,203691391,3.78%,7.89",
"2019-04-12,10.57,10.37,10.60,10.22,140249,145256300,3.55%,5.82",
"2019-04-15,10.44,10.16,10.56,10.16,89889,93683860,3.86%,3.73",
"2019-04-16,10.11,10.35,10.36,9.87,113015,114164615,4.82%,4.69",
"2019-04-17,10.33,10.41,10.55,10.27,108071,112548308,2.71%,4.49",
"2019-04-18,10.48,10.24,10.58,10.22,113816,118821318,3.46%,4.72",
"2019-04-19,10.28,10.47,10.48,10.10,100922,104595965,3.71%,4.19",
"2019-04-22,10.46,10.43,10.75,10.33,140427,148677629,4.01%,5.83",
"2019-04-23,10.40,9.94,10.40,9.90,143844,144518632,4.79%,5.97",
"2019-04-24,9.91,9.81,10.00,9.50,131433,127830086,5.03%,5.45",
"2019-04-25,9.74,9.12,9.78,8.99,151781,142115135,8.05%,6.3",
"2019-04-26,9.11,8.95,9.18,8.95,87334,79138891,2.52%,3.62",
"2019-04-29,8.55,8.06,8.73,8.06,177436,145440546,7.49%,7.36",
"2019-04-30,7.96,8.16,8.27,7.89,100561,81573713,4.71%,4.14"]
const http = require('http')
const avg = require('./part/avg')
const sum = require('./part/sum')
// 新希望 000876
// const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery18309202047452469173_1564554014277&id=0008762&type=k&authorityType=&_=1564554019261'
// const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery18306849893188199154_1564558721069&id=6037111&type=k&authorityType=&_=1564558725270'
// const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery183091669794183623_1564564976255&id=6038481&type=k&authorityType=&_=1564564978948'
// 海康威视 002415
// const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery18308462963139052693_1564565269959&id=0024152&type=k&authorityType=&_=1564565273364'

// const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery18306217342847241503_1564589240498&id=6010881&type=k&authorityType=&_=1564589244071'
// 暴风集团 300431 
const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery18309695194542497891_1564635409618&id=3004312&type=k&authorityType=&_=1564635412460'
// 顺灏股份 002565
// const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery183030784257573856966_1564638199837&id=0025652&type=k&authorityType=&_=1564638203063'
// ST雏鹰 002477
// const testUrl = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery183019202343044586745_1564640693606&id=0024772&type=k&authorityType=&_=1564640697019'
// 603113
exc(testUrl)
// excMock(mock)
function exc(url) {
    quest(url)
    .then(function({ data, code, name }){
        // 拿到每日交易概况，从里面分析出个股的股性
        const columnConstructor = parser(data)
        avg.countByQuater(columnConstructor, code)
        avg.countByMon(columnConstructor, code)
        avg.countByWeek(columnConstructor, code)
        sum.count(columnConstructor, code)
    }).catch(function(e){
        console.log(__dirname + ':', e)
    })
}
function excMock(mock) {
    const code = 'mock'
    // 拿到每日交易概况，从里面分析出个股的股性
    const columnConstructor = parser(mock)
    avg.countByQuater(columnConstructor, code)
    avg.countByMon(columnConstructor, code)
    avg.countByWeek(columnConstructor, code)
    sum.count(columnConstructor, code)
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

                        const res = dataString && eval(dataString)

                        s(res)
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
