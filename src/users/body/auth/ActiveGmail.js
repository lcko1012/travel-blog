import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ActiveGmail = () => {
    const {token} = useParams()
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        const  registerConfirm = async () => {
            try {
                const res = await axios.post("/auth/registrationConfirm", {
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
