import { FC, useEffect, Suspense, memo } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { IUserInfo } from '../store/module/user/reducer'
import { UserUrls } from '../api/user'
import LayoutLoading from '../components/loading/layout-loading'
import useActions from '../hooks/use-actions'
import useShallowEqualSelector from '../hooks/use-shallow-equal-selector'
import {
  handleFetchUserInfoFailed,
  handleFetchUserInfoSuccess,
  handleToggleEnterLoading,
  SuccessResult,
} from '../store/module/user/actionCreators'
import { getUserType } from '../utils/person'
import { normalRequest } from '../utils/request'
import config from '../config'
import { combineURL } from '../utils/tool'

/** 从 redux 中获取的 store 属性 */
interface IStoreProps {
  /** 进入加载状态 */
  enterLoading: boolean

  /** 登录令牌 */
  token: string
}

/** 行为回调函数 */
type IActionCallback = [
  /** 切换进场动画 */
  (isLoading: boolean) => void,

  /** 获取用户信息成功 */
  (result: SuccessResult) => void,

  /** 获取用户信息失败 */
  () => void,
]

/**
 * 初始化布局
 * 1. 根据 token 获取用户信息
 * 2. 有用户信息，初始化一些属性，没有的话去登录页
 */
const InitLayout: FC<RouteConfigComponentProps> = memo(props => {
  const { enterLoading, token } = useShallowEqualSelector<IStoreProps>(
    state => {
      const { enterLoading, token } = state.user

      return { enterLoading, token }
    },
  )

  const [toggleEnterLoading, fetchUserSuccess, fetchUserFailed] = useActions([
    /** 切换进场动画 */
    handleToggleEnterLoading,

    /** 获取用户信息成功 */
    handleFetchUserInfoSuccess,

    /** 获取用户信息失败 */
    handleFetchUserInfoFailed,
  ]) as IActionCallback

  useEffect(() => {
    /** 设置 enterLoading 为 true */
    toggleEnterLoading(true)

    /** 获取用户信息 */
    normalRequest<IUserInfo>({
      url: combineURL(config.API_URL, UserUrls.fetchUserInfo),
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        const { data } = res.data

        /** 获取用户信息成功：拿到用户信息，设置用户的角色 */
        const result: SuccessResult = {
          userInfo: data,
          role: getUserType(data),
        }
        fetchUserSuccess(result)
      })
      .catch(() => {
        /** 不做任何操作交给子组件来去处理 */
        /** 获取用户信息失败：设置用户信息为空，登录状态为假，清空token，重定向到登录页 */
        // fetchUserFailed()
        // props.history.replace('/system/login')
      })
      .finally(() => {
        /** 设置 enterLoading 为 false */
        toggleEnterLoading(false)
      })
  }, [toggleEnterLoading, fetchUserSuccess, fetchUserFailed])

  if (enterLoading) {
    return <LayoutLoading />
  }

  return (
    <Suspense fallback={<LayoutLoading />}>
      <div className="">{renderRoutes(props.route?.routes)}</div>
    </Suspense>
  )
})

export default InitLayout
