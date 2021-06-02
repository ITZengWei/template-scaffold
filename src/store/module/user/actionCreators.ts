import { removeToken, setToken } from './../../../utils/cookie'
import { Dispatch } from 'redux'
import { IAction, AsyncAction } from './../../types'
import { IUserInfo, IUserType } from './reducer'

export enum actionTypes {
  /** 修改进场动画 */
  CHANGE_ENTER_LOADING = 'CHANGE_ENTER_LOADING',

  /** 设置token */
  SET_TOKEN = 'SET_TOKEN',

  /** 设置角色 */
  SET_ROLE = 'SET_ROLE',

  /** 设置是否已经登录 */
  SET_IS_LOGIN = 'SET_IS_LOGIN',

  /** 更改用户信息 */
  CHANGE_USER_INFO = 'CHANGE_USER_INFO',
}

/** 切换进场动画 */
export function handleToggleEnterLoading(isLoading: boolean): IAction<boolean> {
  return {
    type: actionTypes.CHANGE_ENTER_LOADING,
    payload: isLoading,
  }
}

/** 设置 token */
export function handleSetToken(token: string): IAction<string> {
  /** 将新的token 设置在cookie中，传空字符串删除 */
  token ? setToken(token) : removeToken()

  return {
    type: actionTypes.SET_TOKEN,
    payload: token,
  }
}

/** 设置 角色 */
export function handleSetRole(role: IUserType): IAction<IUserType> {
  return {
    type: actionTypes.SET_ROLE,
    payload: role,
  }
}

/** 设置登录状态 */
export function handleSetIsLogin(isLogin: boolean): IAction<boolean> {
  return {
    type: actionTypes.SET_IS_LOGIN,
    payload: isLogin,
  }
}

/** 同步用户信息 */
export function handleChangeUserInfo(
  userInfo: IUserInfo | null,
): IAction<IUserInfo | null> {
  return {
    type: actionTypes.CHANGE_USER_INFO,
    payload: userInfo,
  }
}

/** 登录成功结果 */
export interface SuccessResult {
  /** 用户信息 */
  userInfo: IUserInfo

  /** 角色 */
  role: IUserType
}

/** 获取用户信息成功 */
export function handleFetchUserInfoSuccess(result: SuccessResult): AsyncAction {
  return (dispatch: Dispatch) => {
    dispatch(handleChangeUserInfo(result.userInfo))
    dispatch(handleSetRole(result.role))
    dispatch(handleSetIsLogin(true))
  }
}

/** 获取用户信息失败 */
export function handleFetchUserInfoFailed(): AsyncAction {
  return (dispatch: Dispatch) => {
    dispatch(handleChangeUserInfo(null))
    dispatch(handleSetToken(''))
    dispatch(handleSetIsLogin(false))
  }
}

/** 退出登录 */
export function handleLogout(): AsyncAction {
  return (dispatch: Dispatch) => {
    dispatch(handleChangeUserInfo(null))
    dispatch(handleSetToken(''))
    dispatch(handleSetIsLogin(false))
  }
}

export default actionTypes
