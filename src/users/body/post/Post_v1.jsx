import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import Loading from '../../utils/Loading/Loading'
import NotFound from '../../utils/NotFound/NotFound'
import postApi from './enum/post-api'
import ReactHtmlParser from 'react-html-parser'
import Comments_v1 from './comments/Comments_v1'
import { errorNotification } from '../../utils/notification/ToastNotification'
import Cookies from 'js-cookie'
import profileApis from '../profile/enum/profile-apis'
import { useSelector } from 'react-redux'


const ACTIONS = {
    GET_POST: 'get-post',
    LOADING_POST: 'loading-post',
    SET_ITEM_POST: 'set-item-post',
    BOOKMARK_POST: 'bookmark-post',
    FOLLOW_USER: 'follow-user',
    RELOAD_USER: 'reload-user'
}

function PostReducer(state, action) {
    switch (action.type) {
        case ACTIONS.GET_POST:
            return {
                ...state,
                post: action.payload,
                loadingPost: false
            }
        case ACTIONS.SET_ITEM_POST:
            return {
                ...state,
                ...action.payload
            }
        case ACTIONS.BOOKMARK_POST:
            return {
                ...state,
                post: {
                    ...state.post,
                    bookmarkedCount: action.payload.bookmarkedCount,
                    bookmarked: action.payload.bookmarked
                }
            }
        case ACTIONS.FOLLOW_USER:
            return {
                ...state,
                post: {
                    ...state.post,
                    author: {
                        ...state.post.author,
                        followed: !state.post.author.followed
                    }
                }
            }
        case ACTIONS.RELOAD_USER:
            return {
                ...state,
                post: {
                    ...state.post,
                    author: {
                        ...action.payload
                    }
                }
            }

        default:
            return state
    }
}


function Post_v1() {
    const initialPost = {
        post: {},
        loadingPost: true,
        notFound: false,
        accountId: null
    }
    const [postState, dispatch] = useReducer(PostReducer, initialPost)
    const params = useParams()
    const history = useHistory()
    const location = useLocation()
    const auth = useSelector(state => state.auth)
    const { post, loadingPost, notFound, accountId } = postState


    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await axios.get(postApi.getPost, {
                    params: { slug: params.slug }
                })
                dispatch({ type: ACTIONS.GET_POST, payload: res.data })
                dispatch({ type: ACTIONS.SET_ITEM_POST, payload: { accountId: res.data.author.accountId } })
            } catch (error) {
                if (error.response.status === 404) dispatch({ type: ACTIONS.SET_ITEM_POST, payload: { notFound: true } })
            }
        }
        getPost()
    }, [])

    useEffect(() => {
        const getAuthor = async () => {
            console.log("get author")
            try {
                const res = await axios.get(profileApis.getUserInfor(post.author.accountId))
                dispatch({ type: ACTIONS.RELOAD_USER, payload: res.data })
            } catch (error) {
                console.log(error)
                if (error.response.status === 404) dispatch({ type: ACTIONS.SET_ITEM_POST, payload: { notFound: true } })
            }
        }
        if (accountId) getAuthor()
    }, [accountId])

    const handleBookmark = async () => {
        if (!Cookies.get("token")) return history.push(`/login?redirectTo=${location.pathname}`)
        var bookmarkForm = new FormData()
        bookmarkForm.append("postId", post.postId)

        try {
            const res = await axios.post(postApi.bookmarkPost, bookmarkForm)
            dispatch({
                type: ACTIONS.BOOKMARK_POST,
                payload: {
                    bookmarked: true,
                    bookmarkedCount: res.data
                }
            })

        } catch (err) {
            errorNotification("Đã có lỗi xảy ra 🙁")
        }

    }

    const handleUnBookmark = async () => {
        var bookmarkForm = new FormData()
        bookmarkForm.append("postId", post.postId)

        try {
            const res = await axios.delete(postApi.unBookmarkPost(post.postId))
            dispatch({
                type: ACTIONS.BOOKMARK_POST,
                payload: {
                    bookmarked: false,
                    bookmarkedCount: res.data
                }
            })
        } catch (err) {
            errorNotification("Đã có lỗi xảy ra 🙁")
        }
    }

    const chooseHandleBookmark = () => {
        return post.bookmarked ? handleUnBookmark() : handleBookmark()
    }

    const handleClickFollow = async () => {
        if (!Cookies.get("token")) return history.push(`/login?redirectTo=${location.pathname}`)
        const res = await axios.put(profileApis.followUser(post.author.accountId), null)
        if (res) dispatch({ type: ACTIONS.FOLLOW_USER })
    }

    const handleEditProfile = () => {
        history.push('/myprofile/edit')
    }

    function MainPage() {
        return (
            <main className='main__home'>
                <div className=' pt-4 pb-50'>
                    {
                        loadingPost ? <Loading /> :
                            <div className='row'>
                                <aside className='col-lg-1'>
                                    <div className='post__left'>
                                        <div
                                            className='d-flex flex-column justify-content-center align-items-center cursor-pointer'
                                            onClick={chooseHandleBookmark}
                                        >
                                            <i className={`far fa-bookmark ${post.bookmarked ? 'post__left--bookmarked-icon' : 'post__left--bookmark-icon'}`} />
                                            <p>{post.bookmarkedCount}</p>
                                        </div>
                                        <div>
                                            <i className="far fa-ellipsis-h"></i>
                                        </div>
                                    </div>
                                </aside>

                                <div className='col-lg-8 '>
                                    <div className='post__center'>
                                        <div className='post__center--image-thumb'>
                                            <img src={ReactHtmlParser(post.postThumbnail)}></img>
                                        </div>

                                        <div className='post__center--main'>
                                            <div className="post__center--write-by mb-30">
                                                <div className="d-flex">
                                                    <Link to={`/profile/${post.author.accountId}`}>
                                                        <div className="post__center--avatar-write-by inline-item"
                                                            style={{ backgroundImage: `url(${ReactHtmlParser(post.author.avatarLink)})` }}
                                                        >
                                                        </div>
                                                    </Link>

                                                    <div style={{ margin: 'auto 0' }}>
                                                        <div className="post__center--name-write-by">
                                                            <Link to={`/profile/${post.author.accountId}`}>{post.author.name}</Link>
                                                        </div>
                                                        <p className="post__center--date-write-by">{post.publishedDate}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h1 className='post__center--title'>
                                                    {post.title}
                                                </h1>

                                                <div className="post__category-area">
                                                    {post.categories.map((item) => {
                                                        return (
                                                            <Link to={{ pathname: `/category/${item.categoryId}` }} key={item.categoryId}>
                                                                <div className="post__category"
                                                                    key={item.categoryId}>{item.categoryName}
                                                                </div>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="post__center--content" >
                                                {ReactHtmlParser(ReactHtmlParser(post.content))}
                                            </div>

                                            <Comments_v1 postId={post.postId} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-3'>
                                    <div className='post__right'>
                                        <div className='post__right--author-infor'>
                                            <div className='post__right--author-name'>
                                                <div className="post__center--avatar-write-by inline-item"
                                                    style={{ backgroundImage: `url(${ReactHtmlParser(post.author.avatarLink)})` }}
                                                >
                                                </div>
                                                <h2>{post.author.name}</h2>
                                            </div>
                                            {
                                                auth.user.accountId !== accountId ?
                                                    <div
                                                        className='post__right--author-follow'
                                                        onClick={handleClickFollow}
                                                    >
                                                        {
                                                            post.author.followed ?
                                                                <button className='btn btn-light post__right--following-btn'>
                                                                    Following
                                                                </button>
                                                                :
                                                                <button className='btn btn-primary post__right--follow-btn'>
                                                                    Follow
                                                                </button>
                                                        }
                                                    </div> :
                                                    <div
                                                        className='post__right--author-follow'
                                                        onClick={handleEditProfile}
                                                    >
                                                        <button className='btn btn-primary post__right--follow-btn'>
                                                            Edit profile
                                                        </button>
                                                    </div>
                                            }


                                            <div className='post__right--author-more-infor'>
                                                <label>ABOUT:</label>
                                                <div>
                                                    {post.author.about}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </main>
        )
    }

    return (
        <>
            {notFound ? NotFound : MainPage()}
        </>
    )
}

export default Post_v1
