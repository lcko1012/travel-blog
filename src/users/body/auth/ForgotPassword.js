import React from 'react'
import { useState } from 'react'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import axios from 'axios'
import { isEmail, isEmpty } from '../../utils/validation/Validation'

function ForgotPassword() {
    const [data, setData] = useState({
        email: '',
        err: '',
        success: ''
    })
    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value, err: '', success: '' })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isEmpty(email)) {
            return setData({ ...data, err: 'Hãy điền đầy đủ thông tin', success: '' })
        }

        if (!isEmail(email)) {
            return setData({ ...data, err: 'Email không đúng định dạng', success: '' })
        }

        var resetForm = new FormData()
        resetForm.append('email', email)
        try {
            const res = await axios.post('/auth/resetPassword', resetForm)
            if (res) {
                setData({ ...data, success: 'Hãy kiểm tra email của bạn', err: '' })
            }
        } catch (err) {
            console.log(err)
            err.response.status === 400 &&
                setData({ ...data, err: 'Email không đúng định dạng', success: '' })
                ||
                err.response.status === 404 &&
                setData({ ...data, err: 'Email không hợp lệ', success: '' })
        }
    }

    const { email, err, success } = data

    return (
        <main className="main__auth">
            <div class="register">
                <h3>Lấy lại mật khẩu</h3>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                <form onSubmit={handleSubmit}>

                    <input type="email" placeholder="Nhập tài khoản email của bạn" name="email"
                        value={email} onChange={handleChangeInput} />

                    <button type="submit">
                        Gửi 
                </button>
                </form>
            </div>
        </main>
    )
}

export default ForgotPassword
