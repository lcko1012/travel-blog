import React from 'react'
import { Link } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'

function CurrentPost({ post }) {
    return (
        <div className="transition-normal hover-up-2">
            <div className="row-1 mb-40 list-style-1">
                <div className="col-md-4">
                    <div className="post-thumb position-relative border-radius-5">
                        <div className="img-hover-slide border-radius-5 position-relative"
                            style={{ backgroundImage: `url(${post.postThumbnail})` }}
                        >
                            <Link to={{ pathname: `/posts/${post.slug}`, state: { id: post.postId } }}
                                className="img-link"></Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-8 align-self-center">
                    <div className="post-content">
                        <h5 className="post-title  mb-20">
                            <Link to={{ pathname: `/posts/${post.slug}`, state: { id: post.postId } }}
                                href="">{ReactHtmlParser(post.title)}</Link>

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
}

export default CurrentPost
