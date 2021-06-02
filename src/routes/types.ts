import { IUserType } from './../store/module/user/reducer'
import { ReactNode, FC, LazyExoticComponent } from 'react'

// /** 生成异步组件方法属性 (需要懒加载的组件, 加载状态组件) => React组件 */
// export type GeneratorSuspenseComponentProps = (
//   Page: FC,
//   loading?: FC,
// ) => (props: any) => JSX.Element

/** 路由元信息接口 */
export interface IRouteMeta {
  /** 页面路由标题 */
  title: string
  /** 页面路由图标 */
  icon?: ReactNode
}

/** 路由基础属性接口 */
export interface IRouteBase {
  /** 路由路径 */
  path: string
  /** 是否严格匹配 */
  exact?: boolean
  /** 路由组件 */
  component?: any
  /** 302 跳转 */
  render?: (props: any) => ReactNode
  /** 路由信息 */
  meta: IRouteMeta
  /** 是否校验权限,子组件会继承 */
  auth?: IUserType[]
}

/** 路由属性接口 */
export interface IRoute extends IRouteBase {
  /** 子路由 */
  routes?: Array<IRoute>
}
