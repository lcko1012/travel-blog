import ACTIONS from './index'
import axios from 'axios'
import commentApis from '../../users/body/post/enum/comment-apis'
import { errorNotification } from '../../users/utils/notification/ToastNotification'


export const dispatchNextCommentsPage = (id, page) => async dispatch => {
    try {
        const res = await axios.get(commentApis.getComments(id), {
            params: {
                page: page
            }
        })
        if (res.data.length === 0 || res.data.length < 10) {
            dispatch({
                type: ACTIONS.GET_NEXT_COMMENTS_PAGE,
                payload: {
                    commentsArr: res.data,
                    isEmpty: true
                }

            })
        }
        else {
            dispatch({
                type: ACTIONS.GET_NEXT_COMMENTS_PAGE,
                payload: {
                    commentsArr: res.data,
                    isEmpty: false
                }
            })

        }
    } catch (err) {
        dispatch({
            type: ACTIONS.COMMENT_ERROR,
            payload: "Không thể tải bình luận"
        })
    }
}

//GET FIRST COMMENTS PAGE
export const dispatchGetComments = (id) => async dispatch => {
    try {
        const res = await axios.get(commentApis.getComments(id))

        if (res.data.length === 0 || res.data.length < 10) {
            dispatch({
                type: ACTIONS.GET_COMMENTS,
                payload: {
                    commentsArr: res.data,
                    isEmpty: true
                }
            })
        }
        else {
            dispatch({
                type: ACTIONS.GET_COMMENTS,
                payload: {
                    commentsArr: res.data,
                    isEmpty: false
                }
            })

        }
    } catch (err) {
        dispatch({
            type: ACTIONS.COMMENT_ERROR,
            payload: "Không thể tải bình luận"
        })
    }
}

export const dispatchSubmitComments = (id, commentForm) => async dispatch => {
    try {
        const res = await axios.post(commentApis.postComment(id), commentForm)
        dispatch({
            type: ACTIONS.SUBMIT_COMMENT,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: ACTIONS.COMMENT_ERROR,
            payload: "Không thể bình luận"
        })
    }
}

// comment object
export const dispatchDeleteCmt = (comment) => async dispatch => {
    try {
        await axios.delete(commentApis.deleteComment(comment.commentId))

        dispatch({
            type: ACTIONS.DELETE_COMMENT,
            payload: comment
        })
    } catch (error) {
        dispatch({
            type: ACTIONS.COMMENT_ERROR,
            payload: "Không thể xóa bình luận"
        })
    }
}

// comment object
export const dispatchLikeCmt = (comment) => async dispatch => {
    try {
        const res = await axios.put(commentApis.likeComment(comment.commentId), null)
        dispatch({
            type: ACTIONS.LIKE_COMMENT,
            payload: {
                comment: comment,
                likeCount: res.data
            }
        })
    } catch (error) {
        if(error.response.status === 404) {
            errorNotification("Bình luận này không tồn tại")
            dispatch({
                type: ACTIONS.DELETE_COMMENT,
                payload: comment
            })
        }
        else {
            dispatch({
                type: ACTIONS.COMMENT_ERROR,
                payload: "Không thể thích bình luận"
            })
        }
        
    }
}


export const dispatchEditCmt = (comment, formData) => async dispatch => {
    dispatch({ type: ACTIONS.LOADING_COMMENT, payload: comment.commentId })
    try {
        const res = await axios.put(commentApis.updateComment(comment.commentId), formData)
        console.log(res.data)
        dispatch({
            type: ACTIONS.EDIT_COMMENT,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: ACTIONS.COMMENT_ERROR,
            payload: "Không thể sửa bình luận"
        })
    }
}

export const dispatchAddCmt = (comment) => {
    return {
        type: ACTIONS.ADD_COMMENT,
        payload: comment
    }
}

export const dispatchClearCmts = () => {
    return {
        type: ACTIONS.CLEAR_COMMENT,
    }
}

