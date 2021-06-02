import { IStoreState } from './../store/types'
import { useSelector, shallowEqual } from 'react-redux'

interface ISelector<R> {
  (sRate: IStoreState): R
}

/** 浅比较获取 store信息 */
export default function useShallowEqualSelector<R = any>(
  /** 通过返回值获取store */
  selector: ISelector<R>,
): R {
  return useSelector<IStoreState, R>(selector, shallowEqual)
}
