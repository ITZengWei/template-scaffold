const toString = Object.prototype.toString

// const enum OriginType {
//   date = '[object Date]',
//   object = '[object Object]',
// }

export function isDate(val: any): val is Date {
  // 使用类型谓词
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function isAbsoluteURL(url: string): boolean {
  // ^([a-z][a-z\d\+\-\.]*:) ((以字母开头) , a - z 或者数字 + 号 或者 - 号 或者 .)0 个或者多个 再 拼接 ://  忽略大小写
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
  // return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/** 将 url 拼接起来 */
export function combineURL(...urls: string[]): string {
  const matchEnd = new RegExp('/+$')
  const matchStart = new RegExp('^/+')

  return urls.reduce((prevUrl, nextUrl) => {
    // 将 prevUrl 末尾的 / 删除， prevUrl 前面的 / 删除， 再 以  / 拼接
    return prevUrl
      ? prevUrl.replace(matchEnd, '') + '/' + nextUrl.replace(matchStart, '')
      : nextUrl
  })
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }

  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  let result = Object.create(null)

  objs.forEach(obj => {
    if (!isPlainObject(obj)) return

    Object.keys(obj).forEach(key => {
      const val = obj[key]

      if (isPlainObject(val)) {
        if (typeof result[key] === 'undefined') result[key] = {}

        result[key] = deepMerge(result[key], val)
      } else {
        result[key] = val
      }
    })
  })

  return result
}

type throttleAndDebounceProps = (handle: Function, delay?: number) => Function

/** 防抖函数 */
export const debounce: throttleAndDebounceProps = (
  handle: Function,
  delay: number = 300,
) => {
  let timer: any = null

  return function (...args: any[]) {
    // todo this 怎么定义
    clearTimeout(timer)

    timer = setTimeout(() => {
      handle.apply(null, args)
    }, delay)
  }
}

/** throttle 节流函数  */
export const throttle: throttleAndDebounceProps = (handle, delay = 300) => {
  let oldTime = 0
  return function (...args: any[]) {
    let nowTime: number = +Date.now()

    if (nowTime - oldTime > delay) {
      oldTime = nowTime
      handle.apply(null, args)
    }
  }
}
