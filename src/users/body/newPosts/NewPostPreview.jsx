import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import { stateToHTML } from "draft-js-export-html";
import Categories from '../../../core/components/Categories';

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

                <Categories categories={post.categories} />
                
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
