import { Redirect } from 'react-router-dom'
import { lazy } from 'react'
import { IRoute } from './types'

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

/** 引入分析页面 */
const Analyses = lazy(() => import('../views/analyses'))

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
