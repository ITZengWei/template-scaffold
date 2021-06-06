import { FC, memo, ReactNode, CSSProperties, useState } from 'react'
import { Layout, Drawer, Grid } from 'antd'
import { DashboardOutlined, UserOutlined } from '@ant-design/icons'
import { ContainerWrapper } from './style'
import { SettingStyle } from '../../styles'
import ContainerMain from './container-main'
import ContainerFooter from './container-footer'
import ContainerHeader from './container-header'
import ContainerAside, { IAsideMenu } from './container-aside'
import {
  ContainerContext,
  ContainerContextProps,
  MenuContext,
  MenuContextProps,
} from './context'
import useActions from '../../hooks/use-actions'
import { handleLogout } from '../../store/module/user/actionCreators'
import useShallowEqualSelector from '../../hooks/use-shallow-equal-selector'
import { IUserInfo } from '../../store/module/user/reducer'

const { useBreakpoint } = Grid

interface ContainerProps {
  /** 子节点 */
  children: ReactNode
}

const Container: FC<ContainerProps> = memo(props => {
  const { children } = props

  /** 退出登录 */
  const logout = useActions(handleLogout)

  const userInfo = useShallowEqualSelector<IUserInfo>(
    state => state.user.userInfo!,
  )

  /** 是否展示侧边栏蒙层 */
  const [isVisible, setVisible] = useState(false)

  /** 切换侧边栏的展示和隐藏 */
  const toggleAsideVisible = () => setVisible(v => !v)

  const { md } = useBreakpoint()

  /** 是否展示移动端侧边栏 */
  const isShowMobileAside = md === false

  /** 初始化侧边栏菜单 */
  const [menus, setMenus] = useState<IAsideMenu[]>([
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
        {
          _id: '203',
          title: '用户详情',
          path: '/account/info',
        },
      ],
    },
  ])

  /** 菜单上下文 */
  const menuContextValue: MenuContextProps = {
    menus,
    setMenus,
  }

  const contextValue: ContainerContextProps = {
    logout,
    userInfo,
  }

  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    background: SettingStyle['background-color'],
  }
  const rightContainerStyle: CSSProperties = {
    background: 'inherit',
    padding: isShowMobileAside ? '' : '15px 15px 0',
  }

  const renderAside = () => {
    if (isShowMobileAside) {
      return (
        <Drawer
          placement="left"
          closable={false}
          className="ctr-aside-drawer"
          visible={isVisible}
          onClose={toggleAsideVisible}
          width={200}
        >
          <ContainerAside isMobile={true} />
        </Drawer>
      )
    }

    return <ContainerAside isMobile={false} />
  }

  return (
    <ContainerContext.Provider value={contextValue}>
      <MenuContext.Provider value={menuContextValue}>
        <ContainerWrapper>
          <Layout style={containerStyle} hasSider={true}>
            {/* 侧边栏区域 */}
            {renderAside()}

            <Layout style={rightContainerStyle}>
              {/* 头部区域 */}
              <ContainerHeader
                isMobile={isShowMobileAside}
                toggle={toggleAsideVisible}
              />

              {/* 主区域 */}
              <ContainerMain>{children}</ContainerMain>

              {/* 底部区域 */}
              <ContainerFooter />
            </Layout>
          </Layout>
        </ContainerWrapper>
      </MenuContext.Provider>
    </ContainerContext.Provider>
  )
})

export default Container
