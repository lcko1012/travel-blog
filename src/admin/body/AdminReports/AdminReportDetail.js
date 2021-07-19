import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactHtmlParser from 'react-html-parser'
import Loading from '../../../users/utils/Loading/Loading'
import reportApis from "./enum/report-apis";
import { errorNotification, successNotification } from "../../../users/utils/notification/ToastNotification";

function AdminReportDetails() {
    const [report, setReport] = useState(false);
    const { id } = useParams();
    const [callback, setCallback] = useState(false)
    //Phải lấy bài viết vì report khong gửi về title
    const [post, setPost] = useState('')
    const [isShowSolveForm, setIsShowSolveForm] = useState(false)
    const [isShowDel, setIsShowDel] = useState(false)
    const [solvedTxt, setSolvedTxt] = useState('')

    useEffect(() => {
        const getReport = async () => {
            const res = await axios.get(reportApis.getDetailReport(id))
            if (res) {
                console.log(res.data)
                setReport(res.data);
            }
        }

        const getPost = async () => {
            if (report.reportedPost) {
                const res = await axios.get(reportApis.getPostOfReport(report.reportedPost.postId))
                if (res) {
                    setPost(res.data)
                }
            }
        }
        getReport();
        getPost()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report.reportId, callback])


    const solved = async () => {
        const decision = new FormData()
        decision.append("decision", solvedTxt)
        try {
            const res = await axios.put(reportApis.solveReport(id), decision)
            if (res) {
                successNotification('Đã giải quyết ✔')
                setIsShowSolveForm(false)
                setCallback(!callback)

            }
        } catch (error) {
            errorNotification('Đã có lỗi xảy ra 🙁')
        }
    }

    const deletePost = async () => {
        try {
            if (report.reportedPost) {
                const res = await axios.delete(reportApis.deletePost(report.reportedPost.postId))
                if (res) {
                    successNotification('Đã xóa bài viết ✔')

                }
                setIsShowDel(false)
                setCallback(!callback)
            }
        } catch (error) {
            if (error.response.status === 404) {
                errorNotification('Bài viết không tồn tại 🙁')
            }
            else {
                errorNotification('Đã có lỗi xảy ra 🙁')
            }

        }

    }

    const handleChangeInput = (e) => {
        const { value } = e.target
        setSolvedTxt(value)
    }

    const showDelAlert = () => {
        return (
            <div className="post__alert post__alert--delete ">
                <h5>Lưu ý</h5>
                <p>Thao tác này sẽ xóa hết dữ liệu bài viết</p>
                <div>
                    <button className="post__delAlert--button post__delAlert--cancel"
                        onClick={() => setIsShowDel(false)}
                    >
                        Hủy
                    </button>
                    <button className="post__delAlert--button post__delAlert--delete"
                        onClick={deletePost}
                    >
                        Xóa bài
                    </button>
                </div>
            </div>
        )
    }

    const showSolveForm = () => {
        return (
            <div className="post__alert post__alert--solve">
                <h5>Giải quyết</h5>
                <textarea
                    onChange={handleChangeInput}
                    name="reportTxt" className="post__reportContent" placeholder="Nội dung giải quyết" />
                <div>
                    <button className="post__delAlert--button post__delAlert--cancel"
                        onClick={() => setIsShowSolveForm(false)}
                    >
                        Hủy
                    </button>
                    <button className="post__delAlert--button post__alert--solvebtn"
                        onClick={solved}
                    >
                        Giải quyết
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            {report ?
                <div className="">
                    {isShowDel && showDelAlert()}
                    {isShowSolveForm && showSolveForm()}
                    <div className="right-panel">
                        <div className="post-list">
                            <div className="admin__favoriteposts--title">
                                <h2 className="list-name">Chi tiết báo cáo</h2>
                                <h5 className="web-name">LangThang.com</h5>
                            </div>

                            <div className="post-table">
                                <div className="group-button mt-10">
                                    <Link to="/admin/reports" className="btn btn-primary">
                                        <i className="far fa-long-arrow-left mr-5"></i>
                                        Trở lại
                                    </Link>
                                    <div className="action-button">
                                        <button className="btn btn-primary mr-5" disabled={report.solved} onClick={() => setIsShowSolveForm(true)}>
                                            {report.solved ?
                                                <>
                                                    <i className="far fa-check mr-5"></i>
                                                    Đã giải quyết
                                                </> : "Giải quyết"
                                            }

                                        </button>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-6" style={{ borderRight: '1px solid' }}>
                                        <div>
                                            <h5 className="report-title">ID báo cáo</h5>
                                            <h6 className="report-content">{report.reportId}</h6>
                                        </div>

                                        <div>
                                            <h5 className="report-title">ID bài viết</h5>
                                            <h6 className="report-content">{report.reportedPost ? report.reportedPost.postId : "Không tồn tại"}</h6>
                                        </div>

                                        <div>
                                            <h5 className="report-title">Tên bài viết</h5>
                                            <h6 className="report-content">
                                                {report.reportedPost ?
                                                    <Link to={`/posts/${post.slug}`}>
                                                        {ReactHtmlParser(post.title)}
                                                    </Link> : "Không tồn tại"}

                                            </h6>
                                        </div>

                                        <div>
                                            <h5 className="report-title">Nội dung báo cáo</h5>
                                            <h6 className="report-content">{report.reportContent}</h6>
                                        </div>

                                        <div>
                                            <h5 className="report-title">Ngày báo cáo</h5>
                                            <h6 className="report-content">{new Date(report.reportDate).toLocaleString()}</h6>
                                        </div>
                                    </div>

                                    {/* <div className="col-lg-1">
                            <div className="vl"></div>
                        </div> */}

                                    <div className="col-lg-6">
                                        <div>
                                            <h5 className="report-title">Tình trạng</h5>
                                            <h6 className="report-content">{report.solved ? report.decision : "Chưa xử lý"}</h6>
                                        </div>
                                        <div>
                                            <h5 className="report-title"> ID người báo cáo</h5>
                                            <h6 className="report-content">{report ? report.reporter.accountId : ""}</h6>
                                        </div>
                                        <div>
                                            <h5 className="report-title"> Người báo cáo</h5>
                                            <h6 className="report-content">{report ? report.reporter.name : ""}</h6>
                                        </div>
                                        <div>
                                            <h5 className="report-title"> Xóa bài viết</h5>
                                            {/* Nếu đã solved thì không xóa được nữa */}
                                            {report.solved || !report.reportedPost ?
                                                <button className="btn btn-danger" disabled={true}>
                                                    <i className="fal fa-minus-circle mr-5"></i>
                                                    Đã giải quyết
                                                </button> :

                                                <button className="btn btn-danger" onClick={() => setIsShowDel(true)}>
                                                    <i className="fal fa-minus-circle mr-5"></i>
                                                    Xóa
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <Loading />
            }
        </>

    );
}

export default AdminReportDetails;