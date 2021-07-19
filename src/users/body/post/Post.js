import React, { useEffect, useState } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import "./Post.css"
import axios from 'axios'
import ReactHtmlParser from 'react-html-parser'
import Loading from '../../utils/Loading/Loading'
import Cookies from 'js-cookie'
import Comments from './comments/Comments'
import CommentPost from '../home/components/CommentPost'
import { useSelector } from 'react-redux'
import postApi from './enum/post-api'
import { errorNotification, successNotification } from '../../utils/notification/ToastNotification'

function Post() {
  const params = useParams()
  const history = useHistory()
  const auth = useSelector(state => state.auth)
  const { user } = auth
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
  const [showBtnUp, setShowBtnUp] = useState(false)

  //Cu moi lan render lai
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(postApi.getPost, {
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
        const res = await axios.get(postApi.getPostsOfAuthor(author.accountId), {
          params: {
            size: 5
          }
        })
        if(res){
          setUserPosts(res.data)
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
        const res = await axios.post(postApi.bookmarkPost, bookmarkForm)
        if (res) {
          console.log(res)
          setPost({ ...post, bookmarked: true, bookmarkedCount: res.data })
        }
      } catch (err) {
        errorNotification("Đã có lỗi xảy ra 🙁")
      }
    }
    postBookmark()
  }

  const handleUnBookmark = () => {
    var bookmarkForm = new FormData()
    bookmarkForm.append("postId", post.postId)

    const deleteBookmark = async () => {
      try {
        const res = await axios.delete(postApi.unBookmarkPost(post.postId))
        if (res) {
          setPost({ ...post, bookmarked: false, bookmarkedCount: res.data })
        }
      } catch (err) {
        errorNotification("Đã có lỗi xảy ra 🙁")
      }
    }
    deleteBookmark()
  }

  const handleClickDel = (value) => {
    setIsDel(value)
  }


  const handleDelPost = async () => {
    try {
      const res = await axios.delete(postApi.deletePost(post.postId))
      if (res) {
        successNotification('Đã xóa bài viết thành công ✔')
        history.push("/")
      }
    } catch (error) {
      errorNotification('Đã có lỗi xảy ra khi xóa bài 😢')
    }
  }

  const handleShowReport = () => {
    const token = Cookies.get("token")
    if (!token) return history.push('/login')
    setIsReport(true)
  }

  const handleReportPost = async () => {
    try {
      const res = await axios.post(postApi.reportPost, null, {
        params: {
          postId: post.postId,
          content: reportTxt
        }
      })
      if (res) {
        setIsReport(false)
        successNotification('Báo cáo thành công ✔')
      }
    } catch (error) {
      errorNotification('Không thể báo cáo 🙁')
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
        <p>Thao tác này sẽ xóa hết dữ liệu bài viết</p>
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

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300){
      setShowBtnUp(true)
    } 
    else if (scrolled <= 300){
      setShowBtnUp(false)
    }
  };
  
  window.addEventListener('scroll', toggleVisible);


  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
    });
  };

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
                          {author.accountId === user.accountId ?
                            <Link to="/myprofile">{author.name}</Link>
                            :
                            <Link to={`/profile/${author.accountId}`}>{author.name}</Link>
                          }
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
                      //neu khong chủ bài viết thì ktra admin hay user thường: admin xóa bài được, user là báo cáo
                      auth.isAdmin ? null :
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
                <Comments setPost={setPost} id={post.postId} post={post} />
              </div>

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
                {userPosts.length - 1 > 0 ?
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

            <button className="post__button-up" 
              style={{display: showBtnUp ? 'block' : 'none'}} 
              onClick={scrollToTop}
            >
              <i className="fal fa-arrow-up"></i>
            </button>
        </div>
      </main>
    </>
  )





}

export default Post
