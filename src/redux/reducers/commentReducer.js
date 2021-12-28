import ACTIONS from '../actions/index'

const initialState = {
    commentsArr: [],
    //Check if page is empty
    isEmpty: false,
    errData: null,
    isLoadSubmit: false,
}


const commentReducer = (state = initialState, action) => {
    switch (action.type) {
        //get first page
        case ACTIONS.GET_COMMENTS:
            return {
                ...state,
                commentsArr: action.payload.commentsArr,
                isEmpty: action.payload.isEmpty,
                errData: null,
                isLoadSubmit: false
            }
        case ACTIONS.GET_NEXT_COMMENTS_PAGE:
            return {
                ...state,
                commentsArr: [...state.commentsArr, ...action.payload.commentsArr],
                isEmpty: action.payload.isEmpty,
                errData: null,
                isLoadSubmit: false
            }

        case ACTIONS.EMPTY_COMMENT:
            return {
                ...state,
                isEmpty: action.payload,
                errData: null,
                isLoadSubmit: false
            }

        case ACTIONS.SUBMIT_COMMENT: {
            return {
                ...state,
                errData: null,
                isLoadSubmit: false
            }
        }

        case ACTIONS.DELETE_COMMENT:
            //if delete a parent comment, which is not have parentId
            if (action.payload.parentId === null) {
                return {
                    ...state,
                    commentsArr: state.commentsArr.filter(
                        item => item.commentId !== action.payload.commentId
                    ),
                    errData: null,
                    isLoadSubmit: false
                }
            }
            //if delete a child comment, which is have parentId
            else if (action.payload.parentId !== null) {
                return {
                    ...state,
                    commentsArr: state.commentsArr.map(
                        item => {
                            if (item.commentId === action.payload.parentId) {
                                return {
                                    ...item,
                                    childComments: item.childComments.filter(
                                        child => child.commentId !== action.payload.commentId
                                    )
                                }
                            }
                            return item
                        })
                }
            }
            return state

        case ACTIONS.ADD_COMMENT: {
            //check if this comment is a reply comment
            if (action.payload.parentId) {
                return {
                    ...state,
                    errData: null,
                    isLoadSubmit: false,
                    commentsArr: state.commentsArr.map(item =>
                        item.commentId === action.payload.parentId ? { ...item, childComments: [...item.childComments, action.payload] } : item
                    )
                }
            }
            //check if this comment is exist,
            //maybe realtime system send same comment
            //if exist, then do not add it
            else if (state.commentsArr.includes(action.payload)) {
                return {
                    ...state,
                    errData: null,
                    isLoadSubmit: false
                }
            }
            //else if is not exist, add it
            else {
                return {
                    ...state,
                    commentsArr: [action.payload, ...state.commentsArr],
                    errData: null,
                    isLoadSubmit: false,
                }
            }
        }
        case ACTIONS.LIKE_COMMENT:
            //if like a parent comment, which is not have parentId of it
            if (action.payload.comment.parentId === null) {
                return {
                    ...state,
                    commentsArr: state.commentsArr.map(item =>
                        item.commentId === action.payload.comment.commentId
                            ? { ...item, likeCount: action.payload.likeCount, liked: !item.liked }
                            : item
                    ),
                    errData: null,
                    isLoadSubmit: false
                }
            }
            //else if like a reply comment, which have parentId
            else if (action.payload.comment.parentId !== null) {
                return {
                    ...state,
                    commentsArr: state.commentsArr.map(item =>
                        item.commentId === action.payload.comment.parentId
                            ? {
                                ...item, childComments: item.childComments.map(child =>
                                    child.commentId === action.payload.comment.commentId
                                        ? { ...child, likeCount: action.payload.likeCount, liked: !child.liked }
                                        : child
                                )
                            }
                            : item
                    ),
                    errData: null,
                    isLoadSubmit: false
                }
            }
            return state

        case ACTIONS.EDIT_COMMENT:
            //if edit a parent comment, which is not have parentId of it
            if (action.payload.parentId === null) {
                return {
                    ...state,
                    commentsArr: state.commentsArr.map(item =>
                        item.commentId === action.payload.commentId
                            ? {...item, content: action.payload.content}
                            : item
                    ),
                    errData: null,
                    isLoadSubmit: false
                }
            }
            //else if edit a reply comment, which have parentId
            else if (action.payload.parentId !== null) {
                return {
                    ...state,
                    commentsArr: state.commentsArr.map(item =>
                        item.commentId === action.payload.parentId
                            ? {
                                ...item, childComments: item.childComments.map(child =>
                                    child.commentId === action.payload.commentId
                                        ? {...child, content: action.payload.content}
                                        : child
                                )
                            }
                            : item
                    ),
                    errData: null,
                    isLoadSubmit: false
                }
            }
            return state

        case ACTIONS.CLEAR_COMMENT:
            return {
                initialState
            }

        case ACTIONS.COMMENT_ERROR:
            return {
                ...state,
                errData: action.payload
            }

        case ACTIONS.LOADING_COMMENT:
            return {
                ...state,
                errData: null,
                isLoadSubmit: action.payload
            }
        default:
            return state
    }
}

export default commentReducer