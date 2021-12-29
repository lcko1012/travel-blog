import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchDeleteCmt, dispatchLikeCmt, dispatchEditCmt } from '../../../../../redux/actions/commentAction'
import TextareaAutosize from 'react-textarea-autosize';
import {
  dispatchGetComments, dispatchNextCommentsPage,
  dispatchSubmitComments, dispatchClearCmts
} from '../../../../../redux/actions/commentAction'


const Comment = ({ comment, postId }) => {
  const location = useLocation()
  const auth = useSelector(state => state.auth)
  const userInfor = auth.user
  const history = useHistory()
  const [showChoose, setShowChoose] = useState(false)
  const [showEditCmt, setShowEditCmt] = useState(false)
  const [showRepCmt, setShowRepCmt] = useState(false)
  const [commentInputChange, setCommentInputChange] = useState('')
  const [commentInput, setCommentInput] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    setCommentInputChange(comment.content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment.content])

  const handleChangeComment = (e) => {
    const { value } = e.target
    setCommentInputChange(value)
  }

  const handleLikeCmt = () => {
    if (!Cookies.get("token")) return history.push(`/login?redirectTo=${location.pathname}`)
    dispatch(dispatchLikeCmt(comment))
  }

  const handleSubmitChangeCmt = async () => {
    if (!Cookies.get("token")) return history.push(`/login?redirectTo=${location.pathname}`)

    if (!commentInputChange.trim()) return
    const formData = new FormData()
    formData.append("content", commentInputChange)
    dispatch(dispatchEditCmt(comment, formData))
    setShowEditCmt(false)
    setCommentInputChange(commentInputChange)
  }

  const handleDeleteCmt = async () => {
    dispatch(dispatchDeleteCmt(comment))
  }

  //Bấm hủy sửa xóa đi ô sửa và sửa lại input change
  const handleClickCancelEdit = () => {
    setShowEditCmt(false)
    setCommentInputChange(comment.content)
  }

  const handleChangeInput = (e) => {
    const { value } = e.target
    setCommentInput(value)
  }

  const handleSubmitComment = (e) => {
    // e.preventDefault()
    if (!Cookies.get("token")) return history.push(`/login?redirectTo=${location.pathname}`)

    if (commentInput.trim()) {
      var commentForm = new FormData()
      commentForm.append('content', commentInput)
      if (comment.parentId) {
        //if the comment is reply to child comment
        commentForm.append('parentId', comment.parentId)
      }
      else {
        //if the comment is reply to parent comment
        commentForm.append('parentId', comment.commentId)
      }
      dispatch(dispatchSubmitComments(postId, commentForm))
      setCommentInput("")
      setShowRepCmt(false)
    }

  }

  const handleShowRepCmt = () => {
    setCommentInput(`Trả lời ${comment.commenter.name}: `)
    setShowRepCmt(true)
  }

  return (
    <div className="mb-10 d-flex" key={comment.commentId}>
      <div className="avatar-comment" style={{ backgroundImage: `url(${ReactHtmlParser(comment.commenter.avatarLink)})` }}>
        <Link to={`/profile/${comment.commenter.accountId}`}></Link>
      </div>

      <div className='flex-grow-1'>
        <div className={!showEditCmt ? 'comment__content--container' : null}>
          <div className="comment__title">
            {!showEditCmt ?
              <div className='d-flex justify-content-between'>
                <div className='d-flex'>
                  <span className="comment__title--name ">
                    <Link to={`/profile/${comment.commenter.accountId}`}>
                      {ReactHtmlParser(comment.commenter.name)}
                    </Link>
                  </span>
                  <p className="text-12-px ">{comment.commentDate}</p>
                </div>

                {comment.commenter.email === userInfor.email ?
                  <i className="far fa-ellipsis-h cursor-pointer comment__choose-icon" onClick={() => setShowChoose(!showChoose)}>
                    <div className="comment__choose" style={showChoose ? { display: 'block' } : { display: 'none' }}>
                      <div className="d-flex comment__choose-option" onClick={handleDeleteCmt}>
                        <i className="fal fa-eraser mr-10 "></i>
                        <p>Xóa</p>
                      </div>

                      <div className="d-flex comment__choose-option" onClick={() => setShowEditCmt(true)}>
                        <i className="fal fa-pen mr-10 "></i>
                        <p>Chỉnh sửa</p>
                      </div>
                    </div>
                  </i> : null
                }
              </div>
              : null
            }
          </div>

          {showEditCmt ?
            <form className="d-flex comment-form--edit">
              <TextareaAutosize
                className="comment__input-submit"
                value={commentInputChange}
                onChange={handleChangeComment}
              />
            </form>
            :
            <div className="comment__content">
              {ReactHtmlParser(ReactHtmlParser(comment.content))}
            </div>
          }
        </div>

        <div className="comment__like-container">
          {showEditCmt ?
            <div>
              <button
                className="btn btn-primary comment__like--btn mr-2" 
                disabled={!commentInputChange.trim()}
                onClick={handleSubmitChangeCmt}
              >
                Gửi
              </button>

              <button className="btn btn-light comment__like--btn"
                onClick={handleClickCancelEdit}>
                Hủy
              </button>
            </div>
            :
            showRepCmt ?
              <>
                <form className="d-flex">
                  <TextareaAutosize
                    className="comment__input-submit"
                    placeholder="Viết bình luận..."
                    name="commentInput"
                    value={commentInput}
                    onChange={handleChangeInput}
                  />
                </form>
                <div>
                  <button
                    className="btn btn-primary comment__like--btn mr-2" 
                    disabled={!commentInput.trim()}
                    onClick={handleSubmitComment}
                  >
                    Gửi
                  </button>
                  <button className="btn btn-light comment__like--btn"
                    onClick={() => setShowRepCmt(false)}>
                    Hủy
                  </button>
                </div>

              </> :

              <div className='comment__like d-flex'>
                <div className={`comment__like-btn  ${comment.liked ? 'comment__like-btn-liked' : 'comment__like-btn-no-liked'}`}
                  onClick={handleLikeCmt}>
                  <i className="fal fa-thumbs-up ml-5 mr-5"></i>
                  <span>{comment.likeCount} Thích</span>
                </div>

                <div
                  className='comment__like-btn comment__like-btn-no-liked ml-2'
                  onClick={handleShowRepCmt}
                >
                  <i className="fal fa-comment mr-5"></i>
                  <span>Trả lời</span>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Comment
