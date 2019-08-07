const fs = require('fs')
class CountSum {

    count(list, code) {
        const amplitude = list['amplitude']
        const turnover = list['turnover']

        const result = {
            amplitude:{ },
            turnover:{ }
        }

        amplitude.forEach((amplitudeItem) => {
            const key = amplitudeItem.replace(/\%/,'').split('\.')[0]
            if (result['amplitude'][key] === undefined) {
                result['amplitude'][key] = {
                    count: 0,
                    avg: 0
                }
            }
            result['amplitude'][key]['count'] ++
            result['amplitude'][key]['avg'] = result['amplitude'][key]['count'] / amplitude.length
        })

        turnover.forEach((turnoverItem) => {
            const key = turnoverItem.split('\.')[0]
            if (result['turnover'][key] === undefined) {
                result['turnover'][key] = {
                    count: 0,
                    avg: 0
                }
            }            
            result['turnover'][key]['count'] ++
            result['turnover'][key]['avg'] = result['turnover'][key]['count'] / turnover.length
        })

        fs.writeFileSync(`./test/db/${code}_trading_activity_sum.json`, JSON.stringify(result), 'utf8')
    }

}
module.exports = new CountSum()