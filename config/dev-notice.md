
<h1 id="stockList">全股票列表</h1>
http://guba.eastmoney.com/remenba.aspx?type=1


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
