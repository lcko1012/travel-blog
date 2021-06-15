import React, { useEffect, useState } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import avatar from '../../asset/images/avatar.jpg'
import Cookies from 'js-cookie'
import axios from 'axios'
import { dispatchLogout } from '../../redux/actions/authAction'
import ReactHtmlParser from 'react-html-parser'
import Notify from './Notify'
import CookiesService from '../../services/CookiesService'
import useSocketDataObject from '../../real-time/useSocketDataObject'

function Header() {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const userInfor = auth.user
    const history = useHistory()
    const cookiesService = CookiesService.getService()
    const {Unsubscribe_notify} = useSocketDataObject()
    const [keyword, setKeyword] = useState('')
    const {isAdmin} = auth

    const handleChangeKeyword = (e) => {
        const { value } = e.target
        setKeyword(value)
    }

    const handleFindSubmit = (e) => {
        e.preventDefault();
        // var _keyword = keyword
        // console.log(_keyword)
        history.push(`/search?keyword=${keyword}`)
        console.log("submit")

        setKeyword("")

    }


    const handleLogout = () => {
        try {
            cookiesService.clearToken()
            dispatch(dispatchLogout())
            Unsubscribe_notify()
            history.push("/")
        } catch (err) {
            history.push("/")
        }
    }

    //TODO: SHOW BẢNG THÔNG BÁO

    const loginMenu = () => {
        return (
            <div className="menu__right">
                <ul>
                    <li>
                        <Link to="/posts/new">
                            <i className="far fa-edit"></i>
                            <span> Viết bài</span>
                        </Link>

                    </li>
                    <li >
                        <Link to="/bookmarks">
                            <i className="far fa-bookmark"></i>
                            <span>BookMark</span>
                        </Link>
                    </li>
                    {/* <li className="menu__right--notify">
                        <i className="far fa-bell"></i>
                    </li> */}
                    <Notify/>
                </ul>

                <div className="menu__right--avatar">
                    <img src={ReactHtmlParser(userInfor.avatarLink)} />
                    <i className="fas fa-caret-down"></i>
                    <div className="menu__right--dropdown" id="dropDown" >
                        {isAdmin ?
                        <Link to="/admin/dashboard">
                            <i className="fal fa-users-cog"></i>
                            <p>Trang admin</p>
                        </Link> : null}
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
                            <span>Lang Thang</span>
                            </p>
                        </Link>
                        <form onSubmit={handleFindSubmit}>
                            <i className="fal fa-search"></i>
                            <input
                                onChange={handleChangeKeyword}
                                value={keyword}
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
