import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Link, useHistory } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {dispatchDeleteCmt, dispatchLikeCmt, dispatchEditCmt} from '../../../../../redux/actions/commentAction'

const Comment = ({ comment, color }) => {
    const auth = useSelector(state => state.auth)
    const userInfor = auth.user
    const history = useHistory()
    const [showChoose, setShowChoose] = useState(false)
    const [showEditCmt, setShowEditCmt] = useState(false)
    const [commentInputChange, setCommentInputChange] = useState('')
    const dispatch = useDispatch()

    useEffect(() =>{
        setCommentInputChange(comment.content)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.content])

    const handleChangeComment = (e) => {
        const {value} = e.target
        setCommentInputChange(value)
    }

    const handleLikeCmt = (commentId) => {
        if(!Cookies.get("token")) return history.push('/login')
        dispatch(dispatchLikeCmt(commentId))
    }


    const handleSubmitChangeCmt = async (e) => {
        e.preventDefault()
        if(!Cookies.get("token")) return history.push('/login')
        const formData = new FormData()
        formData.append("content", commentInputChange)
        dispatch(dispatchEditCmt(comment.commentId, formData))
        setShowEditCmt(false)
        setCommentInputChange(commentInputChange)
    }

    const handleDeleteCmt = async () => {
        dispatch(dispatchDeleteCmt(comment.commentId))
    }
    
    //Bấm hủy sửa xóa đi ô sửa và sửa lại input change
    const handleClickCancelEdit = () => {
        setShowEditCmt(false)
        setCommentInputChange(comment.content)
    }

    return (
        <div className="comment-item" 
        
        
        key={comment.commentId}>
            <div className="avatar-comment inline-item"
                style={{ backgroundImage: `url(${ReactHtmlParser(comment.commenter.avatarLink)})` }}></div>
            <div className="inline-item" style={{ width: "90%" }}
             style={color ? {color: '#f1efef', transition: '0.4s'} : null}>
                <div className='d-flex' style={{ alignItems: 'center' }}>
                    <Link to={userInfor.accountId === comment.commenter.accountId ? `/myprofile` : `/profile/${comment.commenter.accountId}`}>
                        <h5 className="comment-name">{comment.commenter.name}</h5>
                    </Link>

                    {comment.commenter.email === userInfor.email ?
                        <i className="fal fa-chevron-down  ml-10" style={{ fontSize: '12px' , cursor: 'pointer'}} onClick={()=>setShowChoose(!showChoose)}>
                            <div className="comment-choose" style={showChoose ? {display: 'block'} : {display: 'none'}}>
                                <div className="d-flex comment-choose--option" onClick={handleDeleteCmt}>
                                    <i className="fal fa-eraser mr-10 "></i>
                                    <p>Xóa bình luận</p>
                                </div>
                                <div className="d-flex comment-choose--option" onClick={() => setShowEditCmt(true)}>
                                    <i className="fal fa-pen mr-10 "></i>
                                    <p>Sửa bình luận</p>
                                </div>
                            </div>
                        </i> : null
                    }

                </div>
                
                <p style={{ fontSize: "12px" }}>{comment.commentDate}</p> 
                
                
                {showEditCmt ? 
                <form  className="d-flex comment-form--edit" onSubmit={handleSubmitChangeCmt}>
                    {/* defaultValue={ReactHtmlParser(comment.content)} */}
                    <input value={commentInputChange} onChange={handleChangeComment}/>
                    <p  onClick={handleClickCancelEdit}>Hủy</p>

                </form> 
                : 
                <div className="comment-content">
                    {ReactHtmlParser(ReactHtmlParser(comment.content))}
                </div> }


                <div className="comment-like"
               >
                    <p className="mr-10 comment-likebtn" onClick={() => handleLikeCmt(comment.commentId)}>
                        {comment.liked ? 'Bỏ thích' : 'Thích'}
                    </p>
                    {comment.likeCount}
                    <i className="fal fa-thumbs-up ml-10"></i>
                </div>
            </div>
        </div>
    )
}

export default Comment
