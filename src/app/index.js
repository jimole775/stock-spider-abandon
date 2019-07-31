import '@babel/polyfill'

import spillStockModel from './process/phatntomjs/spill-stock-model'
import sniffHomePage from './process/phatntomjs/sniff-home-page'
global.external = {
    token: '',
    allStocks: []
}

;(async () => {
    await spillStockModel.init()
    await spillStockModel.openPage()
    await sniffHomePage.init()
    await sniffHomePage.openPage()
})()
