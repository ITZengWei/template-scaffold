import { FC, memo, ReactNode, useContext, useMemo } from 'react'
import { Breadcrumb, Menu } from 'antd'
import { BreadcrumbItemProps } from 'antd/lib/breadcrumb'
import { HomeOutlined } from '@ant-design/icons'
import { pathToRegexp } from 'path-to-regexp'
import { ContainerBreadcrumbInner } from './style'
import { MenuContext } from './context'
import { useLocation } from 'react-router-dom'
import { url2paths } from '../../utils/menu'
import { IAsideMenu } from './container-aside'
import { combineURL } from '../../utils/tool'
import config from '../../config'

interface ItemProps {
  /** 菜单属性 */
  menu: IAsideMenu

  /** 是否为最后一个 */
  isLast: boolean
}

/** 生成菜单 */
function generatorMenu(menus: IAsideMenu[]): ReactNode {
  return (
    <Menu>
      {menus.map(({ path, title }) => (
        <Menu.Item key={path}>
          <a
            rel="noopener noreferrer"
            style={{ color: 'rgba(0, 0, 0, 0.45)' }}
            href={combineURL('#', config.BASENAME, path)}
          >
            {title}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  )
}

const BreadcrumbItem: FC<ItemProps> = memo(props => {
  const {
    menu: { path, title, children, icon },
    isLast,
  } = props

  const hasChildren = typeof children !== 'undefined' && children.length !== 0

  const breadcrumbItemProps: BreadcrumbItemProps = {
    href:
      isLast || hasChildren
        ? undefined
        : combineURL('#', config.BASENAME, path),
    overlay: hasChildren ? (generatorMenu(children!) as any) : undefined,
  }

  return (
    <Breadcrumb.Item {...breadcrumbItemProps}>
      {icon}
      {title}
    </Breadcrumb.Item>
  )
})

const ContainerBreadcrumb: FC = memo(props => {
  // 拿到菜单数据
  const { menus } = useContext(MenuContext)

  // 当前路径
  const location = useLocation()

  // 逆向推导 /account/center => ['/account', '/account/center']
  const paths = useMemo(() => url2paths(location.pathname), [location.pathname])

  /** 获取面包屑数据 */
  const [breadcrumbData, lastIndex] = useMemo(() => {
    const breadcrumbData: IAsideMenu[] = []
    let findWra = [...menus]

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]
      const mathMenu = findWra.find(menu => pathToRegexp(menu.path).test(path))
      /** 没有找到匹配的 */
      if (typeof mathMenu === 'undefined') {
        break
      }

      /** 找到匹配的，存放数组尾部 */
      breadcrumbData.push(mathMenu)

      /** 如果没有子节点，或者子节点为空，就没必要去查找了 */
      if (
        typeof mathMenu.children === 'undefined' ||
        mathMenu.children.length === 0
      ) {
        break
      }

      /** 将查找指向下一一节点 */
      findWra = mathMenu.children
    }
    const lastIndex = breadcrumbData.length - 1

    return [breadcrumbData, lastIndex]
  }, [paths, menus])

  // 根据面包屑数据生成面包屑
  const renderBreadcrumb = () => {
    return breadcrumbData.map((menu, index) => (
      <BreadcrumbItem
        key={menu.path}
        menu={menu}
        isLast={index === lastIndex}
      />
    ))
  }

  return (
    <ContainerBreadcrumbInner>
      <Breadcrumb>
        <Breadcrumb.Item href="#/">
          <HomeOutlined />
        </Breadcrumb.Item>

        {renderBreadcrumb()}
      </Breadcrumb>
    </ContainerBreadcrumbInner>
  )
})

export default ContainerBreadcrumb
