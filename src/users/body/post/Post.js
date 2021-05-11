import React, {useEffect, useState} from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'

import "./Post.css"
import avatar from './avatar.jpg'
import { PostData } from './PostData'

function Post() {
  const initialState = {
    title: '',
    auth: '',
    author: '',
    bookmark: 0,
    comments: []
  }

  const location = useLocation()
  
  const [id, setId] = useState(0)
  const [contents, setContents] = useState(initialState)
  const [callback, setCallback] = useState(false)
  

  const elements = ["one", "two", "three", "for"]

  //Cu moi lan render lai
  useEffect(() => {
      setId(location.state.id)
      console.log(location.state)
      var find = PostData.find(element => {
        return element.id === id
      })
      
      if(find){
        setContents(find)
      }
      
      console.log(contents)
      setCallback(callback)
  }, [id, callback, contents])
 
    return (
      <div>
      {id !== null && <main class="bg-grey pt-50 pb-50">
        <div class="container">
          <div class="row pd-50">
            <div class="col-lg-8 pd-15">
              <div class="content-area">
                <h1 style={{ fontWeight: "700" }}>{contents.title}</h1>
                <div class="write-by">
                  <div class="avatar inline-item"
                    style={{ backgroundImage: `url(${avatar})` }}
                  ></div>
                  <div>
                    <div class="name-write-by">By {contents.author}</div>
                    <p class="date-write-by">15 April 2020</p>
                  </div>
  
                </div>
                <img class="img-in-post" src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1489&q=80" alt="" />
                <p>
                  Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard
                  roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python
                  inside held shrewdly the manatee.
  
                  Integer eu faucibus dolor[5]. Ut venenatis tincidunt diam elementum imperdiet. Etiam
                  accumsan
                  semper nisl eu congue. Sed aliquam magna erat, ac eleifend lacus rhoncus in.
  
                  Fretful human far recklessly while caterpillar well a well blubbered added one a some far
                  whispered rampantly whispered while irksome far clung irrespective wailed more rosily and
                  where
                  saluted while black dear so yikes as considering recast to some crass until cow much less
                  and
                  rakishly overdrew consistent for by responsible oh one hypocritical less bastard hey oversaw
                  zebra browbeat a well.
  
                  Getting Crypto Rich
                          </p>
                <p>
                  Fretful human far recklessly while caterpillar well a well blubbered added one a some far
                  whispered rampantly whispered while irksome far clung irrespective wailed more rosily and
                  where
                  saluted while black dear so yikes as considering recast to some crass until.
  
                  Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much
                  conjointly leapt skimpily that quail sheep some goodness nightingale the instead exited
                  expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret
                  but
                  the.
                          </p>
  
                <p>
                  Fretful human far recklessly while caterpillar well a well blubbered added one a some far
                  whispered rampantly whispered while irksome far clung irrespective wailed more rosily and
                  where
                  saluted while black dear so yikes as considering recast to some crass until.
  
                  Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much
                  conjointly leapt skimpily that quail sheep some goodness nightingale the instead exited
                  expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret
                  but
                  the.
                </p>
  
              </div>
  
              {/* TODO: COMMENT AREA */}
              {/* ========================COMMENT================ */}
              <div class="comment-area">
                <div>
                  <h5>Comment</h5>
                </div>
                <hr class="comment-hr" />
  
  
  
  
                {contents.comments.map((comment, index) => {
                  return (
                    <div class="comment-item">
  
                      <div class="avatar-comment inline-item"
                        style={{ backgroundImage: `url(${comment.auth.avatar})` }}></div>
                      <div class="inline-item" style={{ width: "90%" }}>
                        <h5 class="comment-name">{comment.auth.name}</h5>
                        <p class="comment-content">{comment.comment}</p>
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
                    <h5>12</h5>
                    <h5>Bookmark</h5>
                  </div>
  
                  <div className="bookmark-count">
                    <h5>4</h5>
                    <h5>Bình Luận</h5>
                  </div>
                </div>
                <div className="post-info-button">
                  <button className="bookmark-btn">Bookmark</button>
                </div>
              </div>
  
              {/* //TODO: AUTHOR's INFORMATION */}
              <div class="author-info mt-30">
                <div style={{ display: 'flex' }}>
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
  
              {/* //FIXME: POPULAR POSTS */}
              <div style={{ marginTop: '50px' }}>
                <h5>Most popular</h5>
              </div>
              <hr class="most-popular-hr" />
  
              <div className="post__popular d-flex">
                <div className="post__popular--content media-body" >
  
                  <h6 className="post-title mb-15">Relationship Postcast</h6>
                  <div className="entry-meta meta-1 font-x-small text-uppercase">
                    <span>05 AUGUST</span>
                    <span className="post-by has-dos">150k views</span>
                  </div>
  
                </div>
                <div className="d-flex ml-15 post__popular--image">
                  <a className="color-white">
                    <img className="border-radius-5 " src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1489&q=80"></img>
                  </a>
                </div>
              </div>
  
              <div className="post__popular d-flex">
                <div className="post__popular--content media-body" >
                  <h6 className="post-title mb-15">Relationship Postcast</h6>
                  <div className="entry-meta meta-1 font-x-small text-uppercase">
                    <span>05 AUGUST</span>
                    <span className="post-by has-dos">150k views</span>
                  </div>
                </div>
                <div className="d-flex ml-15 post__popular--image">
                  <a className="color-white">
                    <img className="border-radius-5 " src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1489&q=80"></img>
                  </a>
                </div>
              </div>
  
              <div className="post__popular d-flex">
                <div className="post__popular--content media-body" >
                  <h6 className="post-title mb-15">Relationship Postcast</h6>
                  <div className="entry-meta meta-1 font-x-small text-uppercase">
                    <span>05 AUGUST</span>
                    <span className="post-by has-dos">150k views</span>
                  </div>
                </div>
                <div className="d-flex ml-15 post__popular--image">
                  <a className="color-white">
                    <img className="border-radius-5 " src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1489&q=80"></img>
                  </a>
                </div>
              </div>
  
              <div className="post__popular d-flex">
                <div className="post__popular--content media-body" >
                  <h6 className="post-title mb-15">Relationship Postcast</h6>
                  <div className="entry-meta meta-1 font-x-small text-uppercase">
                    <span>05 AUGUST</span>
                    <span className="post-by has-dos">150k views</span>
                  </div>
                </div>
                <div className="d-flex ml-15 post__popular--image">
                  <a className="color-white">
                    <img className="border-radius-5 " src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1489&q=80"></img>
                  </a>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      </main>} 
      </div>
    )
    
    
      
  
  
}

export default Post
