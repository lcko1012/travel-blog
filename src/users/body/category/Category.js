import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Empty from '../../utils/Empty/Empty'
import CurrentPost from '../home/components/CurrentPost'
import Loading from '../../utils/Loading/Loading'

const Category = () => {
    const params = useParams()
    // const [id, setId] = useState(params.id)
    const [currentPage, setCurrentPage] = useState(0)
    const [postsResult, setPostsResult] = useState([])
    //Kiem tra trang tiep theo co rong k?
    const [isEmpty, setIsEmpty] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        console.log("1")
        try {
            const findPost = async () => {
                const res = await axios.get(`/category/${params.id}/post`, {
                    params: {
                        page: currentPage
                    }
                })

                if (res) {
                    setPostsResult([...postsResult, ...res.data])
                    console.log(res.data.length)
                    if (res.data.length === 0) {
                        setIsEmpty(true)
                    }
                }
            }
            findPost()

        } catch (error) {
            console.log(error)
        }
    }, [currentPage])


    useEffect(() => {
        try {
            const findPost = async () => {
                const res = await axios.get(`/category/${params.id}/post`, {
                    params: {
                        page: 0
                    }
                })

                if (res) {
                    setPostsResult(res.data)
                    if (res.data.length === 0) {
                        setIsEmpty(true)
                    }
                }
            }
            findPost()

        } catch (error) {
            console.log(error)
        }
    }, [params.id])


    return (
        <main className="main__home">
            <div className="container pb-50 pt-30">
                {isLoading ?
                    <>
                        <div className="font-small text-uppercase pb-15">
                            <h5 style={{ fontSize: '14px' }}>Kết quả tìm kiếm:</h5>
                        </div>
                        {postsResult.length === 0 ? <Empty /> :
                            postsResult.map((post, index) => {
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
                    : <Loading />

                }

            </div>
        </main>
    )
}

export default Category
