export class URLParams {
  params: any
  constructor(params: any) {
    this.params = params
  }
  toString(): string {
    return Object.keys(this.params).reduce((pre, cur) => {
      return pre + `${cur}=${this.params[cur]}&`
    }, '')
  }
}
