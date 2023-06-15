import * as cheerio from 'cheerio'
import { BOOK_LIST_FLAG, CONCURRENCY, SUFFIX, website } from '../base-config'
import fs from 'fs'
import path from 'path'
import { AsyncResultCallback, mapLimit } from 'async'

import { downloadPath, existsAndCreate, existsAndRemove, handleGetStreamToContent } from '../utils'
import superagent from 'superagent'
import charset from 'superagent-charset'

const { get }: any = charset(superagent)

interface Section {
  title: string
  href?: string
}

/**
 * 获取章节列表
 * @param str
 * @returns {Section[]}
 */
function getSectionList(str: string) {
  const $ = cheerio.load(str)
  const sectionList: Section[] = []
  $('div.box_con > div#list > dl > dt').each((_index, dtEl) => {
    const $dtel = $(dtEl)
    if (!$dtel.text().includes(BOOK_LIST_FLAG)) return

    $dtel.nextAll('dd').each((_index, ddEl) => {
      const $a = $(ddEl).children('a')
      sectionList.push({
        title: $a.text(),
        href: $a.attr('href')
      })
    })
  })
  return sectionList
}

/**
 * 创建文件写入流
 * @param title
 */
function createFileWriteFileStream(title) {
  existsAndCreate(downloadPath)
  const filePath = path.join(downloadPath, `${title}.${SUFFIX}`)
  existsAndRemove(filePath)
  return fs.createWriteStream(filePath)
}

function parseContent(title: string, content: string) {
  console.log('-----', title, '----ok-')

  const $ = cheerio.load(content, { decodeEntities: false })
  const body = $('div#content').text()
  return `
${title}

${body}
  `
}

function formatErrContent(title?: string, href?: string) {
  console.log('-----', title, '----err-')

  return `
${title || '获取标题错误'}

${href || '文档链接错误'}
  `
}

/**
 * 获取章节内容
 * @param item
 * @param next
 */
async function getSectionContent(item: Section, next: AsyncResultCallback<unknown, Error>) {
  const { href, title } = item
  if (!href || !title) {
    return next(null, formatErrContent(title, href))
  }
  const method = get(website + href)
  try {
    const content = await handleGetStreamToContent(method)
    next(null, parseContent(title, content))
  } catch (e) {
    next(null, formatErrContent(title, href))
  }
}

/**
 * 分流下载数据信息
 * @param list
 * @param ws
 * @param changeCurrent
 */
function downloadInfo(list: Section[], ws: any, changeCurrent?: any) {
  mapLimit(
    list,
    CONCURRENCY,
    (item, callback) => {
      const handleNext = (...ags) => {
        changeCurrent && changeCurrent()
        return callback(...ags)
      }
      getSectionContent(item, handleNext)
    },
    (err, result) => {
      if (err) {
        console.log('-----err, ', err)
        throw err
      } else {
        result?.forEach((text) => {
          ws.write(text)
        })
      }

      ws.end()
      changeCurrent && changeCurrent()
    }
  )
}

export function parseDownloadDom(str: string, title, changeProgress: any): any {
  const list = getSectionList(str)
  const len = list.length
  const ws = createFileWriteFileStream(title)
  let currentNum = -1

  function changeCurrent() {
    const num = ((++currentNum / len) * 100) | 0
    changeProgress(num)
  }

  downloadInfo(list, ws, changeCurrent)
}
