import { FC, memo } from 'react'
import { Layout } from 'antd'
import { ContainerMainInner } from './style'
import ErrorBoundary from '../error-boundary'

const ContainerMain: FC = memo(props => {
  return (
    <ErrorBoundary>
      <Layout.Content>
        <ContainerMainInner> {props.children}</ContainerMainInner>
      </Layout.Content>
    </ErrorBoundary>
  )
})

export default ContainerMain
