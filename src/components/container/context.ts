import { IUserInfo } from './../../store/module/user/reducer'
import { createContext } from 'react'

export interface ContainerContextProps {
  /** 用户信息 */
  userInfo: IUserInfo | null

  /** 退出登录 */
  logout: any
}

export const ContainerContext = createContext<ContainerContextProps>(
  {} as ContainerContextProps,
)
