import axios from 'axios'
import React, { forwardRef, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Empty from '../../utils/Empty/Empty'
import Loading from '../../utils/Loading/Loading'
import CurrentPost from '../home/components/CurrentPost'
import ReactHtmlParser from 'react-html-parser'
import "./Profile.css"
import profileApis from './enum/profile-apis'
import Cookies from 'js-cookie'
import withClickOutsideFollowerDialog from './withClickOutsideFollower'
import { useSelector } from 'react-redux'

const Profile = forwardRef(({ openFollowerDialog, setOpenFollowerDialog }, ref) => {
    const auth = useSelector(state => state.auth)
    const history = useHistory()
    const id = useParams().id
    const [userInfor, setUserInfor] = useState({})
    const [posts, setPosts] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [followerList, setFollowerList] = useState([])

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
    
    useEffect(() => {
        if (openFollowerDialog) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
      }, [openFollowerDialog]);

    const redirectToAnotherProfile = (id) => {
        setOpenFollowerDialog(false)
        if(id === auth.user.accountId){
            history.push('/myprofile')
        }
        else history.push(`/profile/${id}`)
    }

    const followerDialog = () => {
        return (
          <div className="dialog-container">
            <div className="profile__follower-dialog--header">
              <span>Người theo dõi</span>
              <i 
              className="fal fa-times"
              onClick={() => setOpenFollowerDialog(false)}
              ></i>
            </div>
            <div className="profile__follower-dialog--list">
              {
                followerList.map((follower) => 
                  <div key={follower.accountId}
                  className="profile__follower-dialog--list-item"
                  >
                      <div 
                      className="profile__follower-dialog--avatar"
                      style={{backgroundImage: `url(${ReactHtmlParser(follower.avatarLink)})`}}
                      ></div>
                      <span onClick={() => redirectToAnotherProfile(follower.accountId)}>
                          {follower.name}
                      </span>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
      const getFollower = async () => {
        const response = await axios.get(profileApis.loadFollowerList(id))
        setFollowerList(response.data)
    }

      const showFollower = () => {
        getFollower()
        setOpenFollowerDialog(!openFollowerDialog)
      }

    return (
        <>
            {isLoading ?
                <main className="main__home">
                    <div className="container">
                        <div className="row">
                            {/* TODO: TAB INFOR */}
                            <div ref={ref}>
                                {openFollowerDialog && followerDialog()}
                            </div>

                            <div className="mt-30 col-lg-4" >
                                <div className="information mb-30">
                                    <div className="author-info">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="avatar" style={{ backgroundImage: `url(${ReactHtmlParser(userInfor.avatarLink)})` }} ></div>
                                            
                                            <div className="post-count">
                                                <h4>{userInfor.postCount}</h4>
                                                <p>Bài viết</p>
                                            </div>

                                            <div className="follower-count inline-item">
                                                <h4 onClick={showFollower}>{userInfor.followCount}</h4>
                                                <p>Người theo dõi</p>
                                            </div>
                                        </div>
                                        <h5 className="author-name mt-10">{userInfor.name}</h5>
                                        
                                        <div className="author__social">
                                            <i className="fab fa-instagram" onClick={() => window.open(ReactHtmlParser(userInfor.instagramLink), '_blank')} ></i>
                                            <i className="fab fa-facebook-square" onClick={() => window.open(ReactHtmlParser(userInfor.fbLink), '_blank')}></i>
                                        </div>
                                        
                                        <p className="mt-10" style={{ fontSize: "14px" }}>
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
                                                <button className="button button-primary bookmark-btn"
                                                    style={{ backgroundColor: '#5869DA', color: 'white' }}
                                                    onClick={handleClickFollow}>Theo dõi</button>
                                                :
                                                <button className="button button-light bookmark-btn"
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
})

export default withClickOutsideFollowerDialog(Profile)
