import axios from 'axios'
import Cookies from 'js-cookie'
import React, { forwardRef, useEffect, useState } from 'react'
import withClickOutsideNotify from './withClickOutsideNotify'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'


const Notify = forwardRef(({openNotify, setOpenNotify}, ref) => {
    const [notifications, setNotifications] = useState([])

    // useEffect(() => {
        
    // }, [])

    const handleSeenNotify = async (notification_id) => {
        try {
            const token = Cookies.get("token")
            const res = await axios.put(`/notifications/${notification_id}/seen`, null, {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(res) {
                setOpenNotify(!openNotify)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowNotify = () => {

        const getNotifications = async () => {
            const token = Cookies.get("token")
            try {
                const res = await axios.get('/notifications', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(res) {
                    console.log(res)
                    setNotifications(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        setOpenNotify(!openNotify)
        getNotifications()
        
    }

    console.log(openNotify)
    return (
        <>
        <li className="menu__right--notify" style={{position: 'relative'}} ref={ref}>
            <i className="far fa-bell" onClick={handleShowNotify}></i>
            {openNotify && (
            <ul className="menu__notify--dropdown" style={{display: 'block !important'}}>
                {notifications.map((item) => {
                    return(
                        <li key={item.notificationId} onClick={() => handleSeenNotify(item.notificationId)}>
                            <Link to={`/posts/${item.destPost.slug}`}
                            style={{display: 'flex'}}
                            >
                                <div>
                                {ReactHtmlParser(ReactHtmlParser(item.content))}
                                </div>
                                {!item.seen ? <i className="fas fa-circle"></i> : null}
                            </Link>
                        </li>
                    )

                })}
            </ul>
        )}
        </li>
        
        
        </>
    )
})

export default withClickOutsideNotify(Notify)
