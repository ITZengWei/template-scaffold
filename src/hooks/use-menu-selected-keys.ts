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
