/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:25 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-08-08 00:44:23
 */
/**
 * 过滤掉创业板的股票
 */
import phantom from 'phantom'
import util from '../../../public/util'
import urlModel from '../../../../config/url-model.json'
class SniffGemStocks {
    constructor() {  
        // this.urlModel = util.loadYaml('../../../../config/url-model.yml')
    }
    init() {
        return new Promise(async (s, j)=>{
            this.instance = await phantom.create()
            this.page = await this.instance.createPage()  
            this.url = urlModel.api.GemBoardList
            this.page.on('error', function(e){
                console.log(e)
            })
            this.page.on('onResourceRequested', true, function (requestData, networkRequest) {
                if (util.isImgUrl(requestData.url)  || util.isCSSUrl(requestData.url)) {
                    networkRequest.abort()
                }
            })
            this.page.on('onResourceReceived', true, function(response) {
                // that.goToken(response.url)
                // console.log('token', global.external.token)
            })
            s('SpillStockModel init success')
        })
    }

    /**
     * 
     * @return [{ code:'', name:'' }]  
     */
    getGemStocks() {
        return new Promise(async (s, j) => { 
            const status = await this.page.open(this.url)
            const content = await this.page.property('content')
            if (status === 'success' && content.length) {
                let dataString = content.match(/\(\{.+\}\)/ig)[0]
                dataString = dataString.replace(/f12/ig, 'code').replace(/f14/ig, 'name') 
                const { data: { diff }} = dataString && eval(dataString) 
                s(diff)
            } else {
                console.log('加载失败:', this.url)
                j('加载失败:', this.url)
            }
            this.page.close()
        })
    }

    queryGemStocks(allStocks) {
        return new Promise(async (s, j)=>{
            const gemStocks = await this.getGemStocks()
            let gemStocksLoop = gemStocks.length
            while(gemStocksLoop--) {
                const gemStocksItem = gemStocks[gemStocksLoop]            
                allStocks.forEach((stock, index) => {
                    if(stock.code == gemStocksItem['code']) {
                        allStocks.splice(index, 1)
                    }
                })
            }
            s(allStocks)
        })       
    }
}

export default new SniffGemStocks()