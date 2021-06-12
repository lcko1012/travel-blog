import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import ReactHtmlParser from 'react-html-parser'

function AdminReportDetails() {
    const [report, setReport] = useState(false);
    const { id } = useParams();
    const [callback, setCallback] = useState(false)
    //Phải lấy bài viết vì report khong gửi về title
    const [post, setPost] = useState('')

    useEffect(() => {
        const getReport = async () => {
            try {
                const res = await axios.get(`/report/${id}`)
                if (res) {
                    setReport(res.data);
                    console.log(res.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        const getPost = async () => {
            if(report){
                try {
                    const res = await axios.get(`/post/${report.reportPostId}`)
                    if(res){
                        setPost(res.data)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getReport();
        getPost()
    }, [report.reportId ,callback])

    const decision = new FormData()
    decision.append("decision", "Đã giải quyết")
    const solved = async () => {
        try {
            const res = await axios.put(`/report/${id}`, decision)
            if (res) {
                toast.success('Đã giải quyết', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setCallback(!callback)
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra', {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    return (
        <div className="">
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
                                {/* <button className="btn btn-secondary mr-5" disabled={report.solved}>
                                    <i className="fal fa-paper-plane mr-5"></i>
                                    Gửi thông báo
                                </button> */}
                                <button className="btn btn-secondary mr-5" disabled={report.solved} onClick={solved}>
                                    <i className="far fa-check mr-5"></i>
                                    Đã giải quyết
                                </button>
                                {/* <button className="btn btn-secondary">
                                    <i className="fal fa-eye-slash mr-5"></i>
                                    Ẩn
                                </button> */}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6" style={{borderRight: '1px solid'}}>
                                <div>
                                    <h5 className="report-title">ID báo cáo</h5>
                                    <h6 className="report-content">{report.reportId}</h6>
                                </div>
                                <div>
                                    <h5 className="report-title">ID bài viết</h5>
                                    <h6 className="report-content">{report.reportPostId}</h6>
                                </div>
                                <div>
                                    <h5 className="report-title">Tên bài viết</h5>
                                    
                                    <h6 className="report-content">
                                        <Link to={`/posts/${post.slug}`}>
                                        {ReactHtmlParser(post.title)}
                                        </Link>
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
                                    <h6 className="report-content">{report.solved ? "Đã xử lý" : "Chưa xử lý"}</h6>
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
                                    <h5 className="report-title"> ID người bị báo cáo</h5>
                                    <h6 className="report-content">{report ? report.postOwner.accountId : ""}</h6>
                                </div>
                                <div>
                                    <h5 className="report-title"> Người bị báo cáo</h5>
                                    <h6 className="report-content">{report ? report.postOwner.name : ""}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReportDetails;