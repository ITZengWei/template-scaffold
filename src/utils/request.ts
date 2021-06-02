import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message, Modal } from 'antd'
import { getToken } from './cookie'
import store from '../store/index'
import config from '../config'
import { combineURL } from './tool'
import { handleLogout } from '../store/module/user/actionCreators'

/** 响应数据接口 */
export interface IResponseData<T = any> {
  /** 状态码 */
  code: number

  /** 响应数据 */
  data: T

  /** 提示信息 */
  msg: string
}

/** 用户自定义全局配置 */
const useDefaultConfig: AxiosRequestConfig = {
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
}

/** 设置axios默认配置*/
axios.defaults = Object.assign({}, axios.defaults, useDefaultConfig)

/** 初始化默认的请求配置 */
const service = axios.create({
  baseURL: config.API_URL,
  /** TODO 会造成的问题 https://www.it1352.com/1086516.html */
  // withCredentials: true,
})

/** 设置请求拦截器 */
service.interceptors.request.use((config: AxiosRequestConfig) => {
  /** 获取是否存在 token */
  const token = getToken()

  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
})

/** 设置响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse<IResponseData>) => {
    /** 链式调用 */
    if (!response.data) {
      return Promise.resolve(response)
    }

    /** 登录过期 */
    if (response.data.code === config.LOGIN_EXPIRE_CODE) {
      handleGotoLogin(response.data.msg, true)
    }

    /** 登录成功 */
    if (response.data.code === config.SUCCESS_CODE) {
      // return response.data as any TODO 如何设置 data
      return response as any
    }

    console.log(response.data)
    /** 请求成功状态不成功 */
    // alert(response.data.code)

    return Promise.reject(new Error(response.data.msg))
  },
  (error: AxiosError) => {
    console.dir(error)
    /** 服务端有返回响应体 */
    const { response } = error

    if (response) {
      /** 状态码处理 */
      switch (response.status) {
        /** 参数错误或者其他 */
        case 400:
          message.error(response.data.message)
          return Promise.reject({ code: 400, msg: response.data.message })
        /** 当前请求数据需要验证(一般需要登录) 权限 */
        case 401:
          handleGotoLogin('您未登录或者登录失效，请重新登录。', true)
          return Promise.reject({ code: 401, msg: '登录超时请重新登录~' })
        /** 服务器拒绝执行 (token 过期) */
        case 403:
          return Promise.reject({ code: 403, msg: 'token 过期' })
        /** 没有网页了 */
        case 404:
          return Promise.reject({ code: 404, msg: '没有网页' })
        /** 服务器错误 */
        case 500:
          return Promise.reject({ code: 500, msg: '服务异常' })
        /** 其他为止错误直接抛出 */
        default:
          return Promise.reject({
            code: response.status,
            msg: response.statusText,
          })
      }

      /** 服务端无返回响应体 */
    } else {
      /** 断网 */
      if (!window.navigator.onLine) {
        return Promise.reject({ code: 404, msg: '似乎没有网络了' })
      }

      return Promise.reject({ code: error.code, msg: error.message })
    }
  },
)

/** 转到 登录页 */
export function handleGotoLogin(message: string, redirect?: boolean) {
  Modal.confirm({
    title: '系统提示',
    content: message,
    okText: '重新登录',
    onOk() {
      /** 退出登录 TODO 这里什么意思 */
      store.dispatch<any>(handleLogout())

      /** 重定向到登录页面 */
      let newHref = combineURL(
        window.location.origin + '#',
        config.BASENAME,
        '/system/login',
      )

      /** 如果设置了重定向，添加重定向属性 */
      if (redirect) {
        newHref += `?redirectURL=${encodeURIComponent(window.location.href)}`
      }
      window.location.href = newHref
    },
  })
}

/** 请求实例方法 */
const request = <T = any>(config: AxiosRequestConfig) => {
  return service.request<IResponseData<T>>(config)
  // .then(res => {
  //   return res.data
  // })
}

/** 默认请求方法(不含 拦截器) */
export const normalRequest = <T = any>(config: AxiosRequestConfig) => {
  return axios.request<IResponseData<T>>(config)
}

export default request
