import './AdminHome.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactHtmlParse from "react-html-parser";

function AdminHome(props) {
    const initialState = {
        userCount: 0,
        postCount: 0,
        reportedPostCount: 0
    }
    const { token } = props;
    const [info, setInfo] = useState(initialState);
    const [topUsers, setTopUsers] = useState([]);
    const [topPosts, setTopPosts] = useState([]);

    useEffect(() => {
        const getInfo = async () => {
            try {
                const res = await axios.get("/system/info", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res) {
                    setInfo(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }

        const getTopUsers = async () => {
            try {
                const res = await axios.get("/user/follow/top", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res) {
                    setTopUsers(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }

        const getTopPosts = async () => {
            try {
                const res = await axios.get("/post?prop=bookmark&size=10", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res) {
                    setTopPosts(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }

        getInfo()
        getTopUsers()
        getTopPosts()
    }, [])

    const elmPost = topPosts.map((post, index) => {
        return (
            <tr>
                <th className="text-center" scope="row">{index + 1}</th>
                <td>{post.title.length > 20 ? ReactHtmlParse(post.title.slice(0, 20)) + "..." : ReactHtmlParse(post.title)}</td>
                <td>{post.owner ? post.owner : "Chưa có"}</td>
                <td className="text-center">{post.bookmarkedCount}</td>
            </tr>
        )
    })

    const elmUser = topUsers.map((user, index) => {
        return (
            <tr>
                <th scope="row" className="text-center">{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="text-center">{user.followCount}</td>
            </tr>
        )
    })

    return (
        <>
            <main className="main__home">
            <div className="AdminPage">
            <div className="right-panel">
                <div className="row">
                    <div className="col-lg-4 pd-15">
                        <div className="new-user">
                            <div className="row">
                                <div className="col-lg-5">
                                    <div className="icon">
                                        <i className="fad fa-users fa-5x"></i>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="title">
                                        <h2>Người dùng</h2>
                                    </div>
                                    <div className="number">
                                        <h1>{info.userCount}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 pd-15">
                        <div className="post">
                            <div className="row">
                                <div className="col-lg-5">
                                    <div className="icon">
                                        <i className="fal fa-newspaper fa-5x"></i>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="title">
                                        <h2>Bài viết</h2>
                                    </div>
                                    <div className="number">
                                        <h1>{info.postCount}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 pd-15">
                        <div className="reported-post">
                            <div className="row">
                                <div className="col-lg-5">
                                    <div className="icon">
                                        <i className="far fa-exclamation-triangle fa-5x"></i>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="title">
                                        <h2>Báo cáo</h2>
                                    </div>
                                    <div className="number">
                                        <h1>{info.reportedPostCount}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6">
                        <div className="most-favorite-post">
                            <h3 className="list-name">Top 10</h3>
                            <h5 className="web-name">Bài viết được yêu thích nhất</h5>
                            <hr></hr>
                            <div className="most-favorite-post-table">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-center">Rank</th>
                                            <th scope="col">Tiêu đề</th>
                                            <th scope="col">Tác giả</th>
                                            <th scope="col" className="text-center">Bookmark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elmPost}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="most-followed-user">
                            <h3 className="list-name">Top 10</h3>
                            <h5 className="web-name">Người có nhiều follow nhất</h5>
                            <hr></hr>
                            <div className="most-followed-user-table">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-center">Rank</th>
                                            <th scope="col">Tên</th>
                                            <th scope="col">Email</th>
                                            <th scope="col" className="text-center">Số follow</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elmUser}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </main>
        </>
    );
}

export default AdminHome;
