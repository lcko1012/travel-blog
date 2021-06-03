import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import CurrentPost from '../home/components/CurrentPost'
import Empty from '../../utils/Empty/Empty'
import ReactHtmlParser from 'react-html-parser'
import Cookies from 'js-cookie'


const MyProfile = () => {
  const auth = useSelector(state => state.auth)
  const userInfor = auth.user
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [drafts, setDrafts] = useState([])
  //false load bai viet, true load ban nhap
  const [isLoadPost, setIsLoadPost] = useState(false)
  const [callback, setCallback] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)



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

  useEffect(() => {
    
    getDrafts()
  }, [userInfor.accountId, callback, currentPage])

  const getDrafts = async () => {
    console.log("load")
    try {
      const token = Cookies.get("token")
      const res = await axios.get('/user/drafts', {
        params: {
          page: currentPage
        },
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res) {
        console.log(res)
        setDrafts([...drafts, ...res.data])
        if (res.data.length === 0) {
          setIsEmpty(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickLoad = (value) => {
    setIsLoadPost(value)
  }

  const handleDelDraft = async (postId) => {
    const token = Cookies.get("token")
    try {
      const res = await axios.delete(`draft/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res) {
        console.log(res)
        setDrafts([])
        setCallback(!callback)
        setCurrentPage()
        
      }

    } catch (error) {
      console.log(error)
    }
  }

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

                <div>
                  <button onClick={() => handleClickLoad(false)}>Xem các bài viết</button>
                  <button onClick={() => handleClickLoad(true)} >Xem các bài nháp</button>
                </div>
                {/* <div className="post-info-button" style={{ marginTop: '10px' }}>
                                    <button className="bookmark-btn">Chỉnh sửa trang cá nhân</button>
                                </div> */}

              </div>
            </div>
          </div>
          {/* TODO: TAB POSTS */}
          <div className="mt-30 col-lg-8" >
            {!isLoadPost ?
              posts.length === 0 ? <Empty /> :
                posts.map((post, index) => {
                  return (
                    <CurrentPost post={post} key={index} />
                  )
                })
              :
              drafts.length === 0 ? <Empty /> :
              <>
              {
                drafts.map((draft, index) => {
                  console.log(drafts.length)
                  return (

                    <div key={index} className="myprofile__draft ">
                      <h5>{ReactHtmlParser(draft.title)}</h5>
                      <div>
                        {/* <Link to={`/posts/${draft.slug}/edit`}> */}
                        <button>Tiếp tục viết</button>
                        {/* </Link> */}
                        <button onClick={() => handleDelDraft(draft.postId)}>Xóa</button>
                      </div>
                      
                    </div>
                  )
                })
              }
              <div className="pagination-area mb-30">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-start">
                        <li className={`page-item" ${isEmpty ? 'disabled' : null}`}
                          onClick={() => setCurrentPage(currentPage + 1)}>
                          <a className="page-link">
                            <i className="fal fa-long-arrow-right"></i>
                          </a>
                        </li>
                      </ul>
                    </nav>
              </div>
              </>
            }


          </div>
        </div>
      </div>
    </main>
  )
}

export default MyProfile
