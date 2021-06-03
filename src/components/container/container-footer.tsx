import { FC, memo } from 'react'
import { Layout } from 'antd'
import { ContainerFooterInner } from './style'

const ContainerFooter: FC = memo(() => {
  return (
    <Layout.Footer>
      <ContainerFooterInner>
        <span>© 2020 Small's Blog 版权所有</span>
        <span>网站备案号: 赣ICP备20000355号</span>
        <span>
          联系电话： <a href="tel:13407943933">13407943933</a>
        </span>
      </ContainerFooterInner>
    </Layout.Footer>
  )
})

export default ContainerFooter
