import { DOWNLOAD_PATH, ENCODING, handle_url, searchParams } from '../base-config'
import superagent, { SuperAgentRequest } from 'superagent'
import charset from 'superagent-charset'
import urlencode from 'urlencode'
import { URLParams } from './tools-class'
import { searchApi, downloadApi } from '../apis'
import { shell } from 'electron'
import fs from 'fs'
import path from 'path'
import { homedir } from 'os'

const { get }: any = charset(superagent)

interface CharsetRequest extends SuperAgentRequest {
  charset(charset: string): this
}

export const downloadPath = path.resolve(homedir(), DOWNLOAD_PATH)

export function handleGetStreamToContent(handleMethod: CharsetRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    handleMethod
      .timeout(25000)
      .retry(3)
      .buffer(true)
      .charset('gbk')
      .end((err, res) => {
        if (err) {
          return reject(`${err}`)
        }
        resolve(res.text)
      })
  })
}

export async function getBookName(name, page?: number | string): Promise<any> {
  const params = new URLParams({
    ...searchParams,
    page: page || 1,
    searchkey: urlencode(name, ENCODING)
  })
  const handleMethod = get(handle_url.SEARCH).query(params.toString())
  try {
    const content = await handleGetStreamToContent(handleMethod)
    return searchApi.parseSearchDom(content)
  } catch (e) {
    return e
  }
}

export async function downloadBook({ href, title }, changeNumber?: (num) => void): Promise<any> {
  const handleMethod = get(href)
  try {
    const content = await handleGetStreamToContent(handleMethod)
    downloadApi.parseDownloadDom(content, title, changeNumber)
  } catch (e) {
    return e
  }
}

export function existsAndCreate(path: string): void {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export function existsAndRemove(path: string): void {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
}

export function openFilePath(dir?: string) {
  shell.openPath(dir || downloadPath)
}
