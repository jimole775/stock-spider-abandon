
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


# 基本面所有字段的接口
http://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287&secid=0.002131&cb=jQuery183014984578807184268_1564676693979&_=1564676719011

## 来源
- 可以从 [个股主页](#stockhome) 页面产生的接口中过滤出来

## 分解
``` js
- jQuery172028304362463696187_1564505076485(
{
rc: 0,
rt: 4,
svr: 182482208,
lt: 1,
full: 1,
data: {
f55: 1,//每股收益
f84: 1,//总股本
f85: 1,//流通股数量
f116: 1,//总市值
f117: 1,//流通市值
f135: 1,//主力净流入
f136: 1,//主力净流出
f137: 1,//主力差值
f162: 1,//市盈率(动)
f167: 1,//市净率
f173: 1,//ROE
f183: 1,//总营收
f184: 1,//同比总营收
f185: 1,//同比净利润
f186: 1,//毛利率
f187: 1,//净利率
f188: 1,//负债率
f190: 1,//每股未分配利润
}
}
)
```