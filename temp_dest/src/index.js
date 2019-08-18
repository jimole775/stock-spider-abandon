import '@babel/polyfill'

import spillStockModel from 'E:/gitStore/stock-spider/temp_dest/src/process/phantomjs/spill-stock-model'
import sniffHomePage from 'E:/gitStore/stock-spider/temp_dest/src/process/phantomjs/sniff-home-page'
import sniffGemStocks from 'E:/gitStore/stock-spider/temp_dest/src/process/phantomjs/sniff-gem-stocks'

;(async () => {
    await spillStockModel.init()
    await sniffGemStocks.init()
    await sniffHomePage.init()
    const allStocks = await spillStockModel.getAllStocks()
    const stocksWithoutGems = await sniffGemStocks.queryGemStocks(allStocks)
    sniffHomePage.openPage(stocksWithoutGems)
})()
