import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import Comment from './components/Comment'
import axios from 'axios'
import Cookies from 'js-cookie'


const Comments = ({id, setPost, post}) => {
    const auth = useSelector(state => state.auth)
    const userInfor = auth.user
    const [commentsArr, setCommentsArr] = useState([])
    const [commentInput, setCommentInput] = useState('')

    const handleChangeInput = (e) => {
        const { value } = e.target
        setCommentsArr(value)
      }
    
      const handleSubmitCmt = (e) => {
        e.preventDefault()
        var commentForm = new FormData()
        commentForm.append('content', commentInput)
        const token = Cookies.get("token")
        const postCmt = async () => {
          const res = await axios.post(`/comment/post/${id}`, commentForm, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => {
            const getComments = async () => {
              const res = await axios.get(`/comment/post/${id}`)
              setPost({ ...post, comments: res.data })
              console.log(post)
              console.log("get roi")
            }
            getComments()
          }
          ).catch(err => console.log(err))
    
        }
        // postCmt()
        // setLoadCmt(!loadCmt)
        // setComment('')
      }

    useEffect(() => {
        const getComments = async () => {
          try {
            const res = await axios.get(`/comment/post/${id}`)
            if (res) {
              console.log(res)
              setCommentsArr(res.data)
            }
          } catch (err) {
            console.log(err)
          }
        }
    
        getComments()
      }, [id])
    return (
        <div class="comment-area">
            <div>
                <h5>Comment</h5>
            </div>
            <hr class="comment-hr" />
            {commentsArr.map((comment) => {
                return (
                    <Comment key={comment.commentId} comment={comment} />
                )
            })}

            <form className="d-flex" onSubmit={handleSubmitCmt}>
                <div className="avatar-comment"
                    style={{ backgroundImage: `url(${userInfor.avatarLink})` }}>
                </div>
                <input className="comment-input" type="text" placeholder="Write comment"
                    name="commentInput"
                    value={commentInput}
                    onChange={handleChangeInput}
                />
            </form>
        </div>
    )
}

export default Comments
