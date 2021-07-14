import axios from 'axios'
import React, { forwardRef, useEffect, useState } from 'react'
import withClickOutsideNotification from './withClickOutsideNotification'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import { dispatchCountNoti, fetchUnseenNoti, dispatchDecreaseCount, dispatchRemoveCountNoti } from '../../../redux/actions/notificationAction'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import notificationApis from './enum/notification-apis'

const Notification = forwardRef(({ openNotification, setOpenNotification }, ref) => {
    const [notifications, setNotifications] = useState([])
    const dispatch = useDispatch()
    const notification = useSelector(state => state.notification)
    const { count } = notification
    const [pageNoti, setPageNoti] = useState(1)

    //TODO: Show amount of notifications when load page
    useEffect(() => {
        fetchUnseenNoti().then(count => {
            dispatch(dispatchCountNoti(count))
        })
    }, [])

    //Seen one notification
    const seenNotification = async (notificationId) => {
        try {
            const res = await axios.put(notificationApis.seenNotification(notificationId), null)
            if (res) {
                setOpenNotification(!openNotification)
                dispatch(dispatchDecreaseCount())
            }
        } catch (error) {
            console.log(error)
        }
    }

    const showNotification = () => {
        getFirstNotifications()
        setOpenNotification(!openNotification)
    }


    const getFirstNotifications = async () => {
        try {
            const res = await axios.get(notificationApis.getNotifications, {
                params: {
                    page: 0,
                    size: 6
                }
            })
            if (res) {
                dispatch(dispatchRemoveCountNoti())
                setNotifications(res.data)
                setPageNoti(1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getNotifications = async () => {
        setPageNoti(pageNoti + 1)
        try {
            const res = await axios.get(notificationApis.getNotifications, {
                params: {
                    page: pageNoti,
                    size: 6
                }
            })
            if (res) {
                dispatch(dispatchRemoveCountNoti())
                setNotifications([...notifications, ...res.data])
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <li className="menu__right--notify" style={{ position: 'relative' }} ref={ref}>
                {count > 0 ?
                    <div className="menu__notify--unseen">{count}</div>
                    : null}

                <i className="far fa-bell" onClick={showNotification}></i>

                {openNotification && (
                    <ul className="menu__notify--dropdown" style={{ display: 'block !important' }}>
                        <h5 style={{ marginLeft: '12px', marginTop: '12px' }}>Thông báo</h5>
                        <InfiniteScroll
                            dataLength={notifications.length}
                            next={getNotifications}
                            height={500}
                            hasMore={true}
                            scrollableTarget="menu__notify--dropdown"
                        >
                            <div className="menu__notify--content">
                                {notifications.map((item) => {
                                    return (
                                        <li key={item.notificationId} onClick={() => seenNotification(item.notificationId)}>
                                            <Link to={`/posts/${item.destPost.slug}`}
                                                style={{ display: 'flex' }}
                                            >
                                                <div className="avatar-comment"
                                                    style={{
                                                        flexBasis: '20%',
                                                        backgroundImage: `url(${ReactHtmlParser(item.sourceAccount.avatarLink)})`
                                                    }}></div>

                                                <div style={{ flexBasis: '70%', }}>
                                                    <div >
                                                        {ReactHtmlParser(ReactHtmlParser(item.content))}
                                                    </div>

                                                    <p style={{ fontSize: '12px' }}>{item.notifyDate}</p>
                                                </div>

                                                {!item.seen ? <i style={{ flexBasis: '10%', }} className="fas fa-circle"></i> : null}
                                            </Link>
                                        </li>
                                    )

                                })}
                            </div>
                        </InfiniteScroll>
                    </ul>
                )}
            </li>
        </>
    )
})

export default withClickOutsideNotification(Notification)
