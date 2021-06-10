import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import notify from './notifyReducer'
import realtime from './realtimeReducer'
import commentsReducer from './commentReducer'

export default combineReducers({
    auth,
    token,
    notify,
    realtime,
    commentsReducer
})