import axios from 'axios'
import Cookies from 'js-cookie'
import React, { forwardRef, useEffect, useState } from 'react'
import withClickOutsideNotify from './withClickOutsideNotify'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import {dispatchCountNoti, fetchUnseenNoti, dispatchDecreaseCount, dispatchRemoveCountNoti} from '../../redux/actions/notifyAction'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'


const Notify = forwardRef(({openNotify, setOpenNotify}, ref) => {
    const [notifications, setNotifications] = useState([])
    const dispatch = useDispatch()
    const notify = useSelector(state => state.notify)
    const {count} = notify
    
    //TODO: Show amount of notifications when load page
    useEffect(() => {
        // const getAmountNoti = async () => {
        //     try {
        //         const res = await axios.get('/notifications/unseen')
        //         if(res) {
        //             setAmountNoti(res.data.length)
        //         }
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // getAmountNoti()
        fetchUnseenNoti().then(count => {
            dispatch(dispatchCountNoti(count))
        })

    }, [])

    //Seen notify
    const handleSeenNotify = async (notification_id) => {
        try {
            const res = await axios.put(`/notifications/${notification_id}/seen`, null)
            if(res) {
                setOpenNotify(!openNotify)
                dispatch(dispatchDecreaseCount())
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowNotify = () => {
        const getNotifications = async () => {
            try {
                const res = await axios.get('/notifications')
                if(res) {
                    dispatch(dispatchRemoveCountNoti())
                    setNotifications(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getNotifications()
        setOpenNotify(!openNotify)
    }

    return (
        <>
        <li className="menu__right--notify" style={{position: 'relative'}} ref={ref}>
            {count > 0 ?
            <div className="menu__notify--unseen">{count}</div>
            : null}
            
            <i className="far fa-bell" onClick={handleShowNotify}></i>
            {openNotify && (
            <ul className="menu__notify--dropdown" style={{display: 'block !important'}}>
                <h5 style={{marginLeft: '12px', marginTop: '12px'}}>Thông báo</h5>
                {notifications.map((item) => {
                    return(
                        <li key={item.notificationId} onClick={() => handleSeenNotify(item.notificationId)}>
                            <Link to={`/posts/${item.destPost.slug}`}
                            style={{display: 'flex'}}
                            >
                                <div className="avatar-comment" 
                                style={{ 
                                    flexBasis: '20%',
                                    backgroundImage: `url(${ReactHtmlParser(item.sourceAccount.avatarLink)})` }}></div>
                                <div style={{ flexBasis: '70%',}}>
                                    <div >
                                    {ReactHtmlParser(ReactHtmlParser(item.content))}
                                    </div>
                                    <p style={{fontSize: '12px'}}>{item.notifyDate}</p>
                                </div>
                                
                                {!item.seen ? <i style={{ flexBasis: '10%',}} className="fas fa-circle"></i> : null}
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
