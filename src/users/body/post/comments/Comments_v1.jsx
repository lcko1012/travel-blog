import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './components/Comment'
import Cookies from 'js-cookie'
import ReactHtmlParser from 'react-html-parser'
import { useHistory } from 'react-router'
import {
  dispatchGetComments, dispatchNextCommentsPage,
  dispatchSubmitComments, dispatchClearCmts
} from '../../../../redux/actions/commentAction'
import useSocketDataObject from '../../../../real-time/useSocketDataObject'
import { showErrMsg } from '../../../utils/notification/Notification'
import TextareaAutosize from 'react-textarea-autosize';
import { useLocation } from 'react-router-dom'


const Comments_v1 = ({ postId }) => {
  const history = useHistory()
  const location = useLocation()
  const auth = useSelector(state => state.auth)
  const userInfor = auth.user
  const [commentInput, setCommentInput] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const { Subscribe_post, Unsubscribe_post } = useSocketDataObject()
  const dispatch = useDispatch()
  const commentsReducer = useSelector(state => state.commentsReducer)
  const realtime = useSelector(state => state.realtime)
  const ref = useRef(realtime.postSubcription)


  useEffect(() => {
    Subscribe_post(postId)
  }, [realtime.isSuccess])

  useEffect(() => {
    ref.current = realtime.postSubcription
  }, [realtime.postSubcription])

  useEffect(() => {
    dispatch(dispatchGetComments(postId))
  }, [postId])

  useEffect(() => {
    return () => {
      Unsubscribe_post(ref.current)
      dispatch(dispatchClearCmts())
    }
  }, [])

  const handleChangeInput = (e) => {
    const { value } = e.target
    setCommentInput(value)
  }

  const handleSubmitComment = () => {
    if (!Cookies.get("token")) return history.push(`/login?redirectTo=${location.pathname}`)

    if (commentInput.trim()) {
      var commentForm = new FormData()
      commentForm.append('content', commentInput)
      dispatch(dispatchSubmitComments(postId, commentForm))
      setCommentInput("")
    }
  }

  const handleNextPageCmt = () => {
    setCurrentPage(currentPage + 1)
    dispatch(dispatchNextCommentsPage(postId, currentPage + 1))
  }


  return (
    <div className="mt-50">
      <div className="comment-area-title" >
        <h5>Bình luận:</h5>
      </div>

      <div className="d-flex mb-4">
        <div className="avatar-comment"
          style={{ backgroundImage: `url(${ReactHtmlParser(userInfor.avatarLink)})` }}>
        </div>
        <div className='flex-grow-1'>
          <form className='d-flex'>
            <TextareaAutosize
              className="comment__input-submit"
              placeholder="Viết bình luận..."
              name="commentInput"
              value={commentInput}
              onChange={handleChangeInput}
            />
          </form>
          
          <div className='comment__like-container'>
            <button
              className="btn btn-primary comment__like--btn mr-2"
              disabled={!commentInput.trim()}
              onClick={handleSubmitComment}
            >
              Gửi
            </button>
          </div>
        </div>

      </div>

      {commentsReducer.errData && showErrMsg(commentsReducer.errData)}

      {commentsReducer.commentsArr ?
        commentsReducer.commentsArr.map((comment, index) => {
          return (
            <div key={comment.commentId}>
              {comment.parentId === null ? <Comment key={index} comment={comment} postId={postId} /> : null}
              {comment.childComments &&
                <div className='comment__child'>
                  {comment.childComments.map((childComment, index) => {
                    return <Comment key={index} comment={childComment} postId={postId} />
                  })}
                </div>
              }
            </div>

          )
        })
        : null
      }

      <div className="post__cmt--morecmt" style={commentsReducer.isEmpty ? { display: 'none' } : null}
        onClick={handleNextPageCmt}>
          Xem thêm
        <i className="fal fa-chevron-down" />
      </div>
    </div>
  )
}

export default Comments_v1
