import { FC, memo, useReducer, useContext, useMemo, useEffect } from 'react'
import { Tag } from 'antd'
import { MenuContext } from './context'
import { useHistory, useLocation } from 'react-router-dom'
import { getFlattenMenus } from '../../utils/menu'
import { SettingStyle } from '../../styles'

interface IHistoryState {
  title: string
  path: string
  active: boolean
}

type IHistoryActionTypes = 'add' | 'remove' | 'toggle' | 'other'

interface IHistoryAction {
  type: IHistoryActionTypes
  payload: any
}

/** 参数荷载 */
type Payload = {
  /** 添加——对象数据类型 */
  add: IHistoryState

  /** 根据标题去切换 */
  toggle: string

  /** 根据标题去删除 */
  remove: string

  /** 其他 */
  other: any
}

const defaultHistoryState: IHistoryState[] = []

type historyReducerType = (
  state: IHistoryState[],
  action: IHistoryAction,
) => IHistoryState[]

const historyReducer: historyReducerType = (state, action) => {
  let { payload, type } = action

  switch (type) {
    /** 通过传标题，删除成员 */
    case 'remove':
      return state.filter(item => item.title !== payload)

    /** 添加成员，检查是否能找到标题 */
    case 'add':
      if (state.find(item => item.title === payload.title)) {
        return state
      }

      return [
        /** 取消所有高亮 */
        ...state.map(item => {
          item.active = false
          return item
        }),
        payload,
      ]

    /** 切换高亮 */
    case 'toggle':
      return state.map(item => {
        if (item.title === payload) {
          item.active = true
        } else {
          item.active = false
        }
        return item
      })

    /** Test */
    case 'other':
      console.log(action)
      return state
    default:
      return state
  }
}

const ContainerHistory: FC = memo(() => {
  const [historyState, historyDispatch] = useReducer(
    historyReducer,
    defaultHistoryState,
  )
  const { menus } = useContext(MenuContext)

  const location = useLocation()

  const history = useHistory()

  /** 扁平化的菜单数据 */
  const flattenMenus = useMemo(() => getFlattenMenus(menus), [menus])

  function transformDispatch<T extends IHistoryActionTypes>(
    type: T,
    payload: Payload[T],
  ) {
    historyDispatch({ type, payload })
  }

  const handleClose = (item: IHistoryState) => {
    const { active, title } = item

    transformDispatch('remove', title)

    /** 如果删除是激活状态，切换高亮删除后的最后一个成员(注意这里的 historyState 还是以前的数据) */
    if (active) {
      const len = historyState.length

      let lastItem = historyState[len - 1]

      // 当前就是最后一个，那就往前移动
      if (lastItem.title === title) {
        lastItem = historyState[len - 2]
      }

      handleToggle(lastItem)
    }
  }

  const handleToggle = (item: IHistoryState) => {
    const { active, title, path } = item

    if (active) return

    transformDispatch('toggle', title)

    history.replace(path)
  }

  useEffect(() => {
    const { pathname } = location
    const currentMenu = flattenMenus.find(menu => menu.path === pathname)

    if (!currentMenu) return

    transformDispatch('add', {
      title: currentMenu.title,
      path: currentMenu.path,
      active: true,
    })
  }, [location.pathname, flattenMenus])

  return (
    <div className="routerHistory">
      <div className="routerHistory__inner">
        {historyState.map(item => (
          <Tag
            color={item.active ? SettingStyle['theme-color'] : ''}
            key={item.title}
            closable={historyState.length !== 1}
            visible
            onClose={() => handleClose(item)}
            onClick={() => handleToggle(item)}
          >
            {item.title}
          </Tag>
        ))}
      </div>
    </div>
  )
})

export default ContainerHistory
