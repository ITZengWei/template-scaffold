import { PureComponent, FC, memo } from 'react'
import { Empty, Button } from 'antd'
import { ErrorFallbackWrapper } from './style'

/** 降级备用渲染 UI */
const ErrorFallback: FC = memo(() => {
  const handleClick = () => {
    window.location.reload()
  }

  return (
    <ErrorFallbackWrapper>
      <Empty description="资源错误">
        <h1>
          资源加载失败！ <Button onClick={handleClick}>点击重试</Button>
        </h1>
      </Empty>
    </ErrorFallbackWrapper>
  )
})

interface ErrorBoundaryProps {
  /** 是否有错误 */
  hasError: boolean

  /** 错误信息 */
  errMsg: string
}

/** 错误边界组件 */
export default class ErrorBoundary extends PureComponent<
  any,
  ErrorBoundaryProps
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, errMsg: '' }
  }

  static getDerivedStateFromError(error: Error) {
    const { message } = error
    return { hasError: true, errMsg: message }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.dir('error', error)
    console.error('error position', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}
