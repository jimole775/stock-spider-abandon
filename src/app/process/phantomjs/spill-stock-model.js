/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:25 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-07-30 21:41:50
 */
import phantom from 'phantom'
import util from '../../../public/util'
import urlModel from '../../../../config/url-model.json'
class SpillStockModel {
    constructor(){  
    }

    init(){
        return new Promise(async (s, j)=>{
            this.instance = await phantom.create()
            this.page = await this.instance.createPage()   
            this.urls = [
                urlModel.url.SHStockList,
                urlModel.url.SZStockList
            ]
            this.page.on('onResourceRequested', true, function (requestData, networkRequest) {
                if (util.isImgUrl(requestData.url)  || util.isCSSUrl(requestData.url)) {
                    networkRequest.abort()
                }
            })
            this.page.on('onResourceReceived', true, function(response) {
                // that.goToken(response.url)
                // console.log('token', global.external.token)
            })
            s()
        })
    }

    openPage() {
        return new Promise((s, j) => {  
            let allStocks = []         
            const loopLoadPage = async (i, s, j) => {  
                const url = this.urls[i]
                const status = await this.page.open(url)
                const content = await this.page.property('content')
                
                if (status === 'success' && content.length) {
                    const rightContext = this.queryContent(content)
                    const typeMap = {
                        0: 'sh', // 上海交易所
                        1: 'sz', // 深圳交易所
                    }
                    const stockList = this.spillStockList(rightContext, typeMap[i])                    
                    allStocks = allStocks.concat(stockList)
                } else {
                    console.log('加载失败:', url)
                    j('加载失败:', url)
                }
                
                // 增加一个随机的延迟，防止被请求被屏蔽
                setTimeout(() => {
                    if (i === this.urls.length - 1) {
                        global.external.allStocks = allStocks
                        this.page.close()
                        s()
                        return
                    }
                    loopLoadPage(++ i, s, j)
                }, Math.random() * 300 + Math.random() * 200)  
            }

            loopLoadPage(0, s, j)
        })
    }
    
    
    queryContent(htmlStr) {
        try {
            // 样例
            // .ngblistul2 <a href="topic,600000.html">(600000)浦发银行</a>
            let ulContents = htmlStr.match(/<ul class="ngblistul2( hide)?">.*?<\/ul>/ig)
            let ulContentSpill = ''
            ulContents && ulContents.forEach(ulContent => {
                // 裁剪掉不规则标签
                ulContent = ulContent.replace(/<ul class="ngblistul2( hide)?">/ig, '')
                ulContent = ulContent.replace(/<\/ul>/ig, '')
            
                // 裁剪掉 "非数据" 的前半部
                ulContent = ulContent.replace(/<li><a href="topic,\d+\.html">/ig, '')
            
                // 最后裁剪掉 "()"
                ulContent = ulContent.replace(/\(/g, '')
                ulContent = ulContent.replace(/\)/g, ',')

                ulContentSpill += ulContent
            });
           
            // 裁剪掉 "非数据" 的后半部    
            return ulContentSpill.split('</a></li>')
        } catch(e) {
            console.log('./app/src/spill-stock-model.js: ', e)
            phantom.exit()
        }
    }
    
    spillStockList(stocksTxt, tabType) {  
        try {
            let loop = stocksTxt.length
            let stockModel = []
            while(loop--) {
                let item = stocksTxt[loop]
                let stockCode = item.split(',')[0]
                let stockName = item.split(',')[1]            
                if (stockCode && stockName) {
                    let model = {
                        stockCode: stockCode,
                        stockName: stockName,
                        stockHome: urlModel.model.StockHome.replace('[stockExchange]', tabType).replace('[stockCode]', stockCode),
                    }
                    stockModel.push(model)
                }
            }

            return stockModel
        } catch(e) {
            console.log('./app/src/spill-stock-model.js: ', e)
            phantom.exit()
        }
    }
    goToken(url) {
        try {
            if(!global.external.token){
                var matchs = url.match(/[\?|\&]token\=[\d\w]+/ig)
                if (matchs.length) {
                    global.external.token = matchs[0].split('=')[1]
                }
            }
        } catch (error) {
            console.log('.\app\src\phantom-process\sniff-home-page.js:87 ', error)
            phantom.exit()
        }     
    }    
    
}

export default new SpillStockModel()