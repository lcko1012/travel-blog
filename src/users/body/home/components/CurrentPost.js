import React from 'react'
import { Link } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import "./currentpost.css"

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
                        <h5 className="post-title  mb-10">
                            <Link to={{ pathname: `/posts/${post.slug}`, state: { id: post.postId } }}
                                href="">{ReactHtmlParser(post.title)}</Link>
                        </h5>
                        <div className="currentPost__cataArea mb-10">
                            <div className="currentPost__cata">Du lịch</div>
                            <di className="currentPost__cata">Ăn chơi</di>
                            <div className="currentPost__cata">Sài gòn</div>
                        </div>
                        <div className="entry-meta meta-1 float-left font-x-small text-uppercase">
                            <span className="post-on">{post.bookmarkedCount} bookmark</span>
                            <span className="time-reading has-dos">
                                {post.commentCount} bình luận
                              </span>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrentPost
