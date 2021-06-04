import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation, useHistory } from 'react-router-dom'
import "./Post.css"
import axios from 'axios'

import ReactHtmlParser from 'react-html-parser'
import Loading from '../../utils/Loading/Loading'
import Cookies from 'js-cookie'
import Comments from './comments/Comments'

function Post() {
  const params = useParams()
  const history = useHistory()
  const initialState = {
    postId: 0,
    title: '',
    publishedDate: '',
    postThumbnail: '',
    slug: params.slug,
    content: '',
    bookmarked: false,
    bookmarkedCount: 0,
    commentCount: 0,
    categories: [],
    owner: false
  }
  //lay bai bang slug
  const location = useLocation()
  // const [id, setId] = useState(null)
  const [post, setPost] = useState(initialState)
  const [author, setAuthor] = useState({})
  const [loading, setLoading] = useState(false)
  // const [callback, setCallback] = useState(false)
  // const [loadCmt, setLoadCmt] = useState(false)
  const [isDel, setIsDel] = useState(false)


  //Cu moi lan render lai
  useEffect(() => {
    const getPost = async () => {
      try {
        console.log(post.slug)
        const token = Cookies.get('token')
        var res = null
        if (token) {
          console.log(token)
          res = await axios.get(`/post`, {
            params: {
              slug: post.slug
            },
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log(res)
        } else {
          res = await axios.get(`/post`, {
            params: {
              slug: post.slug
            },
          })
        }
        var responseContent = res.data
        console.log(responseContent)
        setPost({
          ...post,
          postId: responseContent.postId,
          title: responseContent.title,
          publishedDate: responseContent.publishedDate,
          postThumbnail: responseContent.postThumbnail,
          slug: responseContent.slug,
          content: responseContent.content,
          bookmarked: responseContent.bookmarked,
          bookmarkedCount: responseContent.bookmarkedCount,
          commentCount: responseContent.commentCount,
          categories: responseContent.categories,
          owner: responseContent.owner
        })
        setAuthor(responseContent.author)
        setLoading(true)
      } catch (err) {
        console.log(err)
      }
    }
    if (post.slug) {
      getPost()
      console.log("getpost")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.slug])

  useEffect(() => {
    return () => {
      console.log("cleaned up")
    }
  }, [])



  const handleBookmark = () => {
    //Muon bookmark
    console.log("Bookmark")
    const token = Cookies.get("token")
    if(!token) return history.push('/login')
    var bookmarkForm = new FormData()
    bookmarkForm.append("postId", post.postId)
    const postBookmark = async () => {
      try {
        const res = await axios.post('/bookmark', bookmarkForm, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res) {
          console.log(res)
          setPost({ ...post, bookmarked: true, bookmarkedCount: res.data })
        }
      } catch (err) {
        console.log(err)
      }
    }
    postBookmark()
  }

  const handleUnBookmark = () => {
    console.log("bo book mark")
    const token = Cookies.get("token")
    console.log(token)
    var bookmarkForm = new FormData()
    bookmarkForm.append("postId", post.postId)

    const deleteBookmark = async () => {
      try {
        const res = await axios.delete(`/bookmark/${post.postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res) {
          console.log(res)
          setPost({ ...post, bookmarked: false, bookmarkedCount: res.data })
        }
      } catch (err) {
        console.log(err)
      }
    }
    deleteBookmark()
  }

  const handleClickDel = (value) => {
    setIsDel(value)
  }

  const handleDelPost = () => {
    const delPost = async () => {
      try {
        const token = Cookies.get("token")
        const res = await axios.delete(`/post/${post.postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        if(res){
          history.push("/")
        }
      } catch (error) {
        console.log(error)
      }
    }
    delPost()
  }

  const showDelAlert = () => {
    return(
      <div className="post__delAlert">
        <h5>Lưu ý</h5>
        <p>Thao tác này sẽ xóa hết dữ liệu bài viết của bạn</p>
        <div>
           <button className="post__delAlert--button post__delAlert--cancel"
           onClick={() => handleClickDel(false)}
           >
             Hủy
           </button>
           <button className="post__delAlert--button post__delAlert--delete"
           onClick={handleDelPost}
           >
             Xóa bài
           </button>
        </div>
      
      </div>
    )
  }

  return (
    <>
      <main className="main__home" >
        <div className="container">
         
          {loading ?
            <div className="row">
               {isDel ? showDelAlert() : null}
              <div className="col-lg-8 mt-50">
                <div className="content-area">
                  <h1 style={{ fontWeight: "700" }}>{ReactHtmlParser(post.title)}</h1>
                  {/* Catalogy area */}
                  <div className="post__cataArea">
                    {post.categories.map((item) => {
                      return(
                        <Link to={{ pathname: `/category/${item.categoryId}`}} key={item.categoryId}>
                        <div className="post__cata" 
                        key={item.categoryId}>{item.categoryName}</div>
                        </Link>
                      )
                     
                    })}
                  </div>

                  {/* TODO:WRITE BY AREA */}
                  <div className="write-by">
                    <div className="d-flex">
                      <div className="avatar-write-by inline-item"
                        style={{ backgroundImage: `url(${author.avatarLink})` }}
                      ></div>
                      <div style={{ margin: 'auto 0' }}>
                        <div className="name-write-by">
                          <Link to={`/profile/${author.accountId}`}>{author.name}</Link>
                        </div>
                        <p className="date-write-by">{post.publishedDate}</p>
                      </div>
                    </div>
                    {/* TODO: SUA BAI VIET */}
                    {post.owner ? 
                    <div >
                      <Link to={`/posts/${post.slug}/edit`}>
                      <button className="post__editBtn">
                        <i className="fal fa-pen" style={{marginRight: '5px'}}></i>
                      Sửa bài viết</button>
                      </Link>

                      <button  className="post__delBtn" onClick={() => handleClickDel(true)}>
                        <i className="fal fa-trash-alt" style={{color: '#A95252'}}></i>
                      </button>
                    </div> : null}
                    
                  </div>


                  <div className="post-content" >
                    {ReactHtmlParser(ReactHtmlParser(post.content))}
                  </div>
                </div>

                {/* TODO: COMMENT AREA */}
                {/* ========================COMMENT================ */}
                <Comments setPost={setPost} id={post.postId} post={post}  />

              </div>
              {/* ===============================END COMMENT=========================== */}

              {/* TODO: POST's INFORMATION */}
              <div className="col-lg-4 mt-50">
                <div className="post-info">
                  <div className="post-info-count">
                    <div className="bookmark-count">
                      <h5>{post.bookmarkedCount}</h5>
                      <h5>Bookmark</h5>
                    </div>

                    <div className="bookmark-count">
                      <h5>{post.commentCount}</h5>
                      <h5>Bình Luận</h5>
                    </div>
                  </div>
                  <div className="post-info-button">
                    {post.bookmarked ?
                      <button className="bookmark-btn"
                        onClick={handleUnBookmark}
                      >
                        <i className="fal fa-check" style={{ marginRight: '5px' }}></i>
                        Đã bookmark</button>
                      :
                      <button className="bookmark-btn" onClick={handleBookmark}
                        style={{ backgroundColor: '#5869DA', color: 'white' }}
                      >
                        <i className="fas fa-bookmark" style={{ marginRight: '5px' }}></i>
                        Bookmark</button>
                    }
                  </div>
                </div>

                {/* //TODO: AUTHOR's INFORMATION */}
                {/* <div class="author-info mt-30" >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div class="avatar inline-item" style={{ backgroundImage: `url(${avatar})` }} ></div>
                    <div class="post-count inline-item">
                      <h4>10</h4>
                      <p>Bài viết</p>
                    </div>
                    <div class="follower-count inline-item">
                      <h4>100</h4>
                      <p>Người theo dõi</p>
                    </div>
                  </div>
                  <h5 class="author-name">Steven</h5>
                  <p style={{ fontSize: "14px" }}>
                    Hi, I’m Stenven, a Florida native, who left my career in corporate
                    wealth management six years ago to embark on a summer of soul searching that would change
                    the course of my life forever.
                  </p>
                </div> */}
              </div>
            </div>
            : <Loading />}

        </div>
      </main>
    </>
  )





}

export default Post
