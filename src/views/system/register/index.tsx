import { FC, useState, memo, useMemo, useCallback } from 'react'
import { Spin, Form, Input, Button, message } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  PropertySafetyOutlined,
} from '@ant-design/icons'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Brand } from '../login'
import { LoginWithRegisterContainer, FormAreaWra } from '../login/style'
import { throttle } from '../../../utils/tool'
import { registerRequest, RegisterParams } from '../../../api/user'
import { fetchCode, CodeType } from '../../../api/code'
import formStrategy from '../../../utils/validator'

const { useForm } = Form

const Register: FC<RouteComponentProps> = memo(props => {
  const [isLoading, setLoading] = useState(false)
  const { history } = props
  const [form] = useForm()

  const changeFormValue = useCallback(
    (name: string, val: string) => {
      form.setFieldsValue({ [name]: val })
    },
    [form],
  )

  const onFinish = useMemo(() => {
    return throttle((result: RegisterParams) => {
      setLoading(true)
      registerRequest(result)
        .then(res => {
          const { code } = res.data
          if (code === 200) {
            message.success('注册成功~')
            history.push('/system/login')
          }
          setLoading(false)
        })
        .catch(error => {
          setLoading(false)
          message.error(error.msg)
        })
    }, 1200)
  }, [history]) as any

  const handleFetchCode = () => {
    return message.info('验证码暂时为：200')
    fetchCode({ codeType: CodeType.register }).then(res => {})
  }

  return (
    <LoginWithRegisterContainer>
      <Brand />
      <FormAreaWra>
        <Spin spinning={isLoading}>
          <h4 className="formArea__title">管理员注册</h4>
          <Form
            name="normal_register"
            className="register-form"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              className="formArea__item"
              name="account"
              rules={[{ required: true, message: '账号不能为空!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="账号"
              />
            </Form.Item>
            <Form.Item
              className="formArea__item"
              name="psw"
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item
              className="formArea__item"
              name="tel"
              rules={[
                {
                  validator(rule, val) {
                    if (!formStrategy.useStrategy('validTel', val)) {
                      return Promise.reject('请正确输入手机号!')
                    }

                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                prefix={<MobileOutlined className="site-form-item-icon" />}
                placeholder="手机号"
              />
            </Form.Item>
            <Form.Item
              className="formArea__item formArea__item--code"
              name="code"
              rules={[{ required: true, message: '验证码不能为空!' }]}
            >
              <>
                <Input
                  name="code"
                  prefix={
                    <PropertySafetyOutlined className="site-form-item-icon" />
                  }
                  style={{ width: 200 }}
                  onChange={e => changeFormValue('code', e.target.value)}
                  placeholder="验证码"
                />
                <Button style={{ marginLeft: 5 }} onClick={handleFetchCode}>
                  获取验证码
                </Button>
              </>
            </Form.Item>
            <div className="to-register">
              <Button type="link">
                <Link to="/system/login" replace>
                  返回登录
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
                立即注册
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </FormAreaWra>
    </LoginWithRegisterContainer>
  )
})

export default Register
