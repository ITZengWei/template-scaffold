import request from '../utils/request'

/** 验证码模块请求Url集合 */
export enum CodeUrls {
  fetchCode = '/updateCode',
}

export enum CodeType {
  /** 注册验证码 */
  register = 10001,

  /** 更改密码 */
  updatePassword = 20001,

  /** 登录 */
  login = 30001,

  /** 微信操作40001 */
  wx = 40001,
}

export interface FetchCodeParams {
  /** 邮箱 */
  // email: string

  /** 验证码类型 */
  codeType: CodeType
}

/* 获取验证码 */
export function fetchCode<T = any>(payload: FetchCodeParams) {
  return request<T>({
    url: CodeUrls.fetchCode,
    method: 'POST',
    data: payload,
  })
}
