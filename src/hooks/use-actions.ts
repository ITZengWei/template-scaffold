import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { IAction, AsyncAction } from '../store/types'

interface ActionCb {
  /** 同步行为 && 异步行为 TODO bindActionCreators 能弄异步行为吗? */
  (...args: any[]): AsyncAction | IAction
}

/** 绑定一个或多个actions */
export default function useActions(
  /** 行为集合 */
  actions: ActionCb[] | ActionCb,
  /** 更新依赖 */
  deps?: any[],
): any {
  /** 拿到 redux 中的 dispatch */
  const dispatch = useDispatch()

  /** 依赖收集 */
  deps = deps ? [...deps, dispatch] : [dispatch]

  return useMemo(() => {
    if (Array.isArray(actions)) {
      return actions.map(action => bindActionCreators(action, dispatch))
    }

    return bindActionCreators(actions, dispatch)
  }, deps)
}
