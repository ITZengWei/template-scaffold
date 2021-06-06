import { IAsideMenu } from './../components/container/container-aside'

/** 将 url 转换为 url数组 (/a/b/c => ['/a', '/b', '/c'])*/
export const url2paths = (url: string) => {
  /** 根据 / 分割 url(并且去除第一个 / ) ['a', 'b', 'c'] */
  const paths = url.slice(1).split('/')

  /** 为每一个成员前面添加一个 '/' */
  return paths.map((item, index) => '/' + paths.slice(0, index + 1).join('/'))
}

/** 获取扁平化的菜单 */
export const getFlattenMenus = (menuData: IAsideMenu[]) => {
  return menuData.reduce<IAsideMenu[]>((result, menu) => {
    result.push(menu)
    if (menu.children) {
      result = result.concat(getFlattenMenus(menu.children))
    }
    return result
  }, [])
}
