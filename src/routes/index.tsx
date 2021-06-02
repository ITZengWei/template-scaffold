import { Redirect } from 'react-router-dom'
import { Suspense, lazy, FC } from 'react'
import { IRoute } from './types'

/**
 * 布局相关路由
 */

/** 引入初始化布局(用于获取用户信息，初始化网站) */
import InitLayout from '../layouts/init-layout'
import UserLayout from '../layouts/user-layout'

/** 错误相关布局 (403, 404 之类的) */
import ErrorLayout from '../layouts/error-layout'

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

/** 系统路由配置 */
const systemRoute = {
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
const errorRoute = {
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
    ],
  },
]

export default routes
