import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Empty from '../../utils/Empty/Empty';
import CurrentPost from '../home/components/CurrentPost';

const SearchPage = () => {
    const location = useLocation()
    const search = location.search;
    const params = new URLSearchParams(search);
    const keyword = params.get('keyword');
    const [currentPage, setCurrentPage] = useState(0)
    const [postsResult, setPostsResult] = useState([])
    //Kiem tra trang tiep theo co rong k?
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {
        try {
            const findPost = async () => {
                const res = await axios.get(`/post`, {
                    params: {
                        keyword: keyword,
                        page: currentPage
                    }
                })

                if (res) {
                    setPostsResult([...postsResult, ...res.data])
                    console.log(res.data.length)
                    if(res.data.length === 0) {
                        setIsEmpty(true)
                    }
                }
            }
            findPost()
        } catch (error) {
            console.log(error)
        }
    }, [currentPage])
    return (
        <main className="main__home">
            <div className="container pb-50 pt-30">
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
            </div>
        </main>
    )
}

export default SearchPage
