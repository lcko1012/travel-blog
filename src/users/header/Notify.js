import axios from 'axios'
import Cookies from 'js-cookie'
import React, { forwardRef, useEffect, useState } from 'react'
import withClickOutsideNotify from './withClickOutsideNotify'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import {dispatchCountNoti, fetchUnseenNoti, dispatchDecreaseCount, dispatchRemoveCountNoti} from '../../redux/actions/notifyAction'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loading from '../utils/Loading/Loading'

const Notify = forwardRef(({openNotify, setOpenNotify}, ref) => {
    const [notifications, setNotifications] = useState([])
    const dispatch = useDispatch()
    const notify = useSelector(state => state.notify)
    const {count} = notify
    const [pageNoti, setPageNoti] = useState(0)
    
    //TODO: Show amount of notifications when load page
    useEffect(() => {
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
        getNotifications()
        setOpenNotify(!openNotify)
    }

    const getNotifications = async () => {
        setPageNoti(pageNoti+1)
        try {
            const res = await axios.get('/notifications', {
                params: {
                    page: pageNoti, 
                    size: 6
                }
            })
            if(res) {
                dispatch(dispatchRemoveCountNoti())
                setNotifications([...notifications, ...res.data])
            }
        } catch (error) {
            console.log(error)
        }
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
                {/* <div style={{overflow: 'scroll'}}> */}
            <InfiniteScroll
            dataLength={notifications.length}
            next={getNotifications}
            height={500}
            hasMore={true}
            // loader={<Loading />}
            scrollableTarget="menu__notify--dropdown"
            >
                <div className="menu__notify--content">
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
                </div>
                </InfiniteScroll>
                {/* </div> */}
            </ul>
        )}
        </li>
        
        
        </>
    )
})

export default withClickOutsideNotify(Notify)
