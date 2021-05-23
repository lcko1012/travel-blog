import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Empty from '../../utils/Empty/Empty'
import CurrentPost from '../home/components/CurrentPost'

const Bookmarks = () => {
    const [listBookmarks, setListBookmarks] = useState([])
    useEffect(() => {
        const token = Cookies.get("token")
        const getListBookmarks = async () => {
            try {
                if (token) {
                    const res = await axios.get('/bookmark/posts', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (res) {
                        console.log(res)
                        setListBookmarks(res.data)
                        console.log(listBookmarks)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }

        getListBookmarks()

    }, [])
    console.log(listBookmarks)
    return (
        <main className="main__home">
            <div className="container pb-50 pt-30">
                <div className="font-small text-uppercase pb-15">
                    <h5 style={{ fontSize: '14px' }}>Các bài viết bạn đã bookmark:</h5>
                </div>
                {listBookmarks.length === 0 ? <Empty /> :
                    listBookmarks.map((post, index) => {
                        return (
                            <CurrentPost post={post} key={index} />
                        )
                    })}
            </div>
        </main>
    )
}

export default Bookmarks
