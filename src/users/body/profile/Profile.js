import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Empty from '../../utils/Empty/Empty'
import Loading from '../../utils/Loading/Loading'
import CurrentPost from '../home/components/CurrentPost'
import ReactHtmlParser from 'react-html-parser'
import "./Profile.css"
import profileApis from './enum/profile-apis'
import Cookies from 'js-cookie'

function Profile() {
    const history = useHistory()
    const id = useParams().id
    const [userInfor, setUserInfor] = useState({})
    const [posts, setPosts] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const getUserInfor = async () => {
            const res = await axios.get(profileApis.getUserInfor(id))
            if(res){
                setUserInfor(res.data)
                setLoading(true) 
            }
        }

        const getPosts = async () => {
            const res = await axios.get(profileApis.getPostsOfUser(id))
            if(res){
                setPosts(res.data)
            }
        }

        getUserInfor()
        getPosts()
    }, [id])

    const handleClickFollow = () => {
        const token = Cookies.get("token")
        if(!token) return history.push('/login')
        const postFollow = async () => {
            try {
                const res = await axios.put(profileApis.followUser(id), null)
                if (res) {
                    setUserInfor({ ...userInfor, followCount: res.data, followed: !userInfor.followed })
                }
            } catch (err) {
                console.log(err)
            }

        }
        postFollow()
    }

    return (
        <>
            {isLoading ?
                <main className="main__home">
                    <div className="container">
                        <div className="row">
                            {/* TODO: TAB INFOR */}
                            <div className="mt-30 col-lg-4" >
                                <div className="information">
                                    <div className="author-info">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="avatar" style={{ backgroundImage: `url(${ReactHtmlParser(userInfor.avatarLink)})` }} ></div>
                                            
                                            <div className="post-count">
                                                <h4>{userInfor.postCount}</h4>
                                                <p>Bài viết</p>
                                            </div>

                                            <div className="follower-count inline-item">
                                                <h4>{userInfor.followCount}</h4>
                                                <p>Người theo dõi</p>
                                            </div>
                                        </div>
                                        <h5 className="author-name" style={{ marginTop: '5px' }}>{userInfor.name}</h5>
                                        
                                        <div className="author__social">
                                            <i className="fab fa-instagram" onClick={() => window.open(ReactHtmlParser(userInfor.instagramLink), '_blank')} ></i>
                                            <i className="fab fa-facebook-square" onClick={() => window.open(ReactHtmlParser(userInfor.fbLink), '_blank')}></i>
                                        </div>
                                        
                                        <p style={{ fontSize: "14px" }}>
                                            {userInfor.about}
                                        </p>
                                        
                                        <div className="author__infor--count mt-15 d-flex">
                                            <div className="count__div">
                                                <h5>Số Bookmark: </h5>
                                                <h4 >{userInfor.bookmarkOnOwnPostCount}</h4>
                                            </div>
                                            
                                            <div className="count__div">
                                                <h5>Số bình luận: </h5>
                                                <h4>{userInfor.commentOnOwnPostCount}</h4>
                                            </div>
                                        </div>
                                       
                                        <div className="post-info-button" style={{ marginTop: '10px' }}>
                                            {!userInfor.followed ?
                                                <button className="bookmark-btn"
                                                    style={{ backgroundColor: '#5869DA', color: 'white' }}
                                                    onClick={handleClickFollow}>Theo dõi</button>
                                                :
                                                <button className="bookmark-btn"
                                                    onClick={handleClickFollow}
                                                >
                                                    <i className="fal fa-user-check" style={{ marginRight: '5px' }}></i>
                                                    Đã theo dõi</button>
                                            }

                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* TODO: TAB POSTS */}
                            <div className="mt-30 col-lg-8" >
                                {posts.length === 0 ? <Empty /> :
                                    posts.map((post, index) => {
                                        return (
                                            <CurrentPost post={post} key={index} />
                                        )
                                    })
                                }

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
