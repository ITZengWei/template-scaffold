import { Dispatch } from 'redux'
import { UserState } from './module/user/reducer'

export interface IStoreState {
  /** user 模块 store */
  user: UserState
}

/** 更改数据行为接口 */
export interface IAction<T = any> {
  /** 更改数据行为类型 */
  type: string
  /** 行为所带参数 */
  payload: T
}

/** 异步更改行为 */
export type AsyncAction = (dispatch: Dispatch) => void
