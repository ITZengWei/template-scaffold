import { FC, memo, useState } from 'react'
import { Layout } from 'antd'
import { SiderProps } from 'antd/lib/layout/Sider'
import logoImg from '../../asserts/images/ContainerAside/banner.png'
import { ContainerAsideInner } from './style'

/** 侧边栏按钮 */
const AsideMenu: FC = memo(() => {
  return <div></div>
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
