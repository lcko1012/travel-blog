import React, { useState, useEffect } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import axios from 'axios'
import {dispatchLogin} from '../../../redux/actions/authAction'
import {useDispatch, useSelector} from 'react-redux'


const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}


function Login() {
    const auth = useSelector(state => state.auth)
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()
    const {email, password, err, success} = user

    const handleChangeInput = e => {
        const {name, value} = e.target
        setUser({...user, [name]: value, err: '', success: ''})
    }

    // useEffect(() => {
    //     if(auth.isLogged){
    //         return(<Redirect to="/"/>)
    //     }
        
    // }, [auth.isLogged, dispatch])

    const handleSubmit = async e => {
        console.log("Call submit function")
        e.preventDefault()
        try {
            // const res = await axios.post('/users/signin' , {email, password}, {withCredentials: true})
            // if(res){

            //     setUser({...user, err:'', success: res.data.msg})
            //     console.log("token", res.data.token)
            //     localStorage.setItem('firstLogin', true)
            //     //Da Dang Nhap
            //     dispatch(dispatchLogin())
            //     history.push("/")
            //     //Luu Token
            //     // dispatch({type: 'GET_TOKEN', payload: res.data.token})
            // }

            dispatch(dispatchLogin())
            localStorage.setItem('firstLogin', true)
            dispatch({type: 'GET_TOKEN', password: 'kieuoanh'})
            return(<Redirect to="/"/>)
        }catch(err){
            // err.response.data.msg && 
            // setUser({...user, err: err.response.data.msg, success: ''})
        }
    }

    return (
        <main className="main__auth">
        <div class="register">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" name="email" value={email} onChange={handleChangeInput}/>
                <input type="password" placeholder="Password" name="password" value={password} onChange={handleChangeInput}/>
                <button type="submit">
                    LOG IN
                </button>
                <Link>
                    Forgot password?
                </Link>
                
            <div class="register__divider">
                <span>OR</span>
            </div>
            </form>
            <div class="register__social">
                <a href="" class="register__social--facebook">
                    <i class="fab fa-facebook-f"></i>
                    Facebook</a>
                <a href="" class="register__social--google">
                    <i class="fab fa-google"></i>
                    Google</a>
            </div>
            <Link to="/register">
                <p className="register__link">
                    Don't have an account? Register
                </p>
            </Link>
        </div>
    </main>
    )
}

export default Login
