import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import CurrentPost from '../home/components/CurrentPost'
import Empty from '../../utils/Empty/Empty'
import ReactHtmlParser from 'react-html-parser'


const MyProfile = () => {
    const auth = useSelector(state => state.auth)
    const userInfor = auth.user
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getPosts = async () => {
            const res = await axios.get(`/user/posts/${userInfor.accountId}`)
            setPosts(res.data)
        }
        if (userInfor.accountId) {
            getPosts()
        }
        console.log(posts)
    }, [userInfor.accountId])

    return (
        <main className="main__home">
            <div className="container">
                <div className="row">
                    {/* TODO: TAB INFOR */}
                    <div className="mt-30 mb-30 col-lg-4" >
                        <div className="information">
                            <div className="author-info">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="avatar" style={{ backgroundImage: `url(${userInfor.avatarLink})` }} ></div>
                                    <div className="post-count">
                                        <h4>{userInfor.postCount}</h4>
                                        <p>Bài viết</p>
                                    </div>
                                    <div className="follower-count inline-item">
                                        <h4>{userInfor.followCount}</h4>
                                        <p>Người theo dõi</p>
                                    </div>
                                </div>
                                <h5 className="author-name">{userInfor.name}</h5>
                                <p style={{ fontSize: "14px" }}>
                                    {ReactHtmlParser(userInfor.about)}
                                    {/* {userInfor.about} */}
                                </p>
                                <div className="author__infor--count mt-30 d-flex">
                                    <div className="count__div">
                                        <h5>Số Bookmark: </h5>
                                        <h4 >{userInfor.bookmarkOnOwnPostCount}</h4>
                                    </div>
                                    <div className="count__div">
                                        <h5>Số Comment: </h5>
                                        <h4>{userInfor.commentOnOwnPostCount}</h4>
                                    </div>
                                </div>
                                {/* <div className="post-info-button" style={{ marginTop: '10px' }}>
                                    <button className="bookmark-btn">Chỉnh sửa trang cá nhân</button>
                                </div> */}

                            </div>
                        </div>
                    </div>
                    {/* TODO: TAB POSTS */}
                    <div className="mt-30 col-lg-8" >
                        {posts.length=== 0 ? <Empty />  :
                        posts.map((post, index) => {
                            return (
                                <CurrentPost post={post} key={index} />
                            )
                        })}
                        
                    </div>
                </div>
            </div>
        </main>
    )
}

export default MyProfile
