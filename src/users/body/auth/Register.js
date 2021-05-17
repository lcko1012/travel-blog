import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { isEmail, isEmpty, isLength, isMatch } from '../../utils/validation/Validation'


function Register() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        matchedPassword: '',
        err: '',
        success: ''
    })

    const {name, email, password, matchedPassword, err, success} = user

    const handleChangeInput = (e) => {
        const {name, value} = e.target
        setUser({...user, [name]: value, err: '', success: ''})
    }

    const handleSubmit = async e => {
        e.preventDefault()
        
        if(isEmpty(email) || isEmpty(password) || isEmpty(matchedPassword) || isEmpty(name)){
            return setUser({...user, err: 'Hãy điền đầy đủ thông tin', success: ''})
        }

        if(!isEmail(email)){
            return setUser({...user, err: 'Email không đúng định dạng', success: ''})
        }

        if(isLength(password)){
            return setUser({...user, err: "Mật khẩu phải lớn hơn 6 ký tự", success: ''})
        }

        if(!isMatch(matchedPassword, password)){
            return setUser({...user, err:"Mật khẩu không giống nhau", success: ''})
        }
        try{
            var registerForm = new FormData()
            registerForm.append('name', name)
            registerForm.append('email', email)
            registerForm.append('password', password)
            registerForm.append('matchedPassword', matchedPassword)

            const res = await axios.post('/auth/registration', registerForm)
            // headers: { "Content-Type": "multipart/form-data" },
            // setUser({...user, err: '', success: res.data})
            if(res.status === 202) {
                setUser({...user, err: '', success: 'Kiểm tra email để kích hoạt tài khoản'})
            }
        }catch(err){
            err.response.data &&
            setUser({...user, err: err.response.data, success: ''})
        }
    }
    return (
        <main className="main__auth">
        <div class="register">
            <h3>Creat an account</h3>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Tên tài khoản" name="name" 
                value={name} onChange={handleChangeInput}/>

                <input type="email" placeholder="Nhập email" name="email" 
                value={email} onChange={handleChangeInput} />

                <input type="password" placeholder="Mật khẩu" name="password"
                value={password} onChange={handleChangeInput}/>

                <input type="password" placeholder="Nhập lại mật khẩu" name="matchedPassword" 
                value={matchedPassword} onChange={handleChangeInput}/>

                <button type="submit">
                    SUBMIT & REGISTER 
                </button>
                
            <div class="register__divider">
                <span>OR</span>
            </div>
            </form>
            <div class="register__social">
                <a href="#" class="register__social--facebook">
                    <i class="fab fa-facebook-f"></i>
                    Facebook</a>
                <a href="#" class="register__social--google">
                    <i class="fab fa-google"></i>
                    Google</a>
            </div>

        </div>
    </main>
    )
}

export default Register
