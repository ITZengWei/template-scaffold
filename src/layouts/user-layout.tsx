import { FC, memo } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

const UserLayout: FC<RouteConfigComponentProps> = memo((props: any) => {
  return <div className="">{renderRoutes(props.route?.routes)}</div>
})

export default UserLayout
