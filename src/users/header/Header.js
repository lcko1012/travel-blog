import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import avatar from '../../asset/images/avatar.jpg'

function Header() {
    const auth = useSelector(state => state.auth)

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
                        <input type="text" placeholder="Tìm kiếm..." />
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
                            <img src={avatar}  />
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
                                    <a href="">
                                        <i class="far fa-sign-out-alt"></i>
                                        <p>Đăng xuất</p>
                                    </a>
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
