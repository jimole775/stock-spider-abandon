/*
 * @Author: Rongxis 
 * @Date: 2019-07-25 14:23:25 
 * @Last Modified by: Rongxis
 * @Last Modified time: 2019-08-08 00:56:54
 */
import phantom from 'phantom'
import util from '../../../public/util'
import urlModel from '../../../../config/url-model.json'
class SpillStockModel {
    constructor() {  
        // this.urlModel = util.loadYaml('../../../../config/url-model.yml')
    }
    init() {
        return new Promise(async (s, j)=>{
            this.instance = await phantom.create()
            this.page = await this.instance.createPage()  
            this.urls = [
                urlModel.url.SHStockList,
                urlModel.url.SZStockList
            ]
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
     * @return [{ code:'', name:'', home:'' }]  
     */
    getAllStocks() {
        return new Promise((s, j) => {  
            let allStocks = [
                // {
                //     code:'',
                //     name:'',
                //     home:''
                // }
            ]         
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
                    // j('加载失败:', url)
                }
                
                // 增加一个随机的延迟，防止被请求被屏蔽
                setTimeout(() => {
                    if (i === this.urls.length - 1) {
                        this.page.close()
                        return s(allStocks)
                    }
                    return loopLoadPage(++ i, s, j)
                }, Math.random() * 1000 + Math.random() * 800 + Math.random() * 500 + Math.random() * 300 )  
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
            })
           
            // 裁剪掉 "非数据" 的后半部    
            return ulContentSpill.split('</a></li>')
        } catch(e) {
            console.log('./src/app/process/phantomjs/spill-stock-model.js: ', e)
            // phantom.exit()
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
                        code: stockCode,
                        name: stockName,
                        home: urlModel.model.StockHome.replace('[stockExchange]', tabType).replace('[stockCode]', stockCode),
                    }
                    stockModel.push(model)
                }
            }

            return stockModel
        } catch(e) {
            console.log('./src/app/process/phantomjs/spill-stock-model.js: ', e)
            // phantom.exit()
        }
    }

    goToken(url) {
        try {
            if (!global.external.token) {
                var matchs = url.match(/[\?|\&]token\=[\d\w]+/ig)
                if (matchs.length) {
                    global.external.token = matchs[0].split('=')[1]
                }
            }
        } catch (error) {
            console.log('./src/app/process/phantomjs/sniff-home-page.js:87 ', error)
            // phantom.exit()
        }     
    }    
    
    // loadYaml(url) {
    //     require('fs', function(){console.log('arv', arguments)})
        // return yaml.load(fs.readFileSync(url, 'utf8'))
        // return new Promise((s, j) => {
        //     fs.readFile(url, 'utf8', (err, content) => {
        //         err && j(err)
        //         !err && s(yaml.load(content))
        //     })
        // })        
    // }
}

export default new SpillStockModel()