import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Empty from '../../utils/Empty/Empty'
import Loading from '../../utils/Loading/Loading'
import CurrentPost from '../home/components/CurrentPost'

const Bookmarks = () => {
    const [listBookmarks, setListBookmarks] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [isEmpty, setIsEmpty] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const token = Cookies.get("token")
        const getListBookmarks = async () => {
            try {
                console.log(currentPage)
                if (token) {
                    const res = await axios.get('/bookmark/posts', {
                        params: { page: currentPage },
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (res) {
                        console.log(res)
                        setListBookmarks([...listBookmarks, ...res.data])
                        if (res.data.length === 0) {
                            setIsEmpty(true)
                        }
                        setIsLoading(false)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }

        getListBookmarks()

    }, [currentPage])
    console.log(listBookmarks)
    return (
        <main className="main__home">
            <div className="container pb-50 pt-30">
                {!isLoading ?
                    <>
                        <div className="font-small text-uppercase pb-15">
                            <h5 style={{ fontSize: '14px' }}>Các bài viết bạn đã bookmark:</h5>
                        </div>
                        {listBookmarks.length === 0 ? <Empty /> :
                            listBookmarks.map((post, index) => {
                                return (
                                    <CurrentPost post={post} key={index} />
                                )
                            })}

                        <div className="pagination-area mb-30">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-start">
                                    <li className={`page-item" ${isEmpty ? 'disabled' : null}`}
                                        onClick={() => setCurrentPage(currentPage + 1)}>
                                        <a className="page-link">
                                            <i className="fal fa-long-arrow-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </>
                    :
                    <Loading />
                }
            </div>
        </main>
    )
}

export default Bookmarks
