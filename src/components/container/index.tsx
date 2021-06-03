import { FC, memo, ReactNode, CSSProperties, useState, useEffect } from 'react'
import { Layout } from 'antd'
import { ContainerWrapper } from './style'
import { SettingStyle } from '../../styles'
import ContainerMain from './container-main'
import ContainerFooter from './container-footer'
import ContainerHeader from './container-header'
import ContainerAside from './container-aside'
import { ContainerContext, ContainerContextProps } from './context'
import useActions from '../../hooks/use-actions'
import { handleLogout } from '../../store/module/user/actionCreators'
import useShallowEqualSelector from '../../hooks/use-shallow-equal-selector'
import { IUserInfo } from '../../store/module/user/reducer'

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
    padding: '15px 15px 0',
  }

  return (
    <ContainerContext.Provider value={contextValue}>
      <ContainerWrapper>
        <Layout style={containerStyle} hasSider={true}>
          {/* 侧边栏区域 */}
          <ContainerAside />

          <Layout style={rightContainerStyle}>
            {/* 头部区域 */}
            <ContainerHeader />

            {/* 主区域 */}
            <ContainerMain>{children}</ContainerMain>

            {/* 底部区域 */}
            <ContainerFooter />
          </Layout>
        </Layout>
      </ContainerWrapper>
    </ContainerContext.Provider>
  )
})

export default Container
