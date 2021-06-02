import { IAudit } from './../store/module/user/reducer'
import request from '../utils/request'

/** 用户模块请求Url集合 */
export enum UserUrls {
  fetchUserList = '/users/findAll',
  changeLevel = '/changeLevel',
  applyAdmin = '/applyAdmin',
  editUser = `/rest/adminUser`,
  removeUser = `/users`,
  loginRequest = '/login',
  registerRequest = '/register',
  fetchUserInfo = '/get_user_info',
  authAdmin = '/authAdmin',
}

/**
 * 用户相关接口
 */

/** 管理员获取所有用户列表信息 */
export const fetchUserList = <T = any>() => {
  return request<T>({
    url: UserUrls.fetchUserList,
    method: 'GET',
  })
}

/** 更改用户等级 */
export const changeLevel = <T = any>(userId: string, level: string) => {
  const sendParams = { userId, level }

  return request<T>({
    url: UserUrls.changeLevel,
    method: 'POST',
    data: sendParams,
  })
}

/** 申请为管理员 */
export const applyAdmin = <T = any>(userId: string, level: string) => {
  const sendParams = { userId, level }

  return request<T>({
    url: UserUrls.applyAdmin,
    method: 'POST',
    data: sendParams,
  })
}

interface IEditUserData {
  [propName: string]: any
}

/** 编辑用户 */
export const editUser = <T = any>(
  userId: string,
  editUserData: IEditUserData,
) => {
  return request<T>({
    url: `${UserUrls.editUser}/${userId}`,
    method: 'PUT',
    data: editUserData,
  })
}

/* 根据用户ID删除用户 */
export const removeUser = <T = any>(userId: string) => {
  return request<T>({
    url: `${UserUrls.removeUser}/${userId}`,
    method: 'DELETE',
  })
}

/** 登录请求参数集 */
interface LoginParams {
  /** 用户的用户名或者手机号  */
  account: string
  /** 用户密码 */
  psw: string
}

/** 用户登录请求 */
export const loginRequest = <T = any>(payload: LoginParams) => {
  return request<T>({
    url: UserUrls.loginRequest,
    method: 'POST',
    data: payload,
  })
}

/** 注册请求参数集 */
export interface RegisterParams {
  /** 用户名 */
  account: string

  /** 用户密码 */
  psw: string

  /** 手机号 */
  tel: string

  /** 验证码 */
  code: string
}

/** 用户注册请求 */
export const registerRequest = <T = any>(payload: RegisterParams) => {
  return request<T>({
    url: UserUrls.registerRequest,
    method: 'POST',
    data: payload,
  })
}

/** 获取用户信息 */
export const fetchUserInfo = <T = any>() => {
  return request<T>({
    url: UserUrls.fetchUserInfo,
    method: 'GET',
  })
}

/** 审核为管理员 */
export const authAdmin = <T = any>(userId: string, status: IAudit) => {
  const sendParams = { userId, status }

  return request<T>({
    url: UserUrls.authAdmin,
    method: 'POST',
    data: sendParams,
  })
}
