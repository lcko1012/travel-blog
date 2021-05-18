import ACTIONS from './index'
import axios from 'axios'


//TODO: INSTALL LOGIN DISPATCH
export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    }
}

//TODO: GET USER INFOR
export const fetchUser = async (token) => {
    const res = await axios.get('/whoami', {
        headers: {Authorization: `Bearer ${token}`}
    })
    return res
}

export const dispatchGetUser = (res) => {
    if(res.data.role === "ROLE_ADMIN"){
        return {
            type: ACTIONS.GET_USER,
            payload: {
                user: res.data,
                isAdmin: true
            }
        }
    }
    else {
        return {
            type: ACTIONS.GET_USER, 
            payload: {
                user: res.data,
                isAdmin: false
            }
        }
    }
    
}