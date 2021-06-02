export interface IConfig {
  /** React Router 前缀名 */
  BASENAME: string

  /** 请求成功状态码 */
  SUCCESS_CODE: number

  /** 登录过期，或者未登录状态码 */
  LOGIN_EXPIRE_CODE: number

  /** 后台接口统一请求地址 */
  API_URL: string

  /** 后台接口文档地址 */
  API_DOC_URL: string

  /** 在接口中拆解数组用的符号 */
  API_SPLIT_ARRAY_ALPHA: string

  /** 本地存储用户token的key */
  TOKEN_KEY: string

  /** 默认主题颜色 */
  theme: 'dark' | 'light'

  /** 项目名称 */
  title: string
}

let API_URL = 'http://api_b_e.smalllb.top/'

/** 本地环境配置 */
if (process.env.NODE_ENV === 'development') {
  // API_URL = 'http://localhost:3077/'
  // API_URL = 'http://192.168.1.106:3077/'
}

const config: IConfig = {
  BASENAME: '/',
  SUCCESS_CODE: 200,
  LOGIN_EXPIRE_CODE: 400,
  API_URL,
  API_DOC_URL: API_URL + 'api-docs/',
  API_SPLIT_ARRAY_ALPHA: '_',
  TOKEN_KEY: 'blog_nest_admin_userInfo',
  theme: 'dark',
  title: '博客管理系统',
}

export default config
