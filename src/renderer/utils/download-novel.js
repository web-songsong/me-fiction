const {get} = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const {mapLimit} = require('async')
const path = require('path')

/*获取列表列表信息*/
async function get_list_info(url, keyword = '正文') {
  const novel_list = []
  return get(url).then(res => {
    const $ = cheerio.load(res.text)
    $('.box_con #list  dl>dt').each((key, tagVal) => {
      if ($(tagVal).text().includes(keyword)) {
        $(tagVal).nextAll('dd').each((key, val) => {
          let link_a = $(val).find('a')
          novel_list.push({
            title: link_a.text(),
            href: link_a.attr('href')
          })
        })
      }
    })
    return novel_list
  })
}

/*解析结构*/
async function downloadNovel(local, {href, title}) {
  console.log('ok---', title)
  return get(local + href).then(res => {
    const $ = cheerio.load(res.text, {decodeEntities: false})
    let body = $('.content_read #content')
      .html()
      .trim()
      .split(/<br>|\n/g)
      .slice(1, -4)
      .join('\r\n')
    return `
${title}

${body}
    `
  })
}

/*读取列表数据，进行获取， 写入操作*/
async function get_write({list, local, filePath = './', fileName = 'novel.txt', callback}) {
  const ws = fs.createWriteStream(path.join(filePath, fileName))
  return await mapLimit(
    list,
    10,
    (item, callback) => {
      downloadNovel(local, item).then(str => {
        callback(null, str)
      })
    },
    (err, allData) => {
      if (err) throw err
      console.log('ws')
      allData.forEach(text => {
        ws.write(text)
      })
      console.log('ok')
      ws.end()
      callback && callback()
    }
  )
}

/*运行*/
export default async (config, callback) => {
  console.log('config', config)
  const {url, local, file_path, file_name, keyword} = config
  let list = await get_list_info(url, keyword)
  await get_write({list, local, file_path, file_name, callback})
}