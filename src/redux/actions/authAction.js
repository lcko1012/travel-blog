import ACTIONS from './index'
import axios from 'axios'


//TODO: INSTALL LOGIN DISPATCH
export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    }
}

//TODO: GET USER INFOR
// export const fetchUser = async (token) => {

// }