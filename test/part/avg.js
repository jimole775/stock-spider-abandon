const fs = require('fs')
class CountAvg {

    // 每个季度都算一个平均换手率和平均振幅
    // 分别是1月 4月 7月 10月
    countByQuater(list, code) {
        const keyEnmu = {
            1: 1,
            2: 1,
            3: 1,
            4: 2,
            5: 2,
            6: 2,
            7: 3,
            8: 3,
            9: 3,
            10: 4,
            11: 4,
            12: 4,
        }
        const yaerInfoList = this.countBaseOnMon(list, keyEnmu)
        fs.writeFileSync(`./test/db/${code}_trading_activity_by_quarter.json`, JSON.stringify(yaerInfoList), 'utf8')
    }

    countByMon(list, code) {
        const keyEnmu = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            10: 10,
            11: 11,
            12: 12,
        }
        const yaerInfoList = this.countBaseOnMon(list, keyEnmu)
        fs.writeFileSync(`./test/db/${code}_trading_activity_by_mon.json`, JSON.stringify(yaerInfoList), 'utf8')
    }

    countBaseOnMon(list, keyEnmu) {
        const date = list['date']
        const amplitude = list['amplitude']
        const turnover = list['turnover']
        const topPrice = list['topPrice']
        const bottomPrice = list['bottomPrice']
        const yaerInfoList = {}
        date.forEach((element, index) => {
            const date = new Date(element)
            const curYear = date.getFullYear()
            const curMon = date.getMonth() + 1
            const curTopPrice = Number.parseFloat(topPrice[index])
            const curBottomPrice = Number.parseFloat(bottomPrice[index])
            if (!yaerInfoList[curYear]) {
                yaerInfoList[curYear] = {}
            }
            const key = keyEnmu[curMon]
            if (!yaerInfoList[curYear][key]) {
                yaerInfoList[curYear][key] = Object.assign({
                    count: 0,
                    amplitude: 0,
                    amplitude_avg: 0,
                    turnover: 0,
                    turnover_avg: 0,
                    top_price: curTopPrice,
                    bottom_price: curBottomPrice
                })
            }

            if (Object.keys(yaerInfoList[curYear]).shift() == key) {
                let curInfo = yaerInfoList[curYear][key]
                curInfo['count']++
                curInfo['amplitude'] += Number.parseFloat(amplitude[index])
                curInfo['amplitude_avg'] = curInfo['amplitude'] / curInfo['count']
                curInfo['turnover'] += Number.parseFloat(turnover[index])
                curInfo['turnover_avg'] = curInfo['turnover'] / curInfo['count']
                curInfo['top_price'] = curTopPrice > curInfo['top_price'] ? curTopPrice : curInfo['top_price']
                curInfo['bottom_price'] = curBottomPrice < curInfo['bottom_price'] ? curBottomPrice : curInfo['bottom_price']
                yaerInfoList[curYear][key] = curInfo
            }

        })

        return yaerInfoList
    }

    countByWeek(list, code) {
        const date = list['date']
        const amplitude = list['amplitude']
        const turnover = list['turnover']
        const topPrice = list['topPrice']
        const bottomPrice = list['bottomPrice']
        const yaerInfoList = {}
        let prevDate = null
        date.forEach((element, index) => {
            const date = new Date(element)
            const curYear = date.getFullYear()
            const curMon = date.getMonth() + 1
            if (!prevDate) prevDate = date

            if (!yaerInfoList[curYear]) {
                yaerInfoList[curYear] = {}
            }

            // 如果超出一天的间隔，就归到下个星期去
            if (Math.abs(date.getTime() - prevDate.getTime()) > 3600 * 24 * 1000) {
                if (!yaerInfoList[curYear][curMon]) {
                    yaerInfoList[curYear][curMon] = []
                }

                yaerInfoList[curYear][curMon].push({
                    count: 0,
                    amplitude: 0,
                    amplitude_avg: 0,
                    turnover: 0,
                    turnover_avg: 0,
                    top_price: topPrice[index],
                    bottom_price: bottomPrice[index]
                })
            }

            if (!yaerInfoList[curYear][curMon]) {
                yaerInfoList[curYear][curMon] = [{
                    count: 0,
                    amplitude: 0,
                    amplitude_avg: 0,
                    turnover: 0,
                    turnover_avg: 0,
                    top_price: topPrice[index],
                    bottom_price: bottomPrice[index]
                }]
            }
            let curWeek = yaerInfoList[curYear][curMon].pop()
            curWeek['count']++
            curWeek['amplitude'] += Number.parseFloat(amplitude[index])
            curWeek['amplitude_avg'] = curWeek['amplitude'] / curWeek['count']
            curWeek['turnover'] += Number.parseFloat(turnover[index])
            curWeek['turnover_avg'] = curWeek['turnover'] / curWeek['count']
            curWeek['top_price'] = topPrice[index] > curWeek['top_price'] ? topPrice[index] : curWeek['top_price']
            curWeek['bottom_price'] = bottomPrice[index] < curWeek['bottom_price'] ? bottomPrice[index] : curWeek['bottom_price']
            yaerInfoList[curYear][curMon].push(curWeek)

            // 处理完后，缓存date
            prevDate = date
        })

        fs.writeFileSync(`./test/db/${code}_trading_activity_by_week.json`, JSON.stringify(yaerInfoList), 'utf8')
    }
}

module.exports = new CountAvg()