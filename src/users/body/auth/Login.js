import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import {dispatchLogin} from '../../../redux/actions/authAction'
import {useDispatch} from 'react-redux'
import {showErrMsg, showSuccessMsg} from '../../utils/notification/Notification'
import { isEmail, isEmpty, isLength } from '../../utils/validation/Validation'
import Cookies from 'js-cookie'
import {GoogleLogin} from 'react-google-login'

const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}


function Login() {
    // const auth = useSelector(state => state.auth)
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()
    const {email, password, err, success} = user

    const handleChangeInput = e => {
        const {name, value} = e.target
        setUser({...user, [name]: value, err: '', success: ''})
    }

    //TODO: LOGIN: Nếu người dùng nhấn đăng nhập thì lưu local là đã đăng nhập
    const handleSubmit = async e => {
        console.log("Call submit function")
        e.preventDefault()
        if(isEmpty(email) || isEmpty(password)){
            return setUser({...user, err: 'Hãy điền đầy đủ thông tin', success: ''})
        }

        if(!isEmail(email)){
            return setUser({...user, err: 'Email không đúng định dạng', success: ''})
        }

        if(isLength(password)){
            return setUser({...user, err: "Mật khẩu không đủ 6 ký tự", success: ''})
        }

        var loginForm = new FormData()
            loginForm.append('email', email)
            loginForm.append('password', password)

        try {
            const res = await axios.post('/auth/login' , loginForm)
            // const res = await axios.post('localhost:5000/login',{email: "loveya227@gmail.com", password: "12345678"}, {withCredentials: true})
            if(res){
                setUser({...user, err:'', success: res.data.msg})
                console.log("token", res)
                localStorage.setItem('firstLogin', true)
                //Da Dang Nhap
                dispatch(dispatchLogin())
                Cookies.set('token', res.data.token)
                Cookies.set('duration', res.data.duration)

                history.push("/")
            }
        }catch(err){
            console.log(err.response.status)

            if(err.response.status === 401){
                setUser({...user, err: 'Sai email hoặc password', success: ''})
            }
            else if(err.response.status === 400){
                setUser({...user, err: 'Email hoặc password không hợp lệ', success: ''})
            }
            else {
                setUser({...user, err: 'Đã có lỗi xảy ra', success: ''})
            }
            
        }
    }

    const responseGoogle = async (response) => {
        console.log(response)
        try{
            const google_token = response.tokenId
            console.log(google_token)
            var loginForm = new FormData()
            loginForm.append('google_token', google_token)
    
            const res = await axios.post('/auth/google', loginForm)
            setUser({...user, err: '', success: 'Đăng nhập thành công'})
            console.log(res)
            dispatch(dispatchLogin())
            localStorage.setItem('firstLogin', true)
            Cookies.set('token', res.data.token)
            Cookies.set('duration', res.data.duration)
            history.push('/')
        }catch(err){
            console.log(err)
        }
        
    }

    return (
        <main className="main__auth">
        <div className="register">
            <h3>Đăng nhập</h3>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}

            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email của bạn" name="email" value={email} onChange={handleChangeInput}/>
                <input type="password" placeholder="Mật khẩu" name="password" value={password} onChange={handleChangeInput}/>
                <button type="submit">
                    ĐĂNG NHẬP
                </button>
                <Link to="/forgot_password">
                    Quên mật khẩu?
                </Link>
                
            <div className="register__divider">
                <span>OR</span>
            </div>
            </form>
            <div className="register__social">
                {/* <a href="" class="register__social--facebook">
                    <i class="fab fa-facebook-f"></i>
                    Facebook</a> */}
                <GoogleLogin
                clientId="545452035521-c4eljpuu1281eml2ci6kaud39s5kc9ct.apps.googleusercontent.com"
                buttonText="Đăng nhập bằng Google"
                onSuccess={responseGoogle}
                cookiePolicy={'single_host_origin'}
                />
            </div>
            <Link to="/register">
                <p className="register__link">
                    Không có tài khoản? Đăng ký ở đây
                </p>
            </Link>
        </div>
    </main>
    )
}

export default Login
