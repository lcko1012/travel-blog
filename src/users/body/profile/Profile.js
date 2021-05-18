import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../utils/Loading/Loading'
import CurrentPost from '../home/components/CurrentPost'

import "./Profile.css"

function Profile() {
    const [id, setId] = useState(useParams().id)
    console.log(id)
    const [userInfor, setUserInfor] = useState({})
    const [posts, setPosts] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const getUserInfor = async () => {
            const res = await axios.get(`/user/${id}`)
            setUserInfor(res.data)
            setLoading(true)
        }
        const getPosts = async () => {
            const res = await axios.get(`/user/posts/${id}`)
            setPosts(res.data)
        }
        getUserInfor()
        getPosts()
    }, [id])

    return (
        <>
            {isLoading ?
                <main className="main__home">
                    <div className="container">
                        <div className="row">
                            {/* TODO: TAB INFOR */}
                            <div className="mt-30 col-lg-4" >
                                <div className="information">
                                    <div class="author-info">
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
                                            {userInfor.about}
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
                                        <div className="post-info-button" style={{ marginTop: '10px' }}>
                                            <button className="bookmark-btn">Follow</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* TODO: TAB POSTS */}
                            <div className="mt-30 col-lg-8" >
                                {posts.map((post, index) => {
                                    return (
                                        <CurrentPost post={post} />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </main>

                :
                <Loading />
            }

        </>
    )
}

export default Profile
