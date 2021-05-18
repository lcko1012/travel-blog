import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import "./Post.css"
import avatar from './avatar.jpg'
import { PostData } from './PostData'
import axios from 'axios'

import ReactHtmlParser from 'react-html-parser'


function Post() {
  const initialState = {
    postId: 0,
    title: '',
    publishedDate: '',
    postThumbnail: '',
    slug: '',
    content: '',
    bookmarked: false,
    bookmarkedCount: 0,
    commentCount: 0,
    comments: [],
    owner: false
  }
  const location = useLocation()
  const [id, setId] = useState(null)
  const [post, setPost] = useState(initialState)
  const [posts, setPosts] = useState([])
  const [author, setAuthor] = useState({})
  const [loading, setLoading] = useState(false)
  //Khi comment hay la load lai trang
  const [callback, setCallback] = useState(false)
  console.log(useParams().slug)

  //Cu moi lan render lai
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`/post/${id}`)
        var responseContent = res.data
        console.log(responseContent)
        setPost({
          ...post,
          postId: responseContent.postId,
          title: responseContent.title,
          publishedDate: responseContent.publishedDate,
          postThumbnail: responseContent.postThumbnail,
          slug: responseContent.slug,
          content: responseContent.content,
          bookmarked: responseContent.bookmarked,
          bookmarkedCount: responseContent.bookmarkedCount,
          commentCount: responseContent.commentCount,
          comments: responseContent.comments,
          owner: responseContent.owner
        })
        setAuthor(responseContent.author)
        setLoading(true)
      } catch (err) {
        console.log(err.response)
      }
    }
    setId(location.state.id)
    if(id !== null){
      getPost()
    }
  }, [id])

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(`/post?size=6`)
        setPosts(res.data)
      } catch (err) {
        console.log(err.response)
      }
    }
    getPosts()
  }, [])

  useEffect(() => {
    return () => {
      console.log("cleaned up")
    }
  }, [])

  return (
    <>
      {loading && <main class="bg-grey pt-50 pb-50" >
        <div class="container">
          <div class="row pd-50">
            <div class="col-lg-8 pd-15">
              <div class="content-area">
                <h1 style={{ fontWeight: "700" }}>{ReactHtmlParser(post.title)}</h1>
                {/* TODO:WRITE BY AREA */}
                <div class="write-by">
                  <div class="avatar inline-item"
                    style={{ backgroundImage: `url(${author.avatarLink})` }}
                  ></div>
                  <div>
                    <div class="name-write-by">
                      <Link to={`/profile/${author.accountId}`}>{author.name}</Link>
                    </div>
                    <p class="date-write-by">{post.publishedDate}</p>
                  </div>
                </div>
                <div class="post-content" >
                  {ReactHtmlParser(ReactHtmlParser(post.content))}
                </div>
                {/* <img class="img-in-post" src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1489&q=80" alt="" /> */}

              </div>

              {/* TODO: COMMENT AREA */}
              {/* ========================COMMENT================ */}
              <div class="comment-area">
                <div>
                  <h5>Comment</h5>
                </div>
                <hr class="comment-hr" />
                {post.comments.map((comment, index) => {
                  return (
                    <div class="comment-item" key={index}>
                      <div class="avatar-comment inline-item"
                        style={{ backgroundImage: `url(${comment.commenter.avatarLink})` }}></div>
                      <div class="inline-item" style={{ width: "90%" }}>
                        <h5 class="comment-name">{comment.commenter.name}</h5>
                        <p class="comment-content">
                          {ReactHtmlParser(ReactHtmlParser(comment.content))}
                        </p>
                      </div>
                    </div>
                  )
                })}

                <form action="" className="d-flex">
                  <div class="avatar-comment"
                    style={{ backgroundImage: `url(${avatar})` }}>
                  </div>
                  <input class="comment-input" type="text" placeholder="Write comment" />
                </form>
              </div>
            </div>
            {/* ===============================END COMMENT=========================== */}

            {/* TODO: POST's INFORMATION */}
            <div class="col-lg-4 pd-15">
              <div class="post-info">
                <div className="post-info-count">
                  <div className="bookmark-count">
                    <h5>{post.bookmarkedCount}</h5>
                    <h5>Bookmark</h5>
                  </div>

                  <div className="bookmark-count">
                    <h5>{post.commentCount}</h5>
                    <h5>Bình Luận</h5>
                  </div>
                </div>
                <div className="post-info-button">
                  {post.bookmarked ?
                    <button className="bookmark-btn" style={{ backgroundColor: '#5869DA' }}></button>
                    :
                    <button className="bookmark-btn">Bookmark</button>
                  }
                </div>
              </div>

              {/* //TODO: AUTHOR's INFORMATION */}
              <div class="author-info mt-30" >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div class="avatar inline-item" style={{ backgroundImage: `url(${avatar})` }} ></div>
                  <div class="post-count inline-item">
                    <h4>10</h4>
                    <p>Bài viết</p>
                  </div>
                  <div class="follower-count inline-item">
                    <h4>100</h4>
                    <p>Người theo dõi</p>
                  </div>
                </div>
                <h5 class="author-name">Steven</h5>
                <p style={{ fontSize: "14px" }}>
                  Hi, I’m Stenven, a Florida native, who left my career in corporate
                  wealth management six years ago to embark on a summer of soul searching that would change
                  the course of my life forever.
                    </p>
              </div>

              {/* //TODO: POPULAR POSTS */}
              {/* <div style={{ marginTop: '50px' }}>
                <h5>Most popular</h5>
              </div> */}
              {/* <hr class="most-popular-hr" /> */}
              
                {/* // posts.map((item, index) => { */}
                {/* //   return (
                //     <div className="post__popular d-flex" key={index}>
                //       <div className="post__popular--content media-body" >
                //         <Link 
                //         onClick={() => window.location.reload(false)}
                //         to={{ pathname: `/posts/${item.slug}`, state: { id: item.postId }}}>
                //           <h6 className="post-title mb-15">{item.title.substring(0, 40)}...</h6>
                //         </Link>
                //       </div>
                //       <div className="d-flex ml-15 post__popular--image">
                //         <a className="color-white">
                //           <img className="border-radius-5 " src={item.postThumbnail}></img>
                //         </a>
                //       </div>
                //     </div>
                //   )
                // }) */}
              



            </div>
          </div>
        </div>
      </main>}
    </>
  )





}

export default Post
