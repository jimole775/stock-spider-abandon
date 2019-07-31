
<h1 id="stockList">全股票列表</h1>
http://guba.eastmoney.com/remenba.aspx?type=1

<h1 id="stockhome">个股主页</h1>
http://quote.eastmoney.com/sh[stockCode].html

# 个股每分钟的交易详情
## 接口模型
http://pdfm2.eastmoney.com/EM_UBG_PDTI_Fast/api/js?id=9009571&TYPE=r&js=fsData1564207053_60126660((x))&rtntype=5&isCR=false&fsData1564207053_60126660=fsData1564207053_60126660

## 来源
- 可以从 [个股主页](#stockhome) 页面产生的接口中过滤出来

# 个股5000个交易日-交易详情数据接口

## 接口模型
http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery1830002129284713296764_1563980518382&id=[stockCode]&type=k&authorityType=&_=1563980522045

## 来源
- 可以从 [个股主页](#stockhome) 页面产生的接口中过滤出来

## 分解
- 单条 *数据样例* 及 *对应字段说明*
``` js
['2015-12-23','16.70','16.51','17.08','16.48','168078','283138224','3.61%','1.71']

['日期','开盘价(元)','收盘价(元)','最高价(元)','最低价(元)','交易量(手)','交易额(元)','振幅(%)','换手率(%)']
```

# 个股每日K线图-图片接口
http://webquotepic.eastmoney.com/GetPic.aspx?id=[stockCode]&imageType=rf&token=44c9d251add88e27b65ed86506f6e5da

## 来源
- 可以从 [个股主页](#stockhome) 页面产生的接口中过滤出来

## 分解
- 可以直接拿到图片

# 个股每日热门资讯-列表接口
http://gbapi.eastmoney.com/webarticlelist/api/Article/Articlelist?callback=jQuery18309721262731501192_1564198407954&code=900940&sorttype=1&ps=24&from=CommonBaPost&deviceid=0.3410789631307125&version=200&product=Guba&plat=Web&_=1564198407977

## 来源
- 可以从 [个股主页](#stockhome) 页面产生的接口中过滤出来

## 分解
- {re:[{...,post_title:""}]}


# 市净率和市盈率接口
http://24.push2.eastmoney.com/api/qt/stock/get?fields=f162,f167&invt=2&fltt=2&ut=bd1d9ddb04089700cf9c27f6f7426281&cb=jQuery172028304362463696187_1564505076485&secid=1.900957&_=1564505077039

## 来源
- 可以从 [个股主页](#stockhome) 页面产生的接口中过滤出来

## 分解
- jQuery172028304362463696187_1564505076485(
{
rc: 0,
rt: 4,
svr: 182482208,
lt: 1,
full: 1,
data: {
f162: 47.17, // 市盈率
f167: 3.07  // 市净率
}
}
)


<h1 id="dealDetail1">个股每日【每笔】交易价格详情-页面</h1>
http://quote.eastmoney.com/f1.html?code=[stockCode]&market=1


<h1 id="dealDetail2">个股每日【每笔】交易价格详情-数据接口</h1>

## 接口模型
http://mdfm.eastmoney.com/EM_UBG_MinuteApi/Js/Get?dtype=all&token=44c9d251add88e27b65ed86506f6e5da&rows=144&cb=jQuery17209422426056116819_1563976899831&page=1&id=6016981&gtvolume=&sort=&_=1563977140110

## 来源
- 可以从 [个股每日每笔交易价格详情页](#dealDetail1) 页面产生的接口中过滤出来

## 分解
- 单条 *数据样例* 以及 *对应字段说明*
``` js
['09:35:25','13.56','32','1','-1','-115','4','3']

['时间','交易价(元)','交易手数','','','较上一笔交易的相差手数','','']
```
