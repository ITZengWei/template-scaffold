import { Reducer } from 'redux'
import { IAction } from '../../types'
import actionTypes from './actionCreators'
import { getToken } from './../../../utils/cookie'

enum ISex {
  /** 男 */
  male = '1',

  /** 女 */
  female = '0',

  /** 保密 */
  secrecy = '-1',
}

export enum IAudit {
  /** 审核拒绝 */
  reject = '-1',

  /** 等待审核 */
  await = '0',

  /** 审核通过 */
  agree = '1',
}

export enum IUserType {
  /** 普通用户 */
  common = '0',

  /** 初级管理员 */
  admin = '1',

  /** 超级管理员 */
  superAdmin = '2',
}

export interface IUserInfo {
  /** 用户id */
  _id: string
  /** 账号/用户名 */
  account: string
  /** 手机号 */
  tel: number
  /** 头像 */
  avatar?: string
  /** 昵称 */
  nickname?: string
  /** 性别 */
  sex: ISex
  /** 审核状态 */
  audit: IAudit
  /** 用户类型 */
  type: IUserType

  [propName: string]: any
}

export interface UserState {
  /** 进入加载状态 */
  enterLoading: boolean

  /** 用户信息 */
  userInfo: IUserInfo | null

  /** 登录令牌 */
  token: string

  /** 是否登录 */
  isLogin: boolean

  /** 用户角色 */
  role: IUserType
}

const defaultUser: UserState = {
  enterLoading: true,
  userInfo: null,
  token: getToken(),
  isLogin: false,
  role: IUserType.common,
}

const reducer: Reducer<UserState, IAction<any>> = (
  state = defaultUser,
  action,
) => {
  let { type, payload } = action
  switch (type) {
    case actionTypes.CHANGE_ENTER_LOADING:
      return {
        ...state,
        enterLoading: payload as boolean,
      }

    case actionTypes.SET_TOKEN:
      return {
        ...state,
        token: payload,
      }

    case actionTypes.SET_ROLE:
      return {
        ...state,
        role: payload,
      }

    case actionTypes.SET_IS_LOGIN:
      return {
        ...state,
        isLogin: payload,
      }

    case actionTypes.CHANGE_USER_INFO:
      return {
        ...state,
        userInfo: payload ? { ...state.userInfo, ...payload } : payload,
      }

    default:
      return state
  }
}

export default reducer

/** TODO
 * 1. 这里为什么不能 const enum xxx
 */
