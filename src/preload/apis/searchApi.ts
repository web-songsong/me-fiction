import * as cheerio from 'cheerio'

/**
 * 解析搜索结果
 * @param str
 * @returns {any}
 */
export function parseSearchDom(str): any[] | string {
  //  $ 开头变量为 cheerio 对象
  const $ = cheerio.load(str)

  // 搜索结果有多种情况
  // 1. 搜索结果为空
  // 2. 搜索结果为单个
  // 3. 搜索结果为多个
  // 4. 搜索结果报错

  // 搜索内容区 如果无内容区则为- 搜索结果为单个
  const isError = $('div.blocktitle').text().includes('错误')
  if (isError) {
    return '搜索名称过短'
  }

  const $content = $('div#content')
  const $tbody = $('div#content > table.grid > tbody')
  const $tr = $tbody.children('tr')

  if ($content.length > 0) {
    // 搜索结果为空提示 是否展示
    if ($tr.is('tr#nr')) {
      //   搜索结果为多个
      // 获取对应数据的名称
      const titleMap = $tbody
        .children('tr[align="center"]')
        .children('th')
        .map((_index, element) => $(element).text())
      // 利用数据将名称写入 并且将数据填充
      const list = $tr.filter('tr#nr').map((_index, tr) => {
        const bookData = {}
        $(tr)
          .children('td')
          .each((index, td) => {
            const $td = $(td)
            if (index === 0) {
              const $a = $td.children('a')
              bookData['title'] = $a.text()
              bookData['href'] = $a.attr('href')
              bookData[titleMap[index]] = $a.text()
            } else {
              bookData[titleMap[index]] = $td.text()
            }
          })
        return bookData
      })
      const lastPageNumber = $('div.pages > div.pagelink > a.last').text()
      return [Array.from(list), lastPageNumber]
    } else {
      return '搜索结果为空'
    }
  } else {
    if ($('div.box_con').length) {
      //   搜索结果为单个
      // '文章名称', '最新章节', '作者', '字数', '更新', '状态', 'href', 'title'

      const bookData = {
        ['文章名称']: $(`meta[property="og:novel:book_name"]`).attr('content'),
        ['最新章节']: $(`meta[property="og:novel:latest_chapter_name"]`).attr('content'),
        ['作者']: $(`meta[property="og:novel:author"]`).attr('content'),
        ['字数']: '😁',
        ['更新']: $(`meta[property="og:novel:update_time"]`).attr('content'),
        ['状态']: '😁',
        ['href']: $(`meta[property="og:novel:read_url"]`).attr('content'),
        ['title']: $(`meta[property="og:title"]`).attr('content')
      }
      return [[bookData], 1]
    } else {
      return '搜索结果出错'
    }
  }
}
