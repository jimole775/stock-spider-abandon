const baseHq = require('../src/db/base_hq.json')
const baseDisHq = require('../src/db/base_dishq.json')
const temp = require('../temp.json')
const fs = require('fs')

temp.forEach(element => {
    baseHq[element.code] = Object.assign(baseHq[element.code], element)
    console.log(baseHq[element.code])
});

fs.writeFileSync('./src/db/base_hq.json', JSON.stringify(baseHq))