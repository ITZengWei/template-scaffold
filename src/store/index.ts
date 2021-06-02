import { createStore, applyMiddleware, Middleware } from 'redux'

/** 引入 thunk 处理异步 action */
import thunk from 'redux-thunk'

/** 导出合并的reducer */
import rootReducer from './reducer'

/** 中间件数组 */
const middleware: Middleware[] = [thunk]

/** 导出最终的story对象 */
export default createStore(rootReducer, applyMiddleware(...middleware))
