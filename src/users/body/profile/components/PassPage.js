import axios from 'axios'
import Cookies, { set } from 'js-cookie'
import React, { useState } from 'react'
import { showErrMsg80, showSuccessMsg80 } from '../../../utils/notification/Notification'

const PassPage = () => {
    const [data, setData] = useState({
        oldPassword: '',
        password: '',
        matchedPassword: '',
        err: '',
        success: ''
    })

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        
    }

    const handleSubmitPassword = async (e) => {
        e.preventDefault()
        try {
            const token = Cookies.get('token')
            console.log(data)
            var passForm = new FormData()
            passForm.append('oldPassword', data.oldPassword)
            passForm.append('password', data.password)
            passForm.append('matchedPassword', data.matchedPassword)
            

            const res = await axios.put('/user/update/password', passForm)

            if(res) {
                console.log(res)
                setData({...data, err: '', success: 'Đổi mật khẩu thành công'})
            }
        } catch (error) {
            console.log(error)
            setData({...data, err: 'Đổi mật khẩu thất bại', success: ''})
            
        }
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column' }} 
            onSubmit={handleSubmitPassword}
            >
            {data.err && showErrMsg80(data.err)}
            {data.success && showSuccessMsg80(data.success)}
            <div className="editProfile__field">
                <div className="editProfile__field-warning">
                    <p style={{textAlign: 'center'}}>Mật khẩu phải dài hơn 6 ký tự</p>
                </div>
            </div>

            <div className="editProfile__field">
                <p>Mật khẩu cũ</p>
                <div>
                <i className="fad fa-lock-alt"></i>
                    <input type="text"
                        onChange={handleChangeInput}
                        name="oldPassword"
                        
                    ></input>
                </div>
            </div>
            <div className="editProfile__field">
                <p>Mật khẩu mới</p>
                <div>
                <i className="fad fa-lock-alt"></i>
                    <input type="password"
                        onChange={handleChangeInput}
                        name="password"
                    ></input>
                </div>

            </div>
            <div className="editProfile__field">
                <p>Xác nhận mật khẩu mới</p>
                <div>
                <i className="fad fa-lock-alt"></i>
                    <input type="password"
                    onChange={handleChangeInput}
                    name="matchedPassword"
                    ></input>
                </div>

            </div>
            <div>
                <button type="submit" className="editProfile__submitBtn">
                    <i className="fal fa-save" style={{marginRight: '5px'}}></i>
                    Đổi mật khẩu</button>
            </div>
        </form>
    )
}

export default PassPage
