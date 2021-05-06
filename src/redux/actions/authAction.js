import ACTIONS from './index'
import axios from 'axios'


//TODO: INSTALL LOGIN DISPATCH
export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    }
}