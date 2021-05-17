import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { isLength, isMatch } from '../../utils/validation/Validation'

function ResetPassword() {
    const {token} = useParams()
    const [data, setData] = useState({
        password: '',
        matchedPassword: '',
        err:'',
        success: ''
    })

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value, err: '', success: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(isLength(password)){
            return setData({...data, err: "Mật khẩu không đủ 6 ký tự", success: ''})
        }
        if(!isMatch(matchedPassword, password)){
            return setData({...data, err:"Mật khẩu không giống nhau", success: ''})
        }

        var resetForm = new FormData()
        resetForm.append('token', token)
        resetForm.append('password', password)
        resetForm.append('matchedPassword', matchedPassword)
        

        try{
            const res = await axios.put('/auth/savePassword', resetForm)
            if(res) {
                setData({...data, success: 'Thay đổi mật khẩu thành công', err: ''})
            }
        }catch(err){
            console.log(err)
            err.response.status &&
            setData({...data, err: 'Đã xảy ra lỗi', success : ''})   
            ||
            err.response.status === 410 &&
            setData({...data, err: 'Quá thời gian lấy lại mật khẩu', success: ''})
            ||
            err.response.status === 400 && 
            setData({...data, err: 'Mật khẩu không đủ 6 ký tự', success: ''})
            || 
            err.response.status === 400 &&
            setData({...data, err: 'Không hợp lệ', success: ''})
            
        }
    }

    const {password, matchedPassword, err, success} = data 
    return (
        <main className="main__auth">
            <div class="register">
                <h3>Lấy lại mật khẩu</h3>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                <form onSubmit={handleSubmit}>
                    <input type="password" placeholder="Nhập mật khẩu mới" name="password"
                        value={password} onChange={handleChangeInput} />
                    <input type="password" placeholder="Nhập lại mật khẩu mới" name="matchedPassword"
                        value={matchedPassword} onChange={handleChangeInput} />
                    <button type="submit">
                        Xác nhận
                </button>
                </form>
            </div>
        </main>
    )
}

export default ResetPassword
