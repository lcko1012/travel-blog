import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import _404 from './404.png'
import './notFound.css'

function NotFound() {
    const history = useHistory()
    
    // useEffect(() => {
    //     setTimeout(() => {
    //         history.push('/')
    //     }, 3000)
    // }, [])
    return (
        <div className="background__404">
            <div className="background__404--image" style={{backgroundImage: `url(${_404})`}}></div>
            <h5>Không tìm thấy trang này</h5>
        </div>
    )
}

export default NotFound
