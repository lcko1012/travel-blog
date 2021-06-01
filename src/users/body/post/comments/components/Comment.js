import React from 'react'
import ReactHtmlParser from 'react-html-parser'

const Comment = ({comment}) => {
    return (
        <div className="comment-item" key={comment.commentId}>
            <div className="avatar-comment inline-item"
                style={{ backgroundImage: `url(${comment.commenter.avatarLink})` }}></div>
            <div className="inline-item" style={{ width: "90%" }}>
                <h5 className="comment-name">{comment.commenter.name}</h5>
                <p className="comment-content">
                    {ReactHtmlParser(ReactHtmlParser(comment.content))}
                </p>
            </div>
        </div>
    )
}

export default Comment
