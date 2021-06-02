import { FC, memo } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { ErrorLayoutWrapper } from './style'

const ErrorLayout: FC<RouteConfigComponentProps> = memo(props => {
  return (
    <ErrorLayoutWrapper>{renderRoutes(props.route?.routes)}</ErrorLayoutWrapper>
  )
})

export default ErrorLayout
