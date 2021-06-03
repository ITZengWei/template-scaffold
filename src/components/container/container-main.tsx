import { FC, memo } from 'react'
import { Layout } from 'antd'
import { ContainerMainInner } from './style'

const ContainerMain: FC = memo(props => {
  return (
    <Layout.Content>
      <ContainerMainInner> {props.children}</ContainerMainInner>
    </Layout.Content>
  )
})

export default ContainerMain
