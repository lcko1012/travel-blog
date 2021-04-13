import React, { useState } from 'react'
import { SliderData, SliderData2 } from './SliderData'

function Home() {
  const [current, setCurrent] = useState(0);
  const length = SliderData.length

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
    <main>
      <div className="container">
        {/* FEATURED POST */}
        <div className="featured__post pb-30 pt-30 font-small text-uppercase">
          <h5 style={{fontSize: '14px'}}>Featured posts</h5>
        </div>
        <div className="mb-30">
          <div className="row-1">
            <div className="col-lg-8 mb-30">
              {
                SliderData.map((slide, index) => {
                  return (
                    <>
                      {index === current && (
                        <div className="slider thumb-overlay">
                          <div className="arrow-cover">
                            <i class="fal fa-long-arrow-left" onClick={prevSlide}></i>
                            <i class="fal fa-long-arrow-right" onClick={nextSlide}></i>
                          </div>
                          
                          <img src={slide.image} alt='travel image' className='image' />
                          <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                            <h3 className="post-title font-weight-900 mb-20">
                              <a className="text-white">{slide.title}</a>
                            </h3>
                            <div className="entry-meta meta-1 font-small text-white mt-10 " style={{textAlign:'left'}}>
                            <span>20 minutes ago</span>
                            <span className="has-dos">23k views</span>
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
              SliderData2.map((slide, index) => {
                return (
                  <div className="col-lg-4 col-md-6 mb-30">
                  <div className="post-card-1 border-radius-10">
                    <div className="thumb-overlay img-hover-slide position-relative" style={{background: `url(${slide.image})` }}> 
                    </div>
                    <div className="post-content p-30">
                      <div className="d-flex post-card-content">
    
                        <h5 className="post-title mb-20 font-weight-900">
                          <a href="#">{slide.title}</a>
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
      </div>
    </main>
  )
}

export default Home
