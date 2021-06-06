import { IAsideMenu } from './container-aside'
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

export interface MenuContextProps {
  /** 菜单列表 */
  menus: IAsideMenu[]

  /** 设置菜单 */
  setMenus: (newMenus: IAsideMenu[]) => void
}

export const MenuContext = createContext<MenuContextProps>(
  {} as MenuContextProps,
)
