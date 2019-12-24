import '@babel/polyfill'

import spillStockModel from 'F:/MyPro/stock-spider/temp_dest/src/app/process/phantomjs/spill_stock_model'
import sniffHomePage from 'F:/MyPro/stock-spider/temp_dest/src/app/process/phantomjs/sniff_home_page'
import sniffGemStocks from 'F:/MyPro/stock-spider/temp_dest/src/app/process/phantomjs/sniff_gem_stocks'

;(async () => {
    await spillStockModel.init()
    await sniffGemStocks.init()
    await sniffHomePage.init()
    const allStocks = await spillStockModel.getAllStocks()
    const stocksWithoutGems = await sniffGemStocks.query_gem_stocks(allStocks)
    sniffHomePage.openPage(stocksWithoutGems)
})()
