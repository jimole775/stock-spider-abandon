/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:25 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-07-31 10:38:47
 */
import phantom from 'phantom'
import util from '../../../public/util'
// import './sniff-hq-stock/index.js'
class SniffHomePage {
    constructor() {  
    }
    init(){
        return new Promise(async (s, j) => {
            this.instance = await phantom.create()
            this.page = await this.instance.createPage()
            this.page.on('onResourceRequested', true, function(requestData, networkRequest) {
                if (util.isImgUrl(requestData.url)  || util.isCSSUrl(requestData.url)) {
                    networkRequest.abort()
                } else {
                    // if (/jquery\d+/i.test(requestData.url)) {
                    //     console.log('request:', requestData.url)
                    // }
                }
            })
            
            this.page.on('onResourceReceived', true, function(response) {
                
                // http://pdfm2.eastmoney.com/EM_UBG_PDTI_Fast/api/js?id=9009571&TYPE=K&js=fsData1564493313404_51484267((x))&rtntype=5&isCR=false&authorityType=fa&fsData1564493313404_51484267=fsData1564493313404_51484267
                if (response.stage === 'start' && /EM_UBG_PDTI_Fast.*?authorityType\=/ig.test(response.url)) {
                    try {
                        require('child_process').execFile('node', ['./app/src/process/sniff-hq-stock/index.js', 
                            JSON.stringify({ params: { url: response.url }})], null,
                            function (err, stdout, stderr) {
                                console.log("err:", err)
                                console.log("execFileSTDOUT:", stdout)
                                console.log("execFileSTDERR:", stderr)
                            });
                    } catch (error) {
                        console.log('/app/src/process/sniff-home-page.js:', error)
                    }
                }
            })
            
            s()
        })
    }
    openPage() {
        return new Promise((s, j)=>{
            const allStocks = global.external.allStocks 
            const loopLoadPage = async (i, s, j) => {

                const stock = allStocks[i]
                // 退市和ST股，不考虑
                if (!/[A-Za-z]/i.test(stock.stockName) && !/退市/.test(stock.stockName)) {
                    console.log('打开的地址：', stock.stockHome)
                    const status = await this.page.open(stock.stockHome)
                    // const content = await page.property('content')
                    
                    if (status === 'success') {
                      
                    } else {
                        j('加载失败:', stock.stockHome)
                        console.log('加载失败:', stock.stockHome)
                    }
                } 
        
                // 增加一个随机的延迟，防止被请求被屏蔽
                setTimeout(() => {
                    if (i === allStocks.length - 1) {
                        s()
                        this.page.close()
                        phantom.exit()
                        return 
                    }
                    loopLoadPage(++ i, s, j)
                }, Math.random() * 300 + Math.random() * 200)
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
            console.log('.\app\src\phantom-process\sniff-home-page.js:87 ', error)
            phantom.exit()
        }     
    }
}

export default new SniffHomePage()