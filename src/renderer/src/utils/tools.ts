import { ElMessageBox } from 'element-plus'

export const hintMessage = (message: string, title?: any, callback?: any): Promise<any> => {
  if (typeof title === 'function') {
    callback = title
    title = undefined
  }
  title = title || '提示'
  return new Promise((resolve) => {
    ElMessageBox.alert(message, title, {
      confirmButtonText: 'OK'
    }).then(() => {
      resolve(callback && callback())
    })
  })
}

export const local_storage = {
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key: string): any {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    } else {
      return ''
    }
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  }
}
