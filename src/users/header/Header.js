import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import avatar from '../../asset/images/avatar.jpg'
import Cookies from 'js-cookie'
import axios from 'axios'

function Header() {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    useEffect(() => {
        console.log("zo header")
        if (localStorage.getItem("firstLogin")) {
            const getToken = async () => {
                console.log(token)
                const res = await axios.post("/auth/refreshToken", null, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                Cookies.set("token", res.data.token)
                Cookies.set("duration", res.data.duration)
            }
            const token = Cookies.get("token")
            const duration = Cookies.get("duration")
            
            if (token && duration) {
                const interval = setInterval(() => {
                    console.log("get refresh token")
                    getToken()
                }, 180000)
                return () => clearInterval(interval)
            }
        }
    }, [auth.isLogged, dispatch])

   

    const handleLogout = () => {
        try {
            localStorage.removeItem('firstLogin')
            Cookies.remove('token')
            Cookies.remove('duration')
            // localStorage.removeItem('token')
            window.location.href = "/"
        } catch (err) {
            window.location.href = "/"
        }
    }

    const loginMenu = () => {
        return (
            <header>
                <div className="menu container">
                    <div className="menu__left">
                        <Link to="/">
                            <p>
                                <i className="fal fa-map-marker-edit"></i>
                                Lang Thang
                            </p>
                        </Link>
                        <form>
                            <i class="fal fa-search"></i>
                            <input type="text" placeholder="Tìm kiếm theo tiêu đề bài viết hoặc nội dung" />
                        </form>
                    </div>


                    <div className="menu__right">

                        <ul>
                            <li>
                                <Link to="/posts/new">
                                    <i class="far fa-edit"></i>
                                Viết Bài
                                </Link>

                            </li>
                            <li >
                                <i class="far fa-bookmark"></i>
                                BookMark
                            </li>
                            <li className="menu__right--notify">
                                <i class="far fa-bell"></i>
                            </li>
                        </ul>

                        <div className="menu__right--avatar">
                            <img src={avatar} />
                            <i class="fas fa-caret-down"></i>
                            <div class="menu__right--dropdown" id="dropDown" >
                                <a href="">
                                    <i class="far fa-user"></i>
                                    <p>Trang cá nhân</p>
                                </a>
                                <a href="">
                                    <i class="far fa-user-edit"></i>
                                    <p className="p-edit">Chỉnh sửa</p>
                                </a>
                                <Link to="/" onClick={handleLogout}>
                                    <i class="far fa-sign-out-alt"></i>
                                    <p>Đăng xuất</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        )
    }


    return (
        <>
            {auth.isLogged ? loginMenu() :
                <header>
                    <div className="menu container">
                        <div className="menu__left">
                            <Link to="/">
                                <p>
                                    <i className="fal fa-map-marker-edit"></i>
                            Lang Thang
                        </p>
                            </Link>
                            <form>
                                <i class="fal fa-search"></i>
                                <input type="text" placeholder="Tìm kiếm theo tiêu đề bài viết hoặc nội dung" />
                            </form>


                        </div>
                        <Link to="/login">
                            <div className="menu__right menu__right__login">
                                <i className="far fa-user"></i>
                        Đăng nhập
                    </div>
                        </Link>
                    </div>
                </header>

            }
        </>

    )
}

export default Header
