import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Comment from './components/Comment'
import axios from 'axios'
import Cookies from 'js-cookie'
import ReactHtmlParser from 'react-html-parser'



const Comments = ({ id, setPost, post }) => {
  const auth = useSelector(state => state.auth)
  const userInfor = auth.user
  const [commentsArr, setCommentsArr] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const handleChangeInput = (e) => {
    const { value } = e.target
    setCommentInput(value)
  }

  const handleSubmitCmt = (e) => {
    e.preventDefault()
    var commentForm = new FormData()
    commentForm.append('content', commentInput)
    const token = Cookies.get("token")
    const postCmt = async () => {
      const res = await axios.post(`/comment/post/${id}`, commentForm, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res) {
        
        setCommentsArr([res.data, ...commentsArr])
        setCommentInput('')
      }
      // then(res => {
      //   const getComments = async () => {
      //     const res = await axios.get(`/comment/post/${id}`)
      //     setPost({ ...post, comments: res.data })
      //     console.log(post)
      //     console.log("get roi")
      //   }
      //   getComments()
      // }
      // ).catch(err => console.log(err))

    }
    postCmt()
    // setLoadCmt(!loadCmt)
    // setComment('')
  }
  // TODO: get comments
  useEffect(() => {
    const getComments = async () => {
      const token = Cookies.get("token")
      var res = ''
      try {
        if (token) {
          res = await axios.get(`/comment/post/${id}`, {
            params : {
              page: currentPage
            },
            headers: { Authorization: `Bearer ${token}` }
          })
        }
        else {
          res = await axios.get(`/comment/post/${id}`)
        }

        if (res) {
          if(res.data.length === 0 || res.data.length < 10) {
            setIsEmpty(true)
          }
          setCommentsArr([...commentsArr, ...res.data])
        }
      } catch (err) {
        console.log(err)
      }
    }
    getComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentPage])


  return (
    <div className="comment-area">
      <div>
        <h5>Comment</h5>
      </div>
      <hr className="comment-hr" />
      <form className="d-flex" onSubmit={handleSubmitCmt}>
        <div className="avatar-comment"
          style={{ backgroundImage: `url(${ReactHtmlParser(userInfor.avatarLink)})` }}>
        </div>
        <input className="comment-input" type="text" placeholder="Write comment"
          name="commentInput"
          value={commentInput}
          onChange={handleChangeInput}
        />
      </form>
      {commentsArr.map((comment, index) => {
        return (
          <Comment key={index} comment={comment} commentsArr={commentsArr} setCommentsArr={setCommentsArr} />
        )
      })}

      <div className="post__cmt--morecmt" style={isEmpty ? {display: 'none'} : null} onClick={() => setCurrentPage(currentPage + 1)}>
        Xem thêm
        <i className="fal fa-chevron-down" />
      </div>
      
    </div>
  )
}

export default Comments
