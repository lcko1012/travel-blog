import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import avatar from '../../asset/images/avatar.jpg'
import Cookies from 'js-cookie'
import axios from 'axios'

function Header() {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const userInfor = auth.user

    const [keyword, setKeyword] = useState('')

    const handleChangeKeyword = (e) => {
        const { value } = e.target
        setKeyword(value)
        console.log(keyword)
    }

    const handleFindSubmit = (e) => {
        e.preventDefault();
        console.log("sumit")
        window.location.href = `/search?keyword=${keyword}`
        
    }
    

    const handleLogout = () => {
        try {
            localStorage.removeItem('firstLogin')
            Cookies.remove('token')
            Cookies.remove('duration')
            window.location.href = "/"
        } catch (err) {
            window.location.href = "/"
        }
    }
    const loginMenu = () => {
        return (
            <div className="menu__right">
                <ul>
                    <li>
                        <Link to="/posts/new">
                            <i className="far fa-edit"></i>
                                Viết Bài
                        </Link>

                    </li>
                    <li >
                        <Link to="/bookmarks">
                            <i className="far fa-bookmark"></i>
                                BookMark
                        </Link>
                    </li>
                    <li className="menu__right--notify">
                        <i className="far fa-bell"></i>
                    </li>
                </ul>

                <div className="menu__right--avatar">
                    <img src={userInfor.avatarLink} />
                    <i className="fas fa-caret-down"></i>
                    <div className="menu__right--dropdown" id="dropDown" >
                        <Link to="/myprofile">
                            <i className="far fa-user"></i>
                            <p>Trang cá nhân</p>
                        </Link>
                        <Link to="/myprofile/edit">
                            <i className="far fa-user-edit"></i>
                            <p className="p-edit">Chỉnh sửa</p>
                        </Link>
                        <Link to="/" onClick={handleLogout}>
                            <i className="far fa-sign-out-alt"></i>
                            <p>Đăng xuất</p>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <>
            <header>
                <div className="menu container">
                    <div className="menu__left">
                        <Link to="/">
                            <p>
                                <i className="fal fa-map-marker-edit"></i>
                            Lang Thang
                        </p>
                        </Link>
                        <form onSubmit={handleFindSubmit}>
                            <i className="fal fa-search"></i>
                            <input 
                            onChange={handleChangeKeyword}
                            type="text" 
                            placeholder="Tìm kiếm theo tiêu đề bài viết hoặc nội dung" />
                        </form>

                    </div>
                    {auth.isLogged ? loginMenu() :
                        <Link to="/login">
                            <div className="menu__right menu__right__login">
                                <i className="far fa-user"></i>
                            Đăng nhập
                            </div>
                        </Link>
                    }
                </div>
            </header>
        </>

    )
}

export default Header
