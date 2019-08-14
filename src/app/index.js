import '@babel/polyfill'

import spillStockModel from './process/phantomjs/spill-stock-model'
import sniffHomePage from './process/phantomjs/sniff-home-page'
import sniffGemStocks from './process/phantomjs/sniff_gem_stocks'

// global.external = {
//     token: '',
//     allStocks: []
// }

;(async () => {
    await spillStockModel.init()
    await sniffGemStocks.init()
    await sniffHomePage.init()
    const allStocks = await spillStockModel.getAllStocks()
    const stocksWithoutGems = await sniffGemStocks.queryGemStocks(allStocks)
    sniffHomePage.openPage(stocksWithoutGems)
})()
