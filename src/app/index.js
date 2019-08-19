import '@babel/polyfill'

import spillStockModel from '_phantom/spill-stock-model'
import sniffHomePage from '_phantom/sniff-home-page'
import sniffGemStocks from '_phantom/sniff-gem-stocks'

;(async () => {
    await spillStockModel.init()
    await sniffGemStocks.init()
    await sniffHomePage.init()
    const allStocks = await spillStockModel.getAllStocks()
    const stocksWithoutGems = await sniffGemStocks.queryGemStocks(allStocks)
    sniffHomePage.openPage(stocksWithoutGems)
})()
