import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'

const Comment = ({ comment, commentsArr,setCommentsArr }) => {
    const auth = useSelector(state => state.auth)
    const userInfor = auth.user

    const [showChoose, setShowChoose] = useState(false)
    const [showEditCmt, setShowEditCmt] = useState(false)
    const [commentInputChange, setCommentInputChange] = useState('')

    useEffect(() =>{
        setCommentInputChange(comment.content)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChangeComment = (e) => {
        const {value} = e.target
        setCommentInputChange(value)
    }

    const handleLikeCmt = async (commentId) => {
        const token = Cookies.get("token")
        console.log(commentId)
        try {
            const res = await axios.put(`/comment/${commentId}/like`,null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(res){
                setCommentsArr(
                  commentsArr.map(item => 
                    item.commentId === commentId
                    ? {...item, likeCount : res.data, liked: !item.liked }
                    : item
                    )
                )
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleSubmitChangeCmt = async (e) => {
        e.preventDefault()
        try {
            const token = Cookies.get("token")
            const formData = new FormData()
            formData.append("content", commentInputChange)
            const res = await axios.put(`/comment/${comment.commentId}`, formData, {
                headers: {Authorization: `Bearer ${token}`}
            })

            if(res) {
                console.log(res.data)
                setShowEditCmt(false)
                setCommentsArr(
                    commentsArr.map(item => 
                      item.commentId === comment.commentId
                      ? res.data
                      : item
                      )
                )
                
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteCmt = async () => {
        const token = Cookies.get('token')
        try {
            const res = await axios.delete(`/comment/${comment.commentId}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(res) {
                console.log(res)
                setCommentsArr(
                    commentsArr.filter(item => 
                      item.commentId !== comment.commentId)
                )
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    //Bấm hủy sửa xóa đi ô sửa và sửa lại input change
    const handleClickCancelEdit = () => {
        setShowEditCmt(false)
        setCommentInputChange(comment.content)
    }

    return (
        <div className="comment-item" key={comment.commentId}>
            <div className="avatar-comment inline-item"
                style={{ backgroundImage: `url(${ReactHtmlParser(comment.commenter.avatarLink)})` }}></div>
            <div className="inline-item" style={{ width: "90%" }}>
                <div className='d-flex' style={{ alignItems: 'center' }}>
                    <Link to={userInfor.accountId === comment.commenter.accountId ? `/myprofile` : `/profile/${comment.commenter.accountId}`}>
                        <h5 className="comment-name">{comment.commenter.name}</h5>
                    </Link>

                    {comment.myComment ?
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


                <div className="comment-like">
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
