import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import authApis from './enum/authentication-apis'


const ActiveGmail = () => {
    const history = useHistory()
    const {token} = useParams()
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        const  registerConfirm = async () => {
            try {
                const res = await axios.post(authApis.confirmRegistration, {
                    token: token
                })
                if(res) {
                    setSuccess(true)
                }
            } catch (error) {
                setSuccess(false)
            }
        }
        if(token){
            registerConfirm()
        }
    }, [])

    useEffect(() => {
        if(success){
            setTimeout(() => {
                history.push('/')
            }, 3000)
        }
    }, [])

    return (
        <main className="main__auth">
            <div className="register">
            <h3 style={{color: "var(--color-primary)"}}>
                {success ? "Chúc mừng bạn đã đăng ký tài khoản thành công 🎉" : 
                "Đã có lỗi xảy ra, không thể kích hoạt tài khoản 🙁"
                }
            </h3>
            </div>
        </main>
    )
}

export default ActiveGmail
