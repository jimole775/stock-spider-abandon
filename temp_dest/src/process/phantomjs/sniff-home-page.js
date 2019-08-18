/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:25 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-08-17 10:43:24
 */
import phantom from 'phantom'
import util from 'E:/gitStore/stock-spider/temp_dest/public/util'
const hqList = require('E:/gitStore/stock-spider/temp_dest/db/base_hq.json') 
const dishqList = require('E:/gitStore/stock-spider/temp_dest/db/base_dishq.json') 
class SniffHomePage {
    constructor() {  
    }
    init(){
        return new Promise(async (s, j) => {
            this.instance = await phantom.create()
            this.page = await this.instance.createPage()
            
            this.page.on('onRrror', function(e){
                console.log('onRrror:', e)
            })
            this.page.on('onResourceRequested', true, function(requestData, networkRequest) {
                if (util.isImgUrl(requestData.url)  || util.isCSSUrl(requestData.url)) {
                    console.log('abort:', requestData.url)
                    networkRequest.abort()
                } else {
                }
            })
            
            this.page.on('onResourceReceived', true, function(response) {
                // http://gbapi.eastmoney.com/webarticlelist/api/Article/Articlelist?callback=jQuery183017469347580371908_1564543843706&code=000876&sorttype=1&ps=36&from=CommonBaPost&deviceid=0.3410789631307125&version=200&product=Guba&plat=Web&_=1564543843819
                // http://pdfm2.eastmoney.com/EM_UBG_PDTI_Fast/api/js?id=9009571&TYPE=K&js=fsData1564493313404_51484267((x))&rtntype=5&isCR=false&authorityType=fa&fsData1564493313404_51484267=fsData1564493313404_51484267
                
                // console.log('获取URL：', response.url)
                if (response.stage === 'start' && /EM_UBG_PDTI_Fast.+&authorityType\=/ig.test(response.url)) {
                    return sniffHQStock('sniff-hq-stock/query-from-all-deal-days.js', { url: response.url })
                    function sniffHQStock(handlerPath, params) {
                        try {
                            return require('child_process').execFile('node', ['./src/app/process/nodejs/' + handlerPath, 
                                JSON.stringify({ params: params })], null,
                                function (err, stdout, stderr) {
                                    console.log("execFileERR:", err)
                                    console.log("execFileSTDOUT:", stdout)
                                    console.log("execFileSTDERR:", stderr)
                                })
                        } catch (error) {
                            console.log('src/app/process/phantomjs/sniff-home-page.js: ', error)
                        }
                    }
                }                
            })            
            s('SniffHomePage init success')
        })
    }
    openPage(allStocks) {
        return new Promise((s, j)=>{
            const loopLoadPage = async (i, s, j) => {

                const stock = allStocks[i]
                // 名字不带 "ST" "退市" "银行" "钢"        
                console.log('加载中...', stock.code, stock.name, stock.home)
                if (!/([A-Z]|退市|银行|钢)/.test(stock.name) && !hqList[stock.code] && !dishqList[stock.code]) {
                    const status = await this.page.open(stock.home)
                    if (status === 'success') {
                    } else {
                        console.log('加载失败:', status, stock.name)
                    }
                    
                    // 增加一个随机的延迟，防止被请求被屏蔽
                    return setTimeout(() => {
                        if (i === allStocks.length - 1) {
                            s('SniffHomePage loopLoadPage end')
                            return this.page.close()                                                 
                        }
                        console.log('轮回...')
                        return loopLoadPage(++ i, s, j)
                    }, Math.random() * 800 + Math.random() * 500 + Math.random() * 300 + Math.random() * 100 + 1000)
                } else {
                    return setTimeout(() => {
                        if (i === allStocks.length - 1) {
                            s('SniffHomePage loopLoadPage end')
                            return this.page.close()                                                    
                        }
                        return loopLoadPage(++ i, s, j)
                    }, 15)
                } 
        
            }
            loopLoadPage(0, s, j)
        })
    }

    goToken(url) {
        try {
            console.log('is got token1')
            if(!global.external.token){
                console.log('is got token2')
                var matchs = url.match(/[\?|\&]token\=[\d\w]+/ig)
                if (matchs.length) {
                    global.external.token = matchs[0].split('=')[1]
                }
                
                console.log('is got token3')
            }
        } catch (error) {
            console.log('/src/app/process/phantomjs/sniff-home-page.js:87 ', error)
            // phantom.exit()
        }     
    }
}

export default new SniffHomePage()