> 本项目的代码仓库地址:  [https://github.com/ITZengWei/template-scaffold/tree/react17-admin](https://github.com/ITZengWei/template-scaffold/tree/react17-admin)

# 模板的搭建
![](https://cdn.nlark.com/yuque/0/2021/jpeg/21501578/1622985998994-4e294c39-12c4-40fb-b5f5-a76df62717ed.jpeg)# 初始化项目
## 通过CRA创建一个TypeScript项目
> 如果在安装过程中出现错误，我们需要重新下载`create-react-app`​
> 如果在安装不上`create-react-app`，我们需要找到全局所在目录，进行手动删除再安装。踩坑了这里 = =

```git
# 详情查看官方文档: https://create-react-app.dev/docs/adding-typescript/
$ npx create-react-app my-app --template typescript
```
## 通过prettierrc实现代码格式化


- 创建`.prettierrc`文件
> `prettierrc`常用配置设置，详情参考官方文档

```
// .prettierrc
{
    // tab缩进大小,默认为2
    "tabWidth": 4,
    // 使用tab缩进，默认false
    "useTabs": false,
    // 使用分号, 默认true
    "semi": false,
    // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
    "singleQuote": false,
    // 行尾逗号,默认none,可选 none|es5|all
    // es5 包括es5中的数组、对象
    // all 包括函数对象等所有可选
    "TrailingCooma": "all",
    // 对象中的空格 默认true
    // true: { foo: bar }
    // false: {foo: bar}
    "bracketSpacing": true,
    // JSX标签闭合位置 默认false
    // false: <div
    //          className=""
    //          style={{}}
    //       >
    // true: <div
    //          className=""
    //          style={{}} >
    "jsxBracketSameLine": false,
    // 箭头函数参数括号 默认avoid 可选 avoid| always
    // avoid 能省略括号的时候就省略 例如x => x
    // always 总是有括号
    "arrowParens": "avoid"
}
```

- 设置保存的时候格式化
```
.vscode/settings.json
{
  "editor.formatOnSave": true,
   "[javascript]": {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "files.autoSave": "onWindowChange"
}
```
## 调整项目目录
> 我们对项目`src`目录进行语义化命名，方便我们后期维护

```
src.
├─api # 存放后台接口方法
├─assets # 本地资源
├─config # 网站配置
├─hooks # 自定义钩子函数
├─layouts # 网站布局容器
├─routes # 路由信息
├─store # redux 全局数据
├─styles # 样式
├─views # 页面
└─utils # 工具
```
## 声明网站一些配置项
```typescript
// src/config/index.ts

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
```
## 封装 axios 请求
> 在项目中，我们会多次发送网络请求，而返回的数据我们需要过滤，还有一些公共的部分，如果一个一个在页面写会造成代码冗余，我们需要把这一部分逻辑封装起来。

```typescript
// src/utils/request.ts

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message, Modal } from 'antd'
import NProgress from 'nprogress'
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
  NProgress.start()

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
    NProgress.done()

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

    /** 请求成功状态不成功 */
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
}

export default request
```
### 管理本地token
> 我们使用了`[js-cookie](https://www.npmjs.com/package/js-cookie)`来管理本地token, 具体封装代码如下

```typescript
// src/utils/cookie.ts

import cookie from 'js-cookie'
import config from '../config'

export const setToken = (token: string) => cookie.set(config.TOKEN_KEY, token)

export const getToken: () => string = () => cookie.get(config.TOKEN_KEY) ?? ''

export const removeToken = () => cookie.remove(config.TOKEN_KEY)

declare global {
  interface Window {
    setToken: any
    getToken: any
    removeToken: any
    cookie: any
  }
}

window.setToken = setToken
window.getToken = getToken
window.removeToken = removeToken
window.cookie = cookie
```
### handleLogout函数说明
> 该方法主要是清除用户信息、本地token、以及设置登录状态

​

### combineURL函数说明
> 该方法可以让自动消出多余的 `/`，例如: `www.baidu.com/` + `/demo` 转换为 `www.baidu.com/demo` 

```typescript
// src/utils/tool.ts

// ...

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
```
# 搭建应用级基础布局
## 登录访问页面的控制
​

> 在网站中，如果用户没有登录，那么该用户只能访问一些公共的页面，反之登录成功我们才把它展示给用户。

​

> 需求: 在用户没有登录的情况下，访问 `Dashboard`页面的时候，我们重定向到`Login`页面, 登录成功我们才让用户去访问

​

### 在什么时机我们才知道用户登录过呢？
​

> 网站中，我们是通过 jwt 的形式，传给后端用户的信息。

​


- 我们通过客户端`token`调用用户接口，如果能查到这个人，我们就认为已登录。
- 用户在输入账号密码去登录并且成功后，我们也认为这个时候已登录。



### 根据token去判别登录
我的想法是: 在网站加载的时候，先去请求用户信息，拿到了用户信息，我们传给子组件。子组件根据数据去做相应的处理。转换为流程图如下:


实现步骤为：

- 创建一个用于初始化的容器
- 在容器中发送请求，得到用户数据
- 将用户数据传递给子组件



这里我们通过`[react-router-config](https://www.npmjs.com/package/react-router-config)`这个开源依赖实现我们路由的配置。
`redux` 相关钩子可以参考官方文档: [https://react-redux.js.org/api/hooks#recipe-useshallowequalselector](https://react-redux.js.org/api/hooks#recipe-useshallowequalselector)
​

#### 创建`InitLayout`布局组件
```typescript
// src/layouts/init-layout

import { FC, useEffect, Suspense, memo } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import { renderRoutes } from 'react-router-config'
import { IUserInfo } from '../store/module/user/reducer'
import { UserUrls } from '../api/user'
import LayoutLoading from '../components/loading/layout-loading'
import useActions from '../hooks/use-actions'
import useShallowEqualSelector from '../hooks/use-shallow-equal-selector'
import {
  handleFetchUserInfoFailed,
  handleFetchUserInfoSuccess,
  handleToggleEnterLoading,
  SuccessResult,
} from '../store/module/user/actionCreators'
import { getUserType } from '../utils/person'
import { normalRequest } from '../utils/request'
import config from '../config'
import { combineURL } from '../utils/tool'


// Step1: 创建一个用于初始化的容器

/**
 * 初始化布局
 * 1. 根据 token 获取用户信息
 * 2. 有用户信息，初始化一些属性，没有的话去登录页
 */
const InitLayout: FC<RouteConfigComponentProps> = memo(props => {
  // 这里我们通过 自定义钩子，从 redux中获取加载状态，以及token
  const { enterLoading, token } = useShallowEqualSelector<IStoreProps>(
    state => {
      const { enterLoading, token } = state.user

      return { enterLoading, token }
    },
  )

  // 一个一个通过 dispatch + bindActionCreator的形式有点麻烦我们就封装起来了
  const [toggleEnterLoading, fetchUserSuccess, fetchUserFailed] = useActions([
    /** 切换进场动画 */
    handleToggleEnterLoading,

    /** 获取用户信息成功 */
    handleFetchUserInfoSuccess,

    /** 获取用户信息失败 */
    handleFetchUserInfoFailed,
  ]) as IActionCallback

  useEffect(() => {
    /** 设置 enterLoading 为 true */
    toggleEnterLoading(true)

    
    // Step2: 在容器中发送请求，得到用户数据
    /** 获取用户信息 */
    normalRequest<IUserInfo>({
      url: combineURL(config.API_URL, UserUrls.fetchUserInfo),
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        const { data } = res.data

        /** 获取用户信息成功：拿到用户信息，设置用户的角色 */
        const result: SuccessResult = {
          userInfo: data,
          role: getUserType(data),
        }
        
        // Step3: 将用户数据传递给子组件
        fetchUserSuccess(result)
      })
      .catch(e => {
        /** 不做任何操作交给子组件来去处理 */
      
      	/** 您也可以 获取用户信息失败：设置用户信息为空，登录状态为假，清空token，重定向到登录页 */
      	// fetchUserFailed()
        // props.history.replace('/system/login')
      })
      .finally(() => {
        /** 设置 enterLoading 为 false */
        toggleEnterLoading(false)
      })
  }, [toggleEnterLoading, fetchUserSuccess, fetchUserFailed])

  if (enterLoading) {
    return <LayoutLoading />
  }

  return (
    // Suspense 让组件为加载中状态
    <Suspense fallback={<LayoutLoading />}>
      <div className="">{renderRoutes(props.route?.routes)}</div>
    </Suspense>
  )
})

```


#### 自定义`useShallowEqualSelector`实现
```typescript
import { IStoreState } from './../store/types'
import { useSelector, shallowEqual } from 'react-redux'

interface ISelector<R> {
  (sRate: IStoreState): R
}

/** 浅比较获取 store信息 */
export default function useShallowEqualSelector<R = any>(
  /** 通过返回值获取store */
  selector: ISelector<R>,
): R {
  return useSelector<IStoreState, R>(selector, shallowEqual)
}
```


#### 自定义`useActions`实现
```typescript
// src/hooks/use-actions.ts

import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { IAction, AsyncAction } from '../store/types'

interface ActionCb {
  /** 同步行为 && 异步行为 TODO bindActionCreators 能弄异步行为吗? */
  (...args: any[]): AsyncAction | IAction
}

/** 绑定一个或多个actions */
export default function useActions(
  /** 行为集合 */
  actions: ActionCb[] | ActionCb,
  /** 更新依赖 */
  deps?: any[],
): any {
  /** 拿到 redux 中的 dispatch */
  const dispatch = useDispatch()

  /** 依赖收集 */
  deps = deps ? [...deps, dispatch] : [dispatch]

  return useMemo(() => {
    if (Array.isArray(actions)) {
      return actions.map(action => bindActionCreators(action, dispatch))
    }

    return bindActionCreators(actions, dispatch)
  }, deps)
}
```
#### normalRequest实现
> 这里我们重新 `new` 出一个 `axios`实例，原因在于公共的 `axios`实例中配置了一些拦截器，以及未登录的提示消息，而这里就算我们没有登录，我们也不必要提示过多信息。只需要修改数据或重新跳转`Login`页就行

```typescript
// src/utils/request.ts

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

/** 响应数据接口 */
export interface IResponseData<T = any> {
  /** 状态码 */
  code: number

  /** 响应数据 */
  data: T

  /** 提示信息 */
  msg: string
}

// ...

+ /** 默认请求方法(不含 拦截器) */
+ export const normalRequest = <T = any>(config: AxiosRequestConfig) => {
+   return axios.request<IResponseData<T>>(config)
+ }
```
#### 将InitLayout 挂载到页面中
```typescript
/**
 * 布局相关路由
 */
/** 引入初始化布局(用于获取用户信息，初始化网站) */
import InitLayout from '../layouts/init-layout'

const routes: IRoute[] = [
	{
    path: '/',
    meta: { title: '初始化' },
    component: InitLayout,
    // 子路由信息
    routes: [
    	// ...
    ]
  }
]

export default routes
```


### 登录成功后重置登录状态
> 我们在登录后手动重置登录信息，并且让页面跳转到`dashboard`来完成这个需求
> 这里我们对视图代码简写

```typescript
import { FC, memo, useMemo, useState } from 'react'
import { Spin, Form, Input, Button, message, Grid } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'
import Texty from 'rc-texty'
import 'rc-texty/assets/index.css'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { LoginWithRegisterContainer, BrandWra, FormAreaWra } from './style'
import { loginRequest } from '../../../api/user'
import { IStoreState } from '../../../store/types'
import { IUserInfo } from '../../../store/module/user/reducer'
import {
  handleSetRole,
  handleSetToken,
  handleChangeUserInfo,
  handleSetIsLogin,
} from '../../../store/module/user/actionCreators'
import { getUserType } from '../../../utils/person'
import { throttle } from '../../../utils/tool'

interface LoginProps {
  /** 是否登录 */
  isLogin: boolean

  /** 登录成功 */
  loginSuccess: (successResult: LoginRequestResult) => void
}

const Login: FC<LoginProps> = props => {
  const { isLogin, loginSuccess } = props
  const [isLoading, setLoading] = useState(false)

  const onFinish = useMemo(() => {
    return throttle((result: LoginFormResult) => {
      setLoading(true)
      loginRequest<LoginRequestResult>(result)
        .then(res => {
          setLoading(false)
          loginSuccess(res.data.data)
        })
        .catch(error => {
          setLoading(false)
          message.error(error.msg)
        })
    }, 1200)
  }, [loginSuccess]) as (values: any) => void

  if (isLogin) {
    return <Redirect to="/" />
  }

  return (
    <LoginWithRegisterContainer>
      // ...
      <FormAreaWra>
        <Spin spinning={isLoading}>
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              className="formArea__item"
              name="account"
              rules={[{ required: true, message: '账号不能为空!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="账号或手机号"
              />
            </Form.Item>
            <Form.Item
              className="formArea__item"
              name="psw"
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="密码"
              />
            </Form.Item>
            <div className="to-login">
              没有账号?
              <Button type="link">
                <Link to="/system/register" replace>
                  立即注册
                </Link>
              </Button>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
  
  
  				// ... 
        </Spin>
      </FormAreaWra>
    </LoginWithRegisterContainer>
  )
}

const mapState = (store: IStoreState) => {
  const { isLogin } = store.user

  return {
    isLogin,
  }
}

const mapDispatch = (dispatch: Dispatch) => {
  return {
    /** 登录成功 */
    loginSuccess(successResult: LoginRequestResult) {
      const { token, userInfo } = successResult

      dispatch(handleSetToken(token))
      dispatch(handleSetRole(getUserType(userInfo)))
      dispatch(handleChangeUserInfo(userInfo))
      dispatch(handleSetIsLogin(true))
    },
  }
}

export default connect(mapState, mapDispatch)(Login)
```
> 在`onFinish`函数内部我们登录成功后，手动调用了`loginSuccess`，重置了 `redux` 中的用户信息。
> 在`Login`内部我们判别是否登录，登录跳转到网站 `/`

#### 将`mapState`、`mapDispatch`通过`hooks`的方式实现
​

值得注意的是，在`react-redux v7.1.0+` 以后支持`useSelector`、`useDispatch`、`useStore`等钩子。
​

> 了解更多请参考官方API: [https://react-redux.js.org/api/hooks](https://react-redux.js.org/api/hooks)

​

现在我们开始使用`hooks`的方式写
```typescript
// ...

- import { connect } from 'react-redux'
/** 导入Hooks api */
+ import { useDispatch, useSelector } from 'react-redux'

const Login: FC = (props) => {
	// ...
  - const { isLogin, loginSuccess } = props
  
  // useSelector 支持 两个两个参数的泛型 
  // useSelector<TState = DefaultRootState, TSelected = unknown> 一个根数据、一个目标返回数据
  + const isLogin = useSelector<IStoreState, Boolean>(state => state.user.isLogin)
  
  // 通过 useDispatch 获取 dispatch 函数，因为这里不需要传递给子组件，我们就不通过 useCallback 包裹
  const dispatch = useDispatch()
 	const loginSuccess = (successResult: LoginRequestResult) => {
    const { token, userInfo } = successResult

    dispatch(handleSetToken(token))
    dispatch(handleSetRole(getUserType(userInfo)))
    dispatch(handleChangeUserInfo(userInfo))
    dispatch(handleSetIsLogin(true))
  }
  
  // ...
}

// 注释原有的,改为直接导出 Login
export default Login

/*

const mapState = (store: IStoreState) => {
  const { isLogin } = store.user

  return {
    isLogin,
  }
}

const mapDispatch = (dispatch: Dispatch) => {
  return {
    /** 登录成功 */
    loginSuccess(successResult: LoginRequestResult) {
      const { token, userInfo } = successResult

      dispatch(handleSetToken(token))
      dispatch(handleSetRole(getUserType(userInfo)))
      dispatch(handleChangeUserInfo(userInfo))
      dispatch(handleSetIsLogin(true))
    },
  }
}

export default connect(mapState, mapDispatch)(Login)

*/

```
### 动态访问控制
> 功能介绍: 由于这个是一个后台项目、对于用户没有登录的情况下，我们能让用户访问一下路由

- 系统路由
   - `Login` 登录页。(登录页有所不同，如果用户已经登录，我们会命令式跳转到项目根页面，根据项目需要调整)
   - `Register`注册页
- 异常路由
   - `NotFound`404 页面
   - `Forbidden` 无权限 页面



> 对于用户已登录的情况下，我们暂且称之为业务路由

#### 实现业务路由布局
我们可以使用一个布局包裹起来我们的业务路由，对访问进行集中处理。后面页方便我们扩展
```typescript
// src/layouts/base-layout
import { FC, memo } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RouteConfigComponentProps } from 'react-router-config'
import { renderRoutes } from 'react-router-config'
import { IStoreState } from '../store/types'

const BaseLayout: FC<RouteConfigComponentProps> = memo(props => {
  const { route } = props

  const isLogin = useSelector<IStoreState, Boolean>(state => state.user.isLogin)

  /** 没有登录重定向到登录页 */
  if (!isLogin) {
    return <Redirect to="/system/login" />
  }

  return <div>{renderRoutes(route?.routes)}</div>
})

export default BaseLayout
```
我们通过拿到`redux`中的是否登录标识，如果已经登录我们渲染子路由，反之我们直接重定向到登录页即可


#### 创建一个 业务页面
```typescript
// src/views/analyses/index.tsx

import { FC, memo } from 'react'

const Analyses: FC = memo((props: any) => {
  
  return (
    <div>
      分析页
    </div>
  )
})
export default Analyses
```


##### 修改路由配置
```typescript
// src/routes/index.ts

import { Redirect } from 'react-router-dom'
import { FC, lazy, Suspense } from 'react'
import { IRoute } from './types'

/** 引入分析页面 */
import Analyses from '../views/analyses'

/**
 * 布局相关路由
 */

/** 引入初始化布局(用于获取用户信息，初始化网站) */
import InitLayout from '../layouts/init-layout'

/** 引入系统用户相关布局(登录，注册，找回密码之类的) */
import UserLayout from '../layouts/user-layout'

/** 错误相关布局 (403, 404 之类的) */
import ErrorLayout from '../layouts/error-layout'

/** 引入业务路由布局 */
const BaseLayout = lazy(() => import('../layouts/base-layout'))

/**
 * 系统相关路由
 */

// /** 登录页面 */
const Login = lazy(() => import('../views/system/login'))

/** 注册页面 */
const Register = lazy(() => import('../views/system/register'))

/** 登录页面 */
const RegisterResult = lazy(() => import('../views/system/register-result'))

/**
 * 错误相关路由
 */

/** 404 页面 */
const NotFound = lazy(() => import('../views/error/not-found'))

/** 403 页面 */
const Forbidden = lazy(() => import('../views/error/forbidden'))

/**
 * 业务相关路由
 */

export const GeneratorSuspenseComponent = (Page: FC, Loading?: FC) => {
  return (props: any) => {
    if (typeof Loading === 'undefined') {
      // Loading = CommonLoading
    }

    return (
      <Suspense fallback={<div>loading</div>}>
        <Page {...props} />
      </Suspense>
    )
  }
}

/** 系统路由配置 */
const systemRoute: IRoute = {
  path: '/system',
  component: UserLayout,
  meta: {
    title: '系统路由',
  },
  routes: [
    {
      path: '/system',
      exact: true,
      meta: { title: 'default to Login' },
      render: () => <Redirect to="/system/login" />,
    },
    {
      path: '/system/login',
      component: Login,
      meta: {
        title: '登录',
      },
    },
    {
      path: '/system/register',
      component: Register,
      meta: {
        title: '注册',
      },
    },
    {
      path: '/system/register-result',
      component: RegisterResult,
      meta: {
        title: '注册结果',
      },
    },
  ],
}

/** 异常路由配置 */
const errorRoute: IRoute = {
  path: '/error',
  meta: {
    title: '错误页面',
  },
  component: ErrorLayout,
  routes: [
    {
      path: '/error/404',
      component: NotFound,
      meta: {
        title: 'not found 404',
        icon: '',
      },
    },
    {
      path: '/error/403',
      component: Forbidden,
      meta: {
        title: 'forbidden',
        icon: '',
      },
    },
  ],
}

/** 业务路由配置 */
const businessRoutes: IRoute = {
  path: '/',
  component: BaseLayout,
  meta: {
    title: '业务路由',
  },
  routes: [
    {
      path: '/',
      exact: true,
      meta: { title: 'default to analyses' },
      render: () => <Redirect to="/dashboard/analyses" />,
    },
    {
      path: '/dashboard/analyses',
      component: Analyses,
      meta: {
        title: '分析页',
      },
    },
  ],
}

const routes: IRoute[] = [
  {
    path: '/',
    meta: { title: '初始化' },
    component: InitLayout,
    routes: [
      /** 导入系统路由 */
      systemRoute,

      /** 导入异常路由 */
      errorRoute,

      /** 导入业务路由 */
      businessRoutes,
    ],
  },
]

export default routes
```


#### 实现效果
| **场景** | **登录状态** | **预期结果** |
| --- | --- | --- |
| 登录页 | 未登录 | 留在当前页面 |
| 注册页 | 未登录 | 留在当前页面 |
| 分析页 | 未登录 | 重定向到登录页 |
| 登录页 | 已登录 | 重定向到分析页 |
| 注册页 | 已登录 | 留在当前页面 |
| 分析页 | 已登录 | 留在当前页面 |

#### 通过代码分割对业务路由懒加载优化
> 这里我们使用`lazy`和`Suspense` 使我们的业务懒加载形式引入。官方参考链接： [https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)

​

通过`React.lazy`导入我们的路由组件
```typescript
// src/routes/index.ts

/** 引入分析页面 */
- import Analyses from '../views/analyses'
+ const Analyses = lazy(() => import('../views/analyses'))
```
在`base-layout`中配置`Loading` 状态
```typescript
import { FC, memo, Suspense } from 'react'
// code ...

const BaseLayout: FC<RouteConfigComponentProps> = memo(props => {
  const { route } = props

  // code ...

 // 使用 Suspense 组件 包裹，并且配置 fallback  占位内容 	
  return (
    <div>
      <Suspense fallback={<div>base loading</div>}>
        {renderRoutes(route?.routes)}
      </Suspense>
    </div>
  )
})

export default BaseLayout

```
为了方便测试，我们延迟加载组件
```typescript
// src/routes/index.ts

/** 引入分析页面 */
const Analyses = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('xx')
    }, 10000)
  }).then(() => import('../views/analyses'))
})
```


懒加载效果，
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622707252954-d93d5926-c006-49fb-b58a-d86a4a652ad2.png#clientId=u166d1334-80fe-4&from=paste&height=500&id=uc439336b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=667&originWidth=375&originalType=binary&ratio=1&size=7570&status=done&style=stroke&taskId=u4622628f-05cc-4dc2-8391-0f29ea37dfb&width=281)    ![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622707291151-17c55ee2-2bb7-4f02-b42c-679e6c13111a.png#clientId=u166d1334-80fe-4&from=paste&height=500&id=u58ee18f9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=667&originWidth=375&originalType=binary&ratio=1&size=7330&status=done&style=stroke&taskId=ub5faa677-563b-4db6-b829-14f9c3c3c0a&width=281)


拓展: 如果我们想自定义加载动画，我们可以不用在`base-layout`中添加`Suspense`，而是通过一个方法包裹我们路由组件
```typescript
// src/routes/index.tsx

// code ...


/** 引入分析页面 */
// const Analyses = lazy(() => import('../views/analyses'))

export const GeneratorSuspenseComponent = (Page: FC, Loading?: FC) => {
  return (props: any) => {
    if (typeof Loading === 'undefined') {
      // Loading = CommonLoading
    }

    return (
      <Suspense fallback={<div>loading</div>}>
        <Page {...props} />
      </Suspense>
    )
  }
}

/** 业务路由配置 */
const businessRoutes: IRoute = {
  // code ...
  routes: [
  	// code ...
    {
      path: '/dashboard/analyses',
      component: GeneratorSuspenseComponent(Analyses),
      meta: {
        title: '分析页',
      },
    },
  ],
}

// code ...
```
## 整体布局实现
在网站中有一些布局，我们需要抽离出来。由于在我们这个项目中大部分业务路由中都存在这种布局。那么我们就在`BaseLayout` 中放入我们的`Container`组件
![container.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622715527514-d2bf162b-f7b8-4016-ab0d-e2fcf01ca561.png#clientId=u166d1334-80fe-4&from=paste&height=550&id=u5c725199&margin=%5Bobject%20Object%5D&name=container.png&originHeight=550&originWidth=850&originalType=binary&ratio=1&size=17995&status=done&style=none&taskId=udf179c0b-829a-4907-a290-73855cfe79b&width=850)
### Container盒子组件编写


#### 容器入口组件
```typescript
// src/components/container/index.tsx

import { FC, memo, ReactNode, CSSProperties, useState, useEffect } from 'react'
import { Layout } from 'antd'
import { ContainerWrapper } from './style'
import { SettingStyle } from '../../styles'
import ContainerMain from './container-main'
import ContainerFooter from './container-footer'
import ContainerHeader from './container-header'
import ContainerAside from './container-aside'
import { ContainerContext, ContainerContextProps } from './context'
import useActions from '../../hooks/use-actions'
import { handleLogout } from '../../store/module/user/actionCreators'
import useShallowEqualSelector from '../../hooks/use-shallow-equal-selector'
import { IUserInfo } from '../../store/module/user/reducer'

interface ContainerProps {
  /** 子节点 */
  children: ReactNode
}

const Container: FC<ContainerProps> = memo(props => {
  const { children } = props

  /** 退出登录 */
  const logout = useActions(handleLogout)

  const userInfo = useShallowEqualSelector<IUserInfo>(
    state => state.user.userInfo!,
  )

  const contextValue: ContainerContextProps = {
    logout,
    userInfo,
  }

  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    background: SettingStyle['background-color'],
  }
  const rightContainerStyle: CSSProperties = {
    background: 'inherit',
    padding: '15px 15px 0',
  }

  return (
    <ContainerContext.Provider value={contextValue}>
      <ContainerWrapper>
        <Layout style={containerStyle} hasSider={true}>
          {/* 侧边栏区域 */}
          <ContainerAside />

          <Layout style={rightContainerStyle}>
            {/* 头部区域 */}
            <ContainerHeader />

            {/* 主区域 */}
            <ContainerMain>{children}</ContainerMain>

            {/* 底部区域 */}
            <ContainerFooter />
          </Layout>
        </Layout>
      </ContainerWrapper>
    </ContainerContext.Provider>
  )
})

export default Container
```
#### 容器侧边栏实现
```typescript
// src/components/container/container-aside.tsx

import { FC, memo, useState } from 'react'
import { Layout } from 'antd'
import { SiderProps } from 'antd/lib/layout/Sider'
import logoImg from '../../asserts/images/ContainerAside/banner.png'
import { ContainerAsideInner } from './style'

/** 侧边栏按钮 */
const AsideMenu: FC = memo(() => {
  return <div></div>
})

const ContainerAside: FC = memo(props => {
  const [collapsed, setCollapsed] = useState(false)

  /** 切换关闭与展开回调 */
  const handleCollapse = () => {
    setCollapsed(collapsed => !collapsed)
  }

  /** 根据是否移动端 动态返回 Sider 属性 */
  const getSliderProps: () => SiderProps = () => {
    const sliderProps: SiderProps = {
      collapsible: true,
      collapsed: collapsed,
      onCollapse: handleCollapse,
      breakpoint: 'lg',
    }

    return sliderProps
  }

  return (
    <Layout.Sider {...getSliderProps()}>
      <ContainerAsideInner>
        <div className="info">
          <img className="info__logo" src={logoImg} alt="Banner" />
          <h3 className="info__title">个人博客</h3>
        </div>

        <AsideMenu />
      </ContainerAsideInner>
    </Layout.Sider>
  )
})

export default ContainerAside
```
#### 容器头部实现
```typescript
// src/components/container/container-header.tsx

import { FC, memo, CSSProperties, useContext, useEffect, useState } from 'react'
import { Layout, Avatar, Menu, Dropdown, Row, Col } from 'antd'
import { useHistory } from 'react-router-dom'
import dayJs from 'dayjs'
import { ContainerHeaderInner } from './style'
import {
  AntDesignOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { ContainerContext } from './context'
import defaultAvatar from '../../asserts/images/default.png'
import { SettingStyle } from '../../styles'

/** 头部控制项组件 */
const HeaderOptions: FC = memo(() => {
  const { logout, userInfo } = useContext(ContainerContext)
  const history = useHistory()

  function handleMenuClick(info: any) {
    const { key } = info

    switch (key) {
      case 'info':
        history.push('/account/center')
        break
      case 'setting':
        history.push('/account/setting')
        break
      case 'logout':
        logout()
        break
      default:
        break
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="info" icon={<UserOutlined />}>
        个人中心
      </Menu.Item>
      <Menu.Item key="setting" icon={<SettingOutlined />}>
        个人设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <div className="options">
      欢迎，
      <Dropdown overlay={menu} placement="bottomCenter" arrow>
        <div>
          <Avatar
            className="avatar"
            size={30}
            icon={
              false ? (
                <AntDesignOutlined />
              ) : (
                <img src={defaultAvatar} alt="默认头像" />
              )
            }
          />
          <span className="nickname">{userInfo?.nickname}</span>
        </div>
      </Dropdown>
    </div>
  )
})

/** 头部时间组件 */
const HeaderDate: FC = memo(() => {
  const [dateStr, setDateStr] = useState<string>(() => {
    return dayJs(Date.now()).format('YYYY年MM月DD日 HH:mm')
  })
  useEffect(() => {
    const timer = setInterval(() => {
      setDateStr(dayJs(Date.now()).format('YYYY年MM月DD日 HH:mm:ss'))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <div className="date">{dateStr}</div>
})

const ContainerHeader: FC = memo(props => {
  const headerStyle: CSSProperties = {
    position: 'relative',
    padding: '5px 30px',
    height: 'auto',
    background: SettingStyle['highlight-background-color'],
    boxShadow: ` 0 1px 2px 0 ${SettingStyle['theme-color-shadow']}`,
  }

  return (
    <Layout.Header style={headerStyle}>
      <ContainerHeaderInner>
        <div className="top">
          <div></div>

          {/* 头部控制项 */}
          <HeaderOptions />
        </div>
        <div className="bottom">
          <Row align="middle" style={{ height: '100%' }}>
            <Col md={{ span: 16 }} xs={{ span: 24 }}></Col>
            <Col md={{ span: 7, offset: 1 }} xs={{ span: 0 }}>
              <HeaderDate />
            </Col>
          </Row>
        </div>
      </ContainerHeaderInner>
    </Layout.Header>
  )
})

export default ContainerHeader
```
#### 容器主区域实现
```typescript
// src/components/container/container-main.tsx

import { FC, memo } from 'react'
import { Layout } from 'antd'
import { ContainerMainInner } from './style'

const ContainerMain: FC = memo(props => {
  return (
    <Layout.Content>
      <ContainerMainInner> {props.children}</ContainerMainInner>
    </Layout.Content>
  )
})

export default ContainerMain
```
#### 容器底部实现
```typescript
// src/components/container/container-footer.tsx

import { FC, memo } from 'react'
import { Layout } from 'antd'
import { ContainerFooterInner } from './style'

const ContainerFooter: FC = memo(() => {
  return (
    <Layout.Footer>
      <ContainerFooterInner>
        <span>© 2020 Small's Blog 版权所有</span>
        <span>网站备案号: 赣ICP备20000355号</span>
        <span>
          联系电话： <a href="tel:13407943933">13407943933</a>
        </span>
      </ContainerFooterInner>
    </Layout.Footer>
  )
})

export default ContainerFooter

```
#### 最终效果
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622722879038-9c1e7b2e-ff55-40ff-8b26-473e52a997db.png#clientId=ub2d2deb7-e4ad-4&from=paste&height=937&id=u0050b327&margin=%5Bobject%20Object%5D&name=image.png&originHeight=937&originWidth=1261&originalType=binary&ratio=1&size=100573&status=done&style=none&taskId=u484a58a5-7966-4174-8819-f222445af52&width=1261)


### 实现侧边栏菜单
后台网站中我们通常要实现这种菜单效果，如果通过声明式的方式去写会显得麻烦，也会造成数据的冗余。所以我们有必要把这一部分的逻辑进行封装。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622724491498-fbb8a0fa-106a-4667-b8a0-47953bde8284.png#clientId=ub624ce1a-fa48-4&from=paste&height=713&id=u86b4088d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=950&originWidth=200&originalType=binary&ratio=1&size=71149&status=done&style=none&taskId=u2d88ba57-38e7-4706-b378-6a2ddeae64e&width=150)
#### 定义菜单数据接口约束
```typescript

/** 侧边栏菜单接口 */
export interface IAsideMenu {
  /** 菜单id */
  _id: string

  /** 菜单标题 */
  title: string

  /** 菜单路径 */
  path: string

  /** 菜单图标 */
  icon?: any

  /** 子菜单 */
  children?: IAsideMenu[]
}
```
#### 封装生成菜单函数
```typescript
function renderChildrenMenu(navList: IAsideMenu[]): ReactNode {
  /** 转换为 Menu */
  return navList.map(nav => {
    const { title, path, icon, children } = nav

    /** 如果有多级路由 */
    if (children?.length) {
      return (
        <SubMenu title={title} icon={getAntdIconByIconStr(icon)} key={path}>
          {renderChildrenMenu(children)}
        </SubMenu>
      )
    }

    /** 单层路由 */
    return (
      <Menu.Item key={path} icon={icon}>
        {title}
      </Menu.Item>
    )
  })
}
```
#### 侧边栏菜单组件的编写


我们在 `ContainerAside`把`AsideMenu`实现
```typescript
// src/components/container-aside.tsx


// code ...

/** 侧边栏菜单接口 */
export interface IAsideMenu {
  /** 菜单id */
  _id: string

  /** 菜单标题 */
  title: string

  /** 菜单路径 */
  path: string

  /** 菜单图标 */
  icon?: any

  /** 子菜单 */
  children?: IAsideMenu[]
}

/** 侧边栏按钮 */
const AsideMenu: FC = memo(() => {
  const menuProps: MenuProps = {
    theme: 'dark',
    mode: 'inline',
    onClick(info) {
      const { key } = info
      const pathname = combineURL(config.BASENAME, key as string)

      console.log(pathname)
    },
  }

  const menus: IAsideMenu[] = [
    {
      _id: '100',
      title: '仪表盘',
      icon: <DashboardOutlined />,
      path: 'dashboard',
      children: [
        {
          _id: '101',
          title: '分析页',
          path: '/analyses',
        },
        {
          _id: '102',
          title: '工作台',
          path: '/workplace',
        },
      ],
    },
    {
      _id: '200',
      title: '用户页',
      icon: <UserOutlined />,
      path: '/account',
      children: [
        {
          _id: '201',
          title: '个人中心',
          path: '/center',
        },
        {
          _id: '202',
          title: '个人设置',
          path: '/setting',
        },
      ],
    },
  ]

  function renderChildrenMenu(navList: IAsideMenu[]): ReactNode {
    /** 转换为 Menu */
    return navList.map(nav => {
      const { title, path, icon, children } = nav

      /** 如果有多级路由 */
      if (children?.length) {
        return (
          <Menu.SubMenu title={title} icon={icon} key={path}>
            {renderChildrenMenu(children)}
          </Menu.SubMenu>
        )
      }

      /** 单层路由 */
      return (
        <Menu.Item key={path} icon={icon}>
          {title}
        </Menu.Item>
      )
    })
  }

  return <Menu {...menuProps}>{renderChildrenMenu(menus)}</Menu>
})

// code ...

```
#### 菜单栏默认展开以及高亮的实现
在 `Antd``Menu`组件`selectedKeys`、`defaultOpenKeys`控制高亮和默认展开。[详情参考文档](https://ant.design/components/menu-cn/#API)


掘金还有一篇文章可以参考 [React路由鉴权](https://juejin.cn/post/6844903924441284615?share_token=a7af6582-06b4-48f5-b039-6f6441b0f8e1#heading-40)


我们通过当前网页`path`，去和菜单的`path`去对比，如果相同，我们就认为当前菜单选中
​

我们为 `AsideMenu` 内部添加配置
```typescript
import { FC, memo } from 'react'
import { useLocation } from 'react-router-dom'


const AsideMenu: FC = memo(() => {
  // 通过 react-router-dom 中的 useLocation 钩子，拿到我们当前的路径
	const location = useLocation()
  
  const menuProps: MenuProps = {
    theme: 'dark',
    mode: 'inline',
    selectedKeys: [location.pathname],
    defaultOpenKeys: [location.pathname],
    onClick(info) {
      const { key } = info
      const pathname = combineURL(config.BASENAME, key as string)

      console.log(pathname)
    },
  }
  
  const menus: IAsideMenu[] = [
    {
      _id: '100',
      title: '仪表盘',
      icon: <DashboardOutlined />,
      path: '/dashboard',
      children: [
        {
          _id: '101',
          title: '分析页',
          path: '/dashboard/analyses',
        },
        {
          _id: '102',
          title: '工作台',
          path: '/dashboard/workplace',
        },
      ],
    },
    {
      _id: '200',
      title: '用户页',
      icon: <UserOutlined />,
      path: '/account',
      children: [
        {
          _id: '201',
          title: '个人中心',
          path: '/account/center',
        },
        {
          _id: '202',
          title: '个人设置',
          path: '/account/setting',
        },
      ],
    },
  ]
                           
  function renderChildrenMenu(navList: IAsideMenu[]): ReactNode { // ... }
                           
                           
  return <Menu {...menuProps}>{renderChildrenMenu(menus)}</Menu>
})
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622731532686-57de45f1-c06d-4ec1-94db-fda1350b5221.png#clientId=u8fead5ce-11ac-4&from=paste&height=364&id=u15d9a339&margin=%5Bobject%20Object%5D&name=image.png&originHeight=484&originWidth=201&originalType=binary&ratio=1&size=58418&status=done&style=none&taskId=u9439f999-6ff1-42ba-b8de-52eb502c103&width=151)
运行后，我们发现仪表盘并没有展开，经过调试比如当前路径`/dashboard/analyses`，我们需要设置`defaultOpenKeys = ['/dashboard', '/dashboard/analyses']`


> 思路: 假如当前路径为`/account/center`，我们转换为`['/account', '/account/center']`
> 问题: 如果用户页菜单多了一个`{  id: '203', title: '用户详情', path: '/account/:id' }` 而我们的路径为
> `/account/100` 转换为`['/account', '/account/100']`并不能处理这种情况。这个时候我们可以像正则一样匹配。

我们可以通过`[path-to-regexp](https://www.npmjs.com/package/path-to-regexp)` 这个包来处理
​

我们对当前页面的路由做一下逆向推导，即假设当前页面的路由为`/account/center/info`，我们希望可以同时匹配到 `['/account', '/account/center', '/account/center/info']`
```typescript
/** 将 url 转换为 url数组 (/a/b/c => ['/a', '/b', '/c'])*/
export const url2paths = (url: string) => {
  /** 根据 / 分割 url(并且去除第一个 / ) ['a', 'b', 'c'] */
  const paths = url.slice(1).split('/')

  /** 为每一个成员前面添加一个 '/' */
  return paths.map((item, index) => '/' + paths.slice(0, index + 1).join('/'))
}

url2paths('/account/center/info') // ["/account", "/account/center", "/account/center/info"]
```
对路径进行正则匹配
> 思路：将路径逆向推导后和对所有菜单的路径经行匹配，把匹配成功后的路径保存起来

​

首页我们需要封装一个扁平化菜单的函数
```typescript
/** 获取扁平化的菜单 */
const getFlattenMenus = (menuData: IAsideMenu[]) => {
  return menuData.reduce<IAsideMenu[]>((result, menu) => {
    result.push(menu)
    if (menu.children) {
      result = result.concat(getFlattenMenus(menu.children))
    }
    return result
  }, [])
}
```


借助`[path-to-regexp](https://www.npmjs.com/package/path-to-regexp)` 通过正则匹配路由，我们修改`menuSelectedKeys`中的代码
```typescript
const menuSelectedKeys = useMemo(() => {
  /** url 转换为数组 */
  const paths = url2paths(location.pathname)

  /** 为了方便查找扁平化一下菜单项 */
  const flattenMenuKeys = getFlattenMenus(menus).map(menu => menu.path)

  /** 借助path-to-regexp 通过正则匹配路由 */
  const getMenuMatchKeys = paths.reduce<string[]>((result, path) => {
    return result.concat(
      flattenMenuKeys.filter(item => pathToRegexp(item).test(path)),
    )
  }, [])

  return getMenuMatchKeys
}, [location.pathname])
```


#### 将选中菜单逻辑封装一个hook 函数
```typescript
// src/hooks/use-menu-selected-keys.ts

import { IAsideMenu } from './../components/container/container-aside'
import { useMemo } from 'react'
import { url2paths, getFlattenMenus } from '../utils/menu'
import { pathToRegexp } from 'path-to-regexp'

/** 根据 当前路径，和菜单项，获取当前选中的keys */
export default function useMenuSelectedKeys(
  pathname: string,
  menuData: IAsideMenu[],
) {
  /** url 转换为数组 */
  const paths = useMemo<string[]>(() => url2paths(pathname), [pathname])

  /** 为了方便查找扁平化一下菜单项 */
  const flattenMenuKeys = useMemo(() => {
    return getFlattenMenus(menuData).map(menu => menu.path)
  }, [])

  /** 借助path-to-regexp 通过正则匹配路由 */
  const getMenuMatchKeys = paths.reduce<string[]>((result, path) => {
    return result.concat(
      flattenMenuKeys.filter(item => pathToRegexp(item).test(path)),
    )
  }, [])

  return getMenuMatchKeys
}
```
## 响应式布局的实现


大屏效果
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622983849874-14e28071-e9b4-48b6-804d-93464e499b00.png#clientId=ufa154c2e-1604-4&from=paste&height=927&id=u3e0ce4cc&margin=%5Bobject%20Object%5D&name=image.png&originHeight=927&originWidth=1343&originalType=binary&ratio=1&size=105110&status=done&style=none&taskId=u30eead0e-6165-4697-a2a5-d1c49def034&width=1343)


小屏效果
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622983781232-05b61403-72f8-44f4-a965-d63b0d510a79.png#clientId=ufa154c2e-1604-4&from=paste&height=500&id=uee38ad55&margin=%5Bobject%20Object%5D&name=image.png&originHeight=667&originWidth=375&originalType=binary&ratio=1&size=18929&status=done&style=stroke&taskId=ub5c7da89-a818-4779-90ee-6116b09f5f4&width=281)    ![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1622983804811-0af99234-d629-42b8-83e6-f08c34550402.png#clientId=ufa154c2e-1604-4&from=paste&height=500&id=u9f3fb3eb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=667&originWidth=375&originalType=binary&ratio=1&size=80592&status=done&style=stroke&taskId=u43ebd2b2-3ac7-4d35-9292-3fad4df6b4c&width=281)
​

从大屏转换为小屏，我们希望侧边栏是一个抽屉展示，并且控制侧边栏展开是在容器头部左边的小按钮进行切换。由于侧边栏和头部不是父子组件关系，我们打算把控制权交给它们最近的父级组件`Container`
​

### 动态使用抽屉包裹侧边栏
我们可以通过`Antd`中的`Gird`里`useBreakpoint`，判别当前屏幕。[详情参考文档](https://ant.design/components/grid-cn/#components-grid-demo-useBreakpoint)
​

```typescript
import { FC, memo, ReactNode, CSSProperties, useState } from 'react'
import { Grid } from 'antd'
// ...


const Container: FC = memo((props) => {
	// ...
  const { md } = useBreakpoint()
  
  /** 是否展示移动端侧边栏 */
  const isShowMobileAside = md === false
  
  /** 是否展示侧边栏蒙层 */
  const [isVisible, setVisible] = useState(false)

  /** 切换侧边栏的展示和隐藏 */
  const toggleAsideVisible = () => setVisible(v => !v)
  
  
  // 动态渲染侧边栏
  const renderAside = () => {
    if (isShowMobileAside) {
      return (
        <Drawer
          placement="left"
          closable={false}
          className="ctr-aside-drawer"
          visible={isVisible}
          onClose={toggleAsideVisible}
          width={200}
        >
          <ContainerAside isMobile={true} />
        </Drawer>
      )
    }

    return <ContainerAside isMobile={false} />
  }
    
  return (
  	<ContainerWrapper>
      <Layout style={containerStyle} hasSider={true}>
        {/* 侧边栏区域 */}
        {renderAside()}

        <Layout style={rightContainerStyle}>
          {/* 头部区域 */}
          <ContainerHeader
            isMobile={isShowMobileAside}
            toggle={toggleAsideVisible}
          />

          {/* 主区域 */}
          <ContainerMain>{children}</ContainerMain>

          {/* 底部区域 */}
          <ContainerFooter />
        </Layout>
      </Layout>
    </ContainerWrapper>
  )
})
```
## 面包屑的实现
在网站中如果嵌套比较深的话，我们想知道当前页面所属父级页面是哪里，通过面包屑能快速定位。
本功能界面部分是通过`Antd`中的`Breadcrumb`来实现的。[详情请参考官方文档](https://ant.design/components/breadcrumb-cn/)
> 面包屑查找思路,将菜单逆向推导，假如当前路径为 `/account/center`的时候，我们推导为`['/account', '/account/center']`。对将`/account`对菜单进行匹配。如果匹配不成功，则没有面包屑。匹配成功后看有没有`children`，将`/account/center`与`children`匹配

​

### 将菜单数据移至Container
> 因为我们的面包屑所属`ContainerHeader`,而菜单数据所属`ContainerAside`,要想共用数据。我们可以把数据传给公共父组件。再分别传递给它们

​

定义`Context`
```typescript
// components/container/context.ts

+ export interface MenuContextProps {
+   /** 菜单列表 */
+   menus: IAsideMenu[]
+ 
+   /** 设置菜单 */
+   setMenus: (newMenus: IAsideMenu[]) => void
+ }

+ export const MenuContext = createContext<MenuContextProps>(
+   {} as MenuContextProps,
+ )
```
​

`Container`初始化数据
```typescript
// components/container/index.ts


+ import { MenuContext, MenuContextProps } from './context'

const Container: FC = memo(props => {
	// ...
  
  /** 初始化侧边栏菜单 */
  const [menus, setMenus] = useState<IAsideMenu[]>([
    {
      _id: '100',
      title: '仪表盘',
      icon: <DashboardOutlined />,
      path: '/dashboard',
      children: [
        {
          _id: '101',
          title: '分析页',
          path: '/dashboard/analyses',
        },
        {
          _id: '102',
          title: '工作台',
          path: '/dashboard/workplace',
        },
      ],
    },
    // ...
  ])
  
  /** 菜单上下文 */
  const menuContextValue: MenuContextProps = {
    menus,
    setMenus,
  }
  
  // ...
  return (
  	<MenuContext.Provider value={menuContextValue}>
       {/* children ... */}
    </MenuContext.Provider>
  )
  
})
```
通过`useContext`获取菜单数据
```typescript
// components/container/container-aside.tsx

import { FC, memo, ReactNode, useContext, useState } from 'react'
import { MenuContext } from './context'

/** 侧边栏按钮 */
const AsideMenu: FC = memo(() => {
  + const { menus } = useContext(MenuContext)
  
  // ...
})

```
### 编写面包屑组件


```typescript
// components/container/container-breadcrumb.tsx

import { MenuContext } from './context'
import { FC, memo, ReactNode, useContext, useState } from 'react'
import { IAsideMenu } from './container-aside'

const ContainerBreadcrumb: FC = memo(props => {
  // 拿到菜单数据
  const { menus } = useContext(MenuContext)

  // 当前路径
  const location = useLocation()

  // 逆向推导 /account/center => ['/account', '/account/center']
  const paths = useMemo(() => url2paths(location.pathname), [location.pathname])

  /** 获取面包屑数据 */
  const [breadcrumbData, lastIndex] = useMemo(() => {
    const breadcrumbData: IAsideMenu[] = []
    let findWra = [...menus]

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]
      const mathMenu = findWra.find(menu => pathToRegexp(menu.path).test(path))
      /** 没有找到匹配的 */
      if (typeof mathMenu === 'undefined') {
        break
      }

      /** 找到匹配的，存放数组尾部 */
      breadcrumbData.push(mathMenu)

      /** 如果没有子节点，或者子节点为空，就没必要去查找了 */
      if (
        typeof mathMenu.children === 'undefined' ||
        mathMenu.children.length === 0
      ) {
        break
      }

      /** 将查找指向下一一节点 */
      findWra = mathMenu.children
    }
    const lastIndex = breadcrumbData.length - 1

    return [breadcrumbData, lastIndex]
  }, [paths, menus])

  
  // 根据面包屑数据生成面包屑
  const renderBreadcrumb = () => {
    return breadcrumbData.map((menu, index) => (
      <BreadcrumbItem
        key={menu.path}
        menu={menu}
        isLast={index === lastIndex}
      />
    ))
  }

  return (
    <ContainerBreadcrumbInner>
      <Breadcrumb>
        <Breadcrumb.Item href="#/">
          <HomeOutlined />
        </Breadcrumb.Item>

        {renderBreadcrumb()}
      </Breadcrumb>
    </ContainerBreadcrumbInner>
  )
})

export default ContainerBreadcrumb
```


## 历史导航的实现


网站访问页面过程中，如果我们想切换之前的页面。一般来说我们需要重新去菜单栏里面找。这个时候如果页面所属菜单不同，那么查找过程中会更繁琐。也可以通过浏览器自带的回退，跳转数量多了查找效果也不是很好。这个时候我们就需要一个容器把之前访问的页面信息存储起来，并且可以让它做一些操作，效果如下:
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1623026917422-2105c58d-1157-4dc9-884a-59449d618701.png#clientId=u27b09ddc-631d-4&from=paste&height=45&id=uad630435&margin=%5Bobject%20Object%5D&name=image.png&originHeight=45&originWidth=730&originalType=binary&ratio=1&size=4923&status=done&style=stroke&taskId=u6a4b5a3e-d899-4525-b9fb-9ddbbcb9baa&width=730)
因为在这个功能中，我们操作只有一个数组数据`historyState`。但是我们有多个操作行为如: `add`、`toggle`、`remove` 等。我们会联想到`React.useReducer`这个钩子函数
​

### 定义historyReducer
```typescript
// src/components/container-history.tsx

import { FC, memo, useReducer } from 'react'
import { Tag } from 'antd'

interface IHistoryState {
  title: string
  path: string
  active: boolean
}

type IHistoryActionTypes = 'add' | 'remove' | 'toggle' | 'other'

interface IHistoryAction {
  type: IHistoryActionTypes
  payload: any
}

const defaultHistoryState: IHistoryState[] = []

type historyReducerType = (
  state: IHistoryState[],
  action: IHistoryAction,
) => IHistoryState[]

const historyReducer: historyReducerType = (state, action) => {
  let { payload, type } = action

  switch (type) {
    /** 通过传标题，删除成员 */
    case 'remove':
      return state.filter(item => item.title !== payload)

    /** 添加成员，检查是否能找到标题 */
    case 'add':
      if (state.find(item => item.title === payload.title)) {
        return state
      }

      return [
        /** 取消所有高亮 */
        ...state.map(item => {
          item.active = false
          return item
        }),
        payload,
      ]

    /** 切换高亮 */
    case 'toggle':
      return state.map(item => {
        if (item.title === payload) {
          item.active = true
        } else {
          item.active = false
        }
        return item
      })

    /** Test */
    case 'other':
      console.log(action)
      return state
    default:
      return state
  }
}

const ContainerHistory: FC = memo(() => {
  const [historyState, historyDispatch] = useReducer(
    historyReducer,
    defaultHistoryState,
  )

  const handleClose = (item: IHistoryState) => {
    historyDispatch({ type: 'remove', payload: item.title })
  }

  const handleToggle = (item: IHistoryState) => {
    historyDispatch({ type: 'remove', payload: item.title })
  }

  return (
    <div className="routerHistory">
      <div className="routerHistory__inner">
        {historyState.map(item => (
          <Tag
            key={item.title}
            closable={historyState.length !== 1}
            visible
            onClose={() => handleClose(item)}
            onClick={() => handleToggle(item)}
          >
            {item.title}
          </Tag>
        ))}
      </div>
    </div>
  )
})

export default ContainerHistory
```
### 约束historyDispatch入参
```typescript
type IHistoryActionTypes = 'add' | 'remove' | 'toggle' | 'other'

interface IHistoryAction {
  type: IHistoryActionTypes
  payload: any
}
```
我们在上面定义了`historyDispatch`中`type`类型，并没有对`payload`进行约束。这样我们在调用方法是非常危险的 ,比如我们需要一个对象并且需要里面 一个方法。但是我们在传参的时候并没有传入指定的格式。这样可能会导致网站整体崩溃
​

定义传参荷载
```typescript
/** 参数荷载 */
type Payload = {
  /** 添加——对象数据类型 */
  add: IHistoryState

  /** 根据标题去切换 */
  toggle: string

  /** 根据标题去删除 */
  remove: string

  /** 其他 */
  other: any
}
```
使用中间方法转发一下
```typescript
// ...

type IHistoryActionTypes = 'add' | 'remove' | 'toggle' | 'other'

const ContainerHistory: FC = memo(() => {
  // ...
  
	const [historyState, historyDispatch] = useReducer(
    // ...
  )

  function transformDispatch<T extends IHistoryActionTypes>(
    type: T,
    payload: Payload[T],
  ) {
    historyDispatch({ type, payload })
  }
  
  // ...
})
```
修改调用方式
​

```typescript
const handleClose = (item: IHistoryState) => {
  transformDispatch('remove', item.title)
}

const handleToggle = (item: IHistoryState) => {
  transformDispatch('toggle', item.title)
}
```


通过`VSCode`之类的编辑器，我们就能根据第一个参数，正确推导出剩余的参数类型，如果不符合，TypeScript会帮我们提示并且报错，效果如下
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1623038984812-40a666b8-51dc-416b-97a7-91b6ea0a877a.png#clientId=u27b09ddc-631d-4&from=paste&height=74&id=u8f410990&margin=%5Bobject%20Object%5D&name=image.png&originHeight=74&originWidth=532&originalType=binary&ratio=1&size=7580&status=done&style=none&taskId=u896b408a-8bd1-4f37-98a8-4a6438b285f&width=532)![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1623039006783-ca866d39-3fdf-4df6-9c84-5bf5beb8c7a2.png#clientId=u27b09ddc-631d-4&from=paste&height=85&id=u4a22377e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=85&originWidth=536&originalType=binary&ratio=1&size=8508&status=done&style=none&taskId=u4bcbb5c6-cb5b-4d70-91c3-a26a4f60a2a&width=536)
![image.png](https://cdn.nlark.com/yuque/0/2021/png/21501578/1623039196021-d613d1bd-6305-4c20-a6fd-e9b11aad133a.png#clientId=u27b09ddc-631d-4&from=paste&height=162&id=u2404908c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=162&originWidth=999&originalType=binary&ratio=1&size=25834&status=done&style=none&taskId=ufa00b43a-3e4e-4eab-be32-378c3f54c62&width=999)


### 监听pathname变化生成历史导航


我们可以监听pathname，根据最新的pathname去菜单列表数据中找到符合的菜单，然后添加到历史导航数据
> 注意: 这里的需求历史导航只展示菜单列表中的。



```typescript
import {
  FC,
  memo,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'

import { MenuContext } from './context'

// ...

const ContainerHistory: FC = memo(() => {
  // ...
  const { menus } = useContext(MenuContext)
  
	const location = useLocation()

  /** 扁平化的菜单数据 */
  const flattenMenus = useMemo(() => getFlattenMenus(menus), [menus])
  
  useEffect(() => {
    const { pathname } = location
    /** 判断是否编辑文章 */
    if (/^(\/article\/add\/)\w+/.test(pathname)) {
      return transformDispatch('add', {
        title: '编辑文章-' + pathname.slice(-2),
        path: pathname,
        active: true,
      })
    }
    const currentMenu = flattenMenus.find(menu => menu.path === pathname)

    if (!currentMenu) return

    transformDispatch('add', {
      title: currentMenu.title,
      path: currentMenu.path,
      active: true,
    })
  }, [location.pathname, flattenMenus])
  
  // ...
})
```
### 最终代码
```typescript
// src/components/container/container-history.tsx 

import { FC, memo, useReducer, useContext, useMemo, useEffect } from 'react'
import { Tag } from 'antd'
import { MenuContext } from './context'
import { useHistory, useLocation } from 'react-router-dom'
import { getFlattenMenus } from '../../utils/menu'
import { SettingStyle } from '../../styles'

interface IHistoryState {
  title: string
  path: string
  active: boolean
}

type IHistoryActionTypes = 'add' | 'remove' | 'toggle' | 'other'

interface IHistoryAction {
  type: IHistoryActionTypes
  payload: any
}

/** 参数荷载 */
type Payload = {
  /** 添加——对象数据类型 */
  add: IHistoryState

  /** 根据标题去切换 */
  toggle: string

  /** 根据标题去删除 */
  remove: string

  /** 其他 */
  other: any
}

const defaultHistoryState: IHistoryState[] = []

type historyReducerType = (
  state: IHistoryState[],
  action: IHistoryAction,
) => IHistoryState[]

const historyReducer: historyReducerType = (state, action) => {
  let { payload, type } = action

  switch (type) {
    /** 通过传标题，删除成员 */
    case 'remove':
      return state.filter(item => item.title !== payload)

    /** 添加成员，检查是否能找到标题 */
    case 'add':
      if (state.find(item => item.title === payload.title)) {
        return state
      }

      return [
        /** 取消所有高亮 */
        ...state.map(item => {
          item.active = false
          return item
        }),
        payload,
      ]

    /** 切换高亮 */
    case 'toggle':
      return state.map(item => {
        if (item.title === payload) {
          item.active = true
        } else {
          item.active = false
        }
        return item
      })

    /** Test */
    case 'other':
      console.log(action)
      return state
    default:
      return state
  }
}

const ContainerHistory: FC = memo(() => {
  const [historyState, historyDispatch] = useReducer(
    historyReducer,
    defaultHistoryState,
  )
  const { menus } = useContext(MenuContext)

  const location = useLocation()

  const history = useHistory()

  /** 扁平化的菜单数据 */
  const flattenMenus = useMemo(() => getFlattenMenus(menus), [menus])

  function transformDispatch<T extends IHistoryActionTypes>(
    type: T,
    payload: Payload[T],
  ) {
    historyDispatch({ type, payload })
  }

  const handleClose = (item: IHistoryState) => {
    const { active, title } = item

    transformDispatch('remove', title)

    /** 如果删除是激活状态，切换高亮删除后的最后一个成员(注意这里的 historyState 还是以前的数据) */
    if (active) {
      const len = historyState.length

      let lastItem = historyState[len - 1]

      // 当前就是最后一个，那就往前移动
      if (lastItem.title === title) {
        lastItem = historyState[len - 2]
      }

      handleToggle(lastItem)
    }
  }

  const handleToggle = (item: IHistoryState) => {
    const { active, title, path } = item

    if (active) return

    transformDispatch('toggle', title)

    history.replace(path)
  }

  useEffect(() => {
    const { pathname } = location
    const currentMenu = flattenMenus.find(menu => menu.path === pathname)

    if (!currentMenu) return

    transformDispatch('add', {
      title: currentMenu.title,
      path: currentMenu.path,
      active: true,
    })
  }, [location.pathname, flattenMenus])

  return (
    <div className="routerHistory">
      <div className="routerHistory__inner">
        {historyState.map(item => (
          <Tag
            color={item.active ? SettingStyle['theme-color'] : ''}
            key={item.title}
            closable={historyState.length !== 1}
            visible
            onClose={() => handleClose(item)}
            onClick={() => handleToggle(item)}
          >
            {item.title}
          </Tag>
        ))}
      </div>
    </div>
  )
})

export default ContainerHistory
```
### 挂载到ContainerHeader
```typescript
const ContainerHeader: FC = () => {
  return (
    <Layout.Header style={headerStyle}>
      <ContainerHeaderInner>
        <div className="top">
          {/* ... */}
        </div>
        <div className="bottom">
          <Row align="middle" style={{ height: '100%' }}>
            <Col md={{ span: 16 }} xs={{ span: 24 }}>
              {/* 导航历史 */}
              <ContainerHistory />
            </Col>

            <Col md={{ span: 7, offset: 1 }} xs={{ span: 0 }}>
              {/* ... */}
            </Col>
          </Row>
        </div>
      </ContainerHeaderInner>
    </Layout.Header>
  )
}
```
