import '@babel/polyfill'

import spillStockModel from './process/phantomjs/spill-stock-model'
import sniffHomePage from './process/phantomjs/sniff-home-page'
// global.external = {
//     token: '',
//     allStocks: []
// }

;(async () => {
    await spillStockModel.init()
    const allStocks = await spillStockModel.getStocks()
    await sniffHomePage.init()
    sniffHomePage.openPage(allStocks)
})()
