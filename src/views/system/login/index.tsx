import { FC, memo, useCallback, useMemo, useState } from 'react'
import { Spin, Form, Input, Button, message, Grid } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, Redirect } from 'react-router-dom'
import Texty from 'rc-texty'
import 'rc-texty/assets/index.css'
/** 导入Hooks api */
import { useDispatch, useSelector } from 'react-redux'
import { LoginWithRegisterContainer, BrandWra, FormAreaWra } from './style'
import { loginRequest } from '../../../api/user'
import { IStoreState } from '../../../store/types'
import { IUserInfo } from '../../../store/module/user/reducer'
import {
  handleSetRole,
  handleSetToken,
  handleChangeUserInfo,
  handleSetIsLogin,
} from '../../../store/module/user/actionCreators'
import { getUserType } from '../../../utils/person'
import { throttle } from '../../../utils/tool'

const { useBreakpoint } = Grid

/** 大图广告区域 */
export const Brand = memo(() => {
  const { lg } = useBreakpoint()

  /** 是否展示移动端侧边栏 */
  const isMobile = lg === false

  if (isMobile) {
    return null
  }

  return (
    <BrandWra>
      <Texty className="brandInfo__title" type="top">
        个人博客后台管理中心
      </Texty>
      <Texty
        className="brandInfo__subtitle"
        type="bottom"
        mode="sync"
        duration={600}
      >
        佳合畅达关注着各个行业软件市场的虚修
        ，以中小企业管理的规范化、信息化、现代化为己任，把开发适合中国国情的行业软件当做自己的使命，
        研发一系列应用软件，满足不同行业的需求。
      </Texty>
    </BrandWra>
  )
})

/** 登录请求结果 */
interface LoginRequestResult {
  /** Token令牌 */
  token: string

  /** 用户信息 */
  userInfo: IUserInfo
}

/** 登录表单结果 */
interface LoginFormResult {
  account: string
  psw: string
}

interface LoginProps {
  /** 是否登录 */
  isLogin: boolean

  /** 登录成功 */
  loginSuccess: (successResult: LoginRequestResult) => void
}

const Login: FC<LoginProps> = props => {
  const [isLoading, setLoading] = useState(false)

  const isLogin = useSelector<IStoreState, Boolean>(state => state.user.isLogin)
  const dispatch = useDispatch()

  const loginSuccess = (successResult: LoginRequestResult) => {
    const { token, userInfo } = successResult

    dispatch(handleSetToken(token))
    dispatch(handleSetRole(getUserType(userInfo)))
    dispatch(handleChangeUserInfo(userInfo))
    dispatch(handleSetIsLogin(true))
  }

  const onFinish = useMemo(() => {
    return throttle((result: LoginFormResult) => {
      setLoading(true)
      loginRequest<LoginRequestResult>(result)
        .then(res => {
          setLoading(false)
          loginSuccess(res.data.data)
        })
        .catch(error => {
          setLoading(false)
          message.error(error.msg)
        })
    }, 1200)
  }, [loginSuccess]) as (values: any) => void

  if (isLogin) {
    return <Redirect to="/" />
  }

  return (
    <LoginWithRegisterContainer>
      <Brand />
      <FormAreaWra>
        <Spin spinning={isLoading}>
          <h4 className="formArea__title">管理员登录</h4>
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              className="formArea__item"
              name="account"
              rules={[{ required: true, message: '账号不能为空!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="账号或手机号"
              />
            </Form.Item>
            <Form.Item
              className="formArea__item"
              name="psw"
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="密码"
              />
            </Form.Item>
            <div className="to-login">
              没有账号?
              <Button type="link">
                <Link to="/system/register" replace>
                  立即注册
                </Link>
              </Button>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </FormAreaWra>
    </LoginWithRegisterContainer>
  )
}

export default Login
