import { FC, memo, ReactNode, useMemo, useState } from 'react'
import { Layout, Menu, MenuProps } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import { DashboardOutlined, UserOutlined } from '@ant-design/icons'
import { SiderProps } from 'antd/lib/layout/Sider'
import logoImg from '../../asserts/images/ContainerAside/banner.png'
import { ContainerAsideInner } from './style'
import { combineURL } from '../../utils/tool'
import config from '../../config'

/** 将 url 转换为 url数组 (/a/b/c => ['/a', '/b', '/c'])*/
export const url2paths = (url: string) => {
  /** 根据 / 分割 url(并且去除第一个 / ) ['a', 'b', 'c'] */
  const paths = url.slice(1).split('/')

  /** 为每一个成员前面添加一个 '/' */
  return paths.map((item, index) => '/' + paths.slice(0, index + 1).join('/'))
}

/** 侧边栏菜单接口 */
export interface IAsideMenu {
  /** 菜单id */
  _id: string

  /** 菜单标题 */
  title: string

  /** 菜单路径 */
  path: string

  /** 菜单图标 */
  icon?: any

  /** 子菜单 */
  children?: IAsideMenu[]
}

/** 侧边栏按钮 */
const AsideMenu: FC = memo(() => {
  const location = useLocation()

  const history = useHistory()

  const menuSelectedKeys = useMemo(() => {
    return url2paths(location.pathname)
  }, [location.pathname])

  const menuProps: MenuProps = {
    theme: 'dark',
    mode: 'inline',
    selectedKeys: menuSelectedKeys,
    defaultOpenKeys: menuSelectedKeys.slice(0, -1),
    onClick(info) {
      const { key } = info
      const pathname = combineURL(config.BASENAME, key as string)

      history.push(pathname)
    },
  }

  console.log(menuProps)

  const menus: IAsideMenu[] = [
    {
      _id: '100',
      title: '仪表盘',
      icon: <DashboardOutlined />,
      path: '/dashboard',
      children: [
        {
          _id: '101',
          title: '分析页',
          path: '/dashboard/analyses',
        },
        {
          _id: '102',
          title: '工作台',
          path: '/dashboard/workplace',
        },
      ],
    },
    {
      _id: '200',
      title: '用户页',
      icon: <UserOutlined />,
      path: '/account',
      children: [
        {
          _id: '201',
          title: '个人中心',
          path: '/account/center',
        },
        {
          _id: '202',
          title: '个人设置',
          path: '/account/setting',
        },
      ],
    },
  ]

  function renderChildrenMenu(navList: IAsideMenu[]): ReactNode {
    /** 转换为 Menu */
    return navList.map(nav => {
      const { title, path, icon, children } = nav

      /** 如果有多级路由 */
      if (children?.length) {
        return (
          <Menu.SubMenu title={title} icon={icon} key={path}>
            {renderChildrenMenu(children)}
          </Menu.SubMenu>
        )
      }

      /** 单层路由 */
      return (
        <Menu.Item key={path} icon={icon}>
          {title}
        </Menu.Item>
      )
    })
  }

  return <Menu {...menuProps}>{renderChildrenMenu(menus)}</Menu>
})

const ContainerAside: FC = memo(props => {
  const [collapsed, setCollapsed] = useState(false)

  /** 切换关闭与展开回调 */
  const handleCollapse = () => {
    setCollapsed(collapsed => !collapsed)
  }

  /** 根据是否移动端 动态返回 Sider 属性 */
  const getSliderProps: () => SiderProps = () => {
    const sliderProps: SiderProps = {
      collapsible: true,
      collapsed: collapsed,
      onCollapse: handleCollapse,
      breakpoint: 'lg',
    }

    return sliderProps
  }

  return (
    <Layout.Sider {...getSliderProps()}>
      <ContainerAsideInner>
        <div className="info">
          <img className="info__logo" src={logoImg} alt="Banner" />
          <h3 className="info__title">个人博客</h3>
        </div>

        <AsideMenu />
      </ContainerAsideInner>
    </Layout.Sider>
  )
})

export default ContainerAside
