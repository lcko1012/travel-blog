import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation, useHistory } from 'react-router-dom'
import "./Post.css"
import axios from 'axios'

import ReactHtmlParser from 'react-html-parser'
import Loading from '../../utils/Loading/Loading'
import Cookies from 'js-cookie'
import Comments from './comments/Comments'
import CommentPost from '../home/components/CommentPost'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [post, setPost] = useState(initialState)
  const [author, setAuthor] = useState({})
  const [loading, setLoading] = useState(false)
  const [isDel, setIsDel] = useState(false)
  const [isReport, setIsReport] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  const [reportTxt, setReportTxt] = useState('')

  //Cu moi lan render lai
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`/post`, {
          params: {
            slug: params.slug
          }
        })

        var resContent = res.data
        setPost({
          ...post,
          postId: resContent.postId,
          title: resContent.title,
          publishedDate: resContent.publishedDate,
          postThumbnail: resContent.postThumbnail,
          slug: resContent.slug,
          content: resContent.content,
          bookmarked: resContent.bookmarked,
          bookmarkedCount: resContent.bookmarkedCount,
          commentCount: resContent.commentCount,
          categories: resContent.categories,
          owner: resContent.owner
        })
        setAuthor(resContent.author)
        setLoading(true)
      } catch (err) {
        console.log(err)
      }
    }


    if (params.slug) {
      getPost()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug])


  useEffect(() => {
    const getAuthPosts = async () => {
      try {
        const res = await axios.get(`/user/posts/${author.accountId}`, {
          params: {
            size: 5
          }
        })
        setUserPosts(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    if (author.accountId) {
      getAuthPosts()
    }
  }, [author])



  const handleBookmark = () => {
    //Muon bookmark
    const token = Cookies.get("token")
    if (!token) return history.push('/login')
    var bookmarkForm = new FormData()
    bookmarkForm.append("postId", post.postId)
    const postBookmark = async () => {
      try {
        const res = await axios.post('/bookmark', bookmarkForm)
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
    var bookmarkForm = new FormData()
    bookmarkForm.append("postId", post.postId)

    const deleteBookmark = async () => {
      try {
        const res = await axios.delete(`/bookmark/${post.postId}`)
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


  const handleDelPost = async () => {
    try {
      const res = await axios.delete(`/post/${post.postId}`)
      if (res) {
        history.push("/")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowReport = () => {
    const token = Cookies.get("token")
    if (!token) return history.push('/login')
    setIsReport(true)
  }

  const handleReportPost = async () => {
    try {
      const res = await axios.post('/report', null, {
        params: {
          postId: post.postId,
          content: reportTxt
        }
      })
      if (res) {
        setIsReport(false)
        toast.success('Báo cáo thành công', {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      }
    } catch (error) {
      toast.error('Không thể báo cáo', {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error)
    }
  }
  const handleChangeInput = (e) => {
    const { value } = e.target
    setReportTxt(value)

  }

  const showDelAlert = () => {
    return (
      <div className="post__alert post__alert--delete ">
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

  const showReportForm = () => {
    return (
      <div className="post__alert post__alert--report">
        <h5>Báo cáo bài viết</h5>

        <textarea
          onChange={handleChangeInput}
          name="reportTxt" className="post__reportContent" placeholder="Nội dung báo cáo" />
        <div>
          <button className="post__delAlert--button post__delAlert--cancel"
            onClick={() => setIsReport(false)}
          >
            Hủy
          </button>
          <button className="post__delAlert--button post__reportForm--report"
            onClick={handleReportPost}
          >
            Báo cáo
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
              {isReport ? showReportForm() : null}
              <div className="col-lg-8 mt-50">
                <div className="content-area">
                  <h1 className="post__title">{ReactHtmlParser(post.title)}</h1>
                  {/* Catalogy area */}
                  <div className="post__cataArea">
                    {post.categories.map((item) => {
                      return (
                        <Link to={{ pathname: `/category/${item.categoryId}` }} key={item.categoryId}>
                          <div className="post__cata"
                            key={item.categoryId}>{item.categoryName}</div>
                        </Link>
                      )

                    })}
                  </div>

                  {/* TODO:WRITE BY AREA */}
                  <div className="write-by mb-30">
                    <div className="d-flex">
                      <div className="avatar-write-by inline-item"
                        style={{ backgroundImage: `url(${ReactHtmlParser(author.avatarLink)})` }}
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
                            <i className="fal fa-pen" style={{ marginRight: '5px' }}></i>
                            Sửa bài viết</button>
                        </Link>

                        <button className="post__delBtn" onClick={() => handleClickDel(true)}>
                          <i className="fal fa-trash-alt" style={{ color: '#A95252' }}></i>
                        </button>
                      </div> :
                      <button className="post__delBtn post__reportBtn" style={{ color: 'red' }} onClick={handleShowReport}>
                        <i className="fal fa-exclamation-triangle"></i>
                      </button>
                    }

                  </div>


                  <div className="post-content" >
                    {ReactHtmlParser(ReactHtmlParser(post.content))}
                  </div>
                </div>

                {/* TODO: COMMENT AREA */}
                {/* ========================COMMENT================ */}
                <Comments setPost={setPost} id={post.postId} post={post} />

              </div>
              {/* ===============================END COMMENT=========================== */}

              {/* TODO: POST's INFORMATION */}
              <div className="col-lg-4 mt-50" style={{ paddingLeft: '30px' }}>
                <div className="post-info">
                  <div className="post-info-count">
                    <div className="bookmark-count child-1">
                      <h5>{post.bookmarkedCount}</h5>
                      <p>Bookmark</p>
                    </div>

                    <div className="bookmark-count">
                      <h5>{post.commentCount}</h5>
                      <p>Bình Luận</p>
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


                {/* TODO: Same author */}

                {userPosts.length > 0 ?
                  <div>
                    <h5 className="mb-20">Các bài viết cùng tác giả</h5>
                    {userPosts.map(item => {
                      return item.postId !== post.postId ? <CommentPost item={item} key={item.postId} /> : null
                    })}
                  </div>
                  : null
                }

              </div>
            </div>
            : <Loading />}

        </div>
      </main>
    </>
  )





}

export default Post
