// import { combineReducers } from 'redux-immutable'
import { combineReducers } from 'redux'

/** 引入 user 模块 reducer */
import { default as userReducer } from './module/user/reducer'

/** 合并所有的reducer */
export default combineReducers({
  user: userReducer,
})
