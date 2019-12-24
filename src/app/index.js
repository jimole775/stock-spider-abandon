import '@babel/polyfill'

import spillStockModel from '@phantom/spill_stock_model'
import sniffHomePage from '@phantom/sniff_home_page'
import sniffGemStocks from '@phantom/sniff_gem_stocks'

;(async () => {
    await spillStockModel.init()
    await sniffGemStocks.init()
    await sniffHomePage.init()
    const allStocks = await spillStockModel.getAllStocks()
    const stocksWithoutGems = await sniffGemStocks.query_gem_stocks(allStocks)
    sniffHomePage.openPage(stocksWithoutGems)
})()
