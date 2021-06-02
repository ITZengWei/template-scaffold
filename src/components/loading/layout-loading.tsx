import { FC } from 'react'
import { Spin } from 'antd'
import logoImg from '../../asserts/images/logo.png'

import { InitLayoutLoadingWrapper } from './style'

const LayoutLoading: FC = () => {
  return (
    <InitLayoutLoadingWrapper>
      <img src={logoImg} alt="" className="logo" />

      <Spin size="large" className="icon" spinning={true} />

      <p className="tip">正在进入后台，请稍后...</p>
    </InitLayoutLoadingWrapper>
  )
}

export default LayoutLoading
