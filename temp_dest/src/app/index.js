import '@babel/polyfill'

import spillStockModel from 'F:/MyPro/stock-spider/temp_dest/src/app/process/phantomjs/spill-stock-model'
import sniffHomePage from 'F:/MyPro/stock-spider/temp_dest/src/app/process/phantomjs/sniff-home-page'
import sniffGemStocks from 'F:/MyPro/stock-spider/temp_dest/src/app/process/phantomjs/sniff-gem-stocks'

;(async () => {
    await spillStockModel.init()
    await sniffGemStocks.init()
    await sniffHomePage.init()
    const allStocks = await spillStockModel.getAllStocks()
    const stocksWithoutGems = await sniffGemStocks.queryGemStocks(allStocks)
    sniffHomePage.openPage(stocksWithoutGems)
})()
