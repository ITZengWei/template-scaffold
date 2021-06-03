import { FC, memo, Suspense } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RouteConfigComponentProps } from 'react-router-config'
import { renderRoutes } from 'react-router-config'
import { IStoreState } from '../store/types'
import Container from '../components/container'

const BaseLayout: FC<RouteConfigComponentProps> = memo(props => {
  const { route } = props

  const isLogin = useSelector<IStoreState, Boolean>(state => state.user.isLogin)

  /** 没有登录重定向到登录页 */
  if (!isLogin) {
    return <Redirect to="/system/login" />
  }

  return (
    <Container>
      <Suspense fallback={<div>base loading</div>}>
        {renderRoutes(route?.routes)}
      </Suspense>
    </Container>
  )
})

export default BaseLayout
