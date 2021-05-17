import React, { useState, useEffect } from 'react'
import { SliderData, SliderData2, SliderData3 } from './SliderData'
import avatar from '../../../asset/images/avatar.jpg'
import axios from 'axios';
import "./home.css"
import { Link } from 'react-router-dom';

function Home() {
  const [current, setCurrent] = useState(0);
  const [posts, setPosts] = useState([])
  const length = posts.length

  const [currentPage, setCurrentPage] = useState(1)
  

  //[] => chi 1 lan khi load trang
  // khong co [] load lien tuc
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('/post', {
        params: {
          prop: "bookmark"
        }
      })
      setPosts(res.data)
    }
    getData()
    console.log(posts)
  }, [])

  const nextSlide = () => {
    setCurrent(current == length - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current == 0 ? length - 1 : current - 1)
  }

  if (!Array.isArray(SliderData) || SliderData.length <= 0) {
    return null
  }
  return (
    <main className="main__home">
      <div className="container">
        {/* FEATURED POST */}
        <div className="featured__post  pt-15 font-small text-uppercase">
          <h5 style={{fontSize: '14px'}}>Các bài đăng nổi bật</h5>
        </div>
          <div className="row-1">
            <div className="col-lg-8 mb-30">
              {/* TODO: NỔI BẬT POSTS */}
              {
                posts.map((post, index) => {
                  return (
                    <>
                      {index === current && (
                        <div className="slider thumb-overlay hieu-ung" key={index}>
                          <div className="arrow-cover">
                            <i class="fal fa-long-arrow-left" onClick={prevSlide}></i>
                            <i class="fal fa-long-arrow-right" onClick={nextSlide}></i>
                          </div>
                          
                          <img src={post.postThumbnail} alt='travel image' className='image' />
                          <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                            <h3 className="post-title mb-20" style={{fontSize: 20}}>
                              <Link to={{pathname: `/posts/${post.slug}`, state: {id: post.postId}}}
                              className="text-white">
                                {post.title}
                              </Link>
                            </h3>
                            <div className="entry-meta meta-1 font-small text-white mt-10 " style={{textAlign:'left'}}>
                            <span>{post.bookmarkedCount} lượt bookmark</span>
                            <span className="has-dos">{post.commentCount} bình luận</span>
                          </div>
                          </div>
                        </div>
                      )}
                    </>
                  )
                })
              }
            </div>
            
            {
              posts.map((post, index) => {
                return (
                  <div className="col-lg-4 col-md-6 mb-30" key={index}>
                  <div className="post-card-1 border-radius-10 hieu-ung">
                    <div className="thumb-overlay img-hover-slide position-relative" style={{background: `url(${post.postThumbnail})` }}> 
                    </div>
                    <div className="post-content p-30">
                      <div className="d-flex post-card-content">
    
                        <h5 className="post-title mb-20 ">
                          <a href="#">{post.title}</a>
                        </h5>
                        <div className="entry-meta meta-1 float-left font-x-small text-uppercase">
                          <span>27 August</span>
                          <span className="time-reading has-dos">12 mins read</span>
                          <span className="post-by has-dos">12k views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )
              })
            }
          </div>
        
      </div>
      
      {/* TODO: MỚI POSTS */}
      <div className="pt-15 pb-50" >
          <div className="container">
            <div className="row-1">
              <div className="col-lg-8">
                <div className="post-module-2">
                  <div className="mb-30 position-relative">
                    <h5 className="mb-30">Bài đăng mới</h5>
                  </div>

                  {/* ==== LOOP LIST ===== */}
                  <div className="loop-list">
                  {SliderData3.map((slide, index) => {
                      return (
                        <div className="transition-normal hover-up-2" key={index}>
                    <div className="row-1 mb-40 list-style-1">
                        <div className="col-md-4">
                          <div className="post-thumb position-relative border-radius-5">
                              <div className="img-hover-slide border-radius-5 position-relative"
                              style={{backgroundImage: `url(${slide.image})` }}
                              >
                                <a className="img-link" href=""></a>
                              </div>
                          </div>
                        </div>

                        <div className="col-md-8 align-self-center">
                          <div className="post-content">
                            <h5 className="post-title  mb-20">
                              <a href="#">{slide.title}</a>
                            </h5>
                            <div className="entry-meta meta-1 float-left font-x-small text-uppercase">
                              <span className="post-on">7 August</span>
                              <span className="time-reading has-dos">
                                11 mins read
                              </span>
                              <span className="post-by has-dos">
                              3K views

                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      )
                    })}
                    
                  </div>

                  {/* ======END LOOP LIST==== */}

                  {/*TODO: PAGINATION*/}
                  <div className="pagination-area mb-30">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-start">
                        <li className="page-item">
                          <a className="page-link">
                            <i className="fal fa-long-arrow-left"></i>
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link">
                            01
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link">
                            02
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link">
                            03
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link">
                            04
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link">
                            <i className="fal fa-long-arrow-right"></i>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>

                  {/* ======END PAGINATION==== */}


                </div>
              </div>
              <div className="col-lg-4">
                {/* TODO: AUTHOR INFORMATION */}
                <div class="author-info mt-30 hieu-ung">
                  <div style={{display: 'flex'}}>
                  <div class="avatar inline-item" style={{backgroundImage: `url(${avatar})`}} ></div>
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
                  <p style={{fontSize: "14px"}}>
                      Hi, I’m Stenven, a Florida native, who left my career in corporate
                      wealth management six years ago to embark on a summer of soul searching that would change
                      the course of my life forever.
                  </p>
                </div>
                {/* TODO: NHIỀU COMMENT */}
                <div style={{marginTop: '50px'}}>
                        <h5>Most popular</h5>
                    </div>
                    <hr class="most-popular-hr" />

                    {SliderData2.map((slide, index) => {
                      return (

                    <div className="post__popular d-flex hieu-ung" key={index}>
                      
                      <div className="post__popular--content media-body" >
                        <h6 className="post-title mb-15">
                          <Link to={{pathname: '/posts/Bien-Da-nang-co-dep-khong', state: {id: '1'}}}>
                          {slide.title}
                          </Link>
                          </h6>
                        <div className="entry-meta meta-1 font-x-small text-uppercase">
                          <span>05 AUGUST</span>
                          <span className="post-by has-dos">150k views</span>
                        </div>
                      </div>

                      <div className="d-flex ml-15 post__popular--image">
                        <a className="color-white">
                          <img className="border-radius-5 " src={slide.image}></img>
                        </a>
                      </div>
                      
                      
                    </div>
                      )
                    })}
                    
              </div>
            </div>
          </div>
      </div>
    </main>

    /**
     * *fdsfsd
     * !fdsfsdfsd
     * ?đâsdas
     * todo dsadasdas
     * @sddf fdsfdsf
     */
  )
}

export default Home
