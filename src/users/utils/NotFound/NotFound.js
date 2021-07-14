import React from 'react'
import _404 from './404.png'
import './notFound.css'

function NotFound() {
    return (
        <div className="background__404">
            <div className="background__404--image" style={{backgroundImage: `url(${_404})`}}></div>
            <h5>Không tìm thấy trang này</h5>
        </div>
    )
}

export default NotFound
