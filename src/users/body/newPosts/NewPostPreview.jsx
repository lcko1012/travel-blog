import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import { stateToHTML } from "draft-js-export-html";

function NewPostPreview({ post, content }) {
    console.log(content)
    return (
        <div className='new-post__center-main-preview'>

            <div className='post__center--image-thumb'>
                {post.postThumbnail ? <img src={ReactHtmlParser(post.postThumbnail)} alt="thumbnail" /> : null}
            </div>

            <div className='new-post__center-main--infor'>
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
                <div className="post__center--content" >
                    {
                        ReactHtmlParser(stateToHTML(content.getCurrentContent()))
                    }
                </div>
            </div>
        </div>
    )
}

export default NewPostPreview
