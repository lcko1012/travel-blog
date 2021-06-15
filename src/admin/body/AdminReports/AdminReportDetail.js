import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import ReactHtmlParser from 'react-html-parser'
import Loading from '../../../users/utils/Loading/Loading'

function AdminReportDetails() {
    const [report, setReport] = useState(false);
    const { id } = useParams();
    const [callback, setCallback] = useState(false)
    //Phải lấy bài viết vì report khong gửi về title
    const [post, setPost] = useState('')
    const [isShowSolveForm, setIsShowSolveForm] = useState(false)
    const [isShowDel, setIsShowDel] = useState(false)
    const [solvedTxt, setSolvedTxt] = useState('')
    const [mailTxt, setMailTxt] =useState('')

    useEffect(() => {
        const getReport = async () => {
            try {
                const res = await axios.get(`/report/${id}`)
                if (res) {
                    console.log(res.data)
                    setReport(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        const getPost = async () => {
            if (report.reportedPost) {
                try {
                    const res = await axios.get(`/post/${report.reportedPost.postId}`)
                    if (res) {
                        setPost(res.data)
                    }
                } catch (error) {
                    console.log(error)
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
            const res = await axios.put(`/report/${id}`, decision)
            if (res) {
                toast.success('Đã giải quyết ✔', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsShowSolveForm(false)
                setCallback(!callback)

            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra 🙁', {
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

    const deletePost = async () => {
        // console.log(report.reportedPost.postId)
        try {
            if(report.reportedPost){
                const res = await axios.delete(`/post/${report.reportedPost.postId}`)
                if(res) {
                    toast.success('Đã xóa bài viết ✔', {
                        position: "bottom-left",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                   
                }
                setIsShowDel(false)
                setCallback(!callback)
            }
        } catch (error) {
            if(error.response.status === 404){
                toast.error('Bài viết không tồn tại 🙁', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            else {
                toast.error('Đã có lỗi xảy ra 🙁', {
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
    
    // const showSendMailForm = () => {
    //     return (
    //         <div className="post__alert post__alert--report">
    //             <h5>Gửi mail</h5>
    //             <textarea
    //                 onChange={(e) => {setMailTxt(e.target.value)}}
    //                 name="reportTxt" className="post__reportContent" placeholder="Nội dung tin nhắn" />
    //             <div>
    //                 <button className="post__delAlert--button post__delAlert--cancel"
    //                     onClick={() => setIsShowSendMailForm(false)}
    //                 >
    //                     Hủy
    //                 </button>
    //                 <button className="post__delAlert--button post__reportForm--report"
    //                     // onClick={}
    //                 >
    //                     Gửi
    //                 </button>
    //             </div>
    //         </div>
    //     )
    // }

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
                                        {/* <button className="btn btn-secondary mr-5" disabled={report.solved}>
                                <i className="fal fa-paper-plane mr-5"></i>
                                Gửi thông báo
                            </button> */}
                                        {/* <button className="btn btn-warning mr-5" onClick={() => setIsShowSendMailForm(true)}>
                                            
                                                    <i className="fal fa-envelope mr-5"></i>
                                                    Gửi cảnh cáo


                                        </button> */}
                                        <button className="btn btn-primary mr-5" disabled={report.solved} onClick={() => setIsShowSolveForm(true)}>
                                            {report.solved ?
                                                <>
                                                    <i className="far fa-check mr-5"></i>
                                                    Đã giải quyết
                                                </> : "Giải quyết"
                                            }

                                        </button>
                                        {/* <button className="btn btn-secondary">
                                <i className="fal fa-eye-slash mr-5"></i>
                                Ẩn
                            </button> */}
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
                                            {report.solved  || !report.reportedPost ? 
                                             <button className="btn btn-danger" disabled={true}>
                                             <i className="fal fa-minus-circle mr-5"></i>
                                             Đã xóa</button> :
                                                <button className="btn btn-danger" onClick={() => setIsShowDel(true)}>
                                                <i className="fal fa-minus-circle mr-5"></i>
                                                    Xóa</button> 
                                            }
                                        </div>
                                        {/* <div>
                                <h5 className="report-title"> ID người bị báo cáo</h5>
                                <h6 className="report-content">{report ? report.postOwner.accountId : ""}</h6>
                            </div>
                            <div>
                                <h5 className="report-title"> Người bị báo cáo</h5>
                                <h6 className="report-content">{report ? report.postOwner.name : ""}</h6>
                            </div>
                             */}
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