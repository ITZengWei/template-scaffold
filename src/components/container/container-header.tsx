import { FC, memo, CSSProperties, useContext, useEffect, useState } from 'react'
import { Layout, Avatar, Menu, Dropdown, Row, Col } from 'antd'
import { useHistory } from 'react-router-dom'
import dayJs from 'dayjs'
import { ContainerHeaderInner } from './style'
import {
  AntDesignOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { ContainerContext } from './context'
import defaultAvatar from '../../asserts/images/default.png'
import { SettingStyle } from '../../styles'

/** 头部控制项组件 */
const HeaderOptions: FC = memo(() => {
  const { logout, userInfo } = useContext(ContainerContext)
  const history = useHistory()

  function handleMenuClick(info: any) {
    const { key } = info

    switch (key) {
      case 'info':
        history.push('/account/center')
        break
      case 'setting':
        history.push('/account/setting')
        break
      case 'logout':
        logout()
        break
      default:
        break
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="info" icon={<UserOutlined />}>
        个人中心
      </Menu.Item>
      <Menu.Item key="setting" icon={<SettingOutlined />}>
        个人设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <div className="options">
      欢迎，
      <Dropdown overlay={menu} placement="bottomCenter" arrow>
        <div>
          <Avatar
            className="avatar"
            size={30}
            icon={
              false ? (
                <AntDesignOutlined />
              ) : (
                <img src={defaultAvatar} alt="默认头像" />
              )
            }
          />
          <span className="nickname">{userInfo?.nickname}</span>
        </div>
      </Dropdown>
    </div>
  )
})

/** 头部时间组件 */
const HeaderDate: FC = memo(() => {
  const [dateStr, setDateStr] = useState<string>(() => {
    return dayJs(Date.now()).format('YYYY年MM月DD日 HH:mm')
  })
  useEffect(() => {
    const timer = setInterval(() => {
      setDateStr(dayJs(Date.now()).format('YYYY年MM月DD日 HH:mm:ss'))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <div className="date">{dateStr}</div>
})

const ContainerHeader: FC = memo(props => {
  const headerStyle: CSSProperties = {
    position: 'relative',
    padding: '5px 30px',
    height: 'auto',
    background: SettingStyle['highlight-background-color'],
    boxShadow: ` 0 1px 2px 0 ${SettingStyle['theme-color-shadow']}`,
  }

  return (
    <Layout.Header style={headerStyle}>
      <ContainerHeaderInner>
        <div className="top">
          <div></div>

          {/* 头部控制项 */}
          <HeaderOptions />
        </div>
        <div className="bottom">
          <Row align="middle" style={{ height: '100%' }}>
            <Col md={{ span: 16 }} xs={{ span: 24 }}></Col>
            <Col md={{ span: 7, offset: 1 }} xs={{ span: 0 }}>
              <HeaderDate />
            </Col>
          </Row>
        </div>
      </ContainerHeaderInner>
    </Layout.Header>
  )
})

export default ContainerHeader
