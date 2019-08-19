
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const filePath = process.argv[process.argv.length - 1]
const abs_path = path.resolve(__dirname, filePath)
const file_buffer = fs.readFileSync(abs_path, 'utf8')
const file_string = Buffer.from(file_buffer).toString()
// process.stdout.write('what string has load:')
process.stdout.write(JSON.stringify(yaml.load(file_string)))