import './AdminCategory.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function AdminCategory() {
    const [cateList, setCateList] = useState([]);
    const [isAlertDel, setIsAlertDel] = useState(false)
    const [delId, setDelId] = useState(null)

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10
    })

    useEffect(() => {
        const getCateList = async () => {
            try {
                const res = await axios.get("/category")
                if (res) {
                    setCateList(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getCateList();
    }, [])

    useEffect(() => {
        return () => {
            setCateList([])
        }
    }, [])

    const onClickNext = () => {
        setPagination({
            ...pagination,
            page: pagination.page + 1
        })
    }

    const onClickPrev = () => {
        setPagination({
            ...pagination,
            page: pagination.page - 1
        })
    }

    const onDelete = async () => {
        if(delId !== null){
            try {
                const res =  await axios.delete(`/category/${delId}`)
                if(res){
                    var newArr = cateList.filter((cate) => 
                    cate.categoryId !== delId
                    )
                    setCateList(newArr)
                    toast.success('Xóa thành công', {
                        position: "bottom-left",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setDelId(null)
                    setIsAlertDel(false)

                }
            } catch (error) {
                toast.error('Không thể xóa được', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsAlertDel(false)
                setDelId(null)
            }
        }
        
    }

    const handleShowAlertDel = (value, id) => {
        setIsAlertDel(value)
        setDelId(id)
    }

    const showAlertDel = () => {
        return(
            <div className="post__alert post__alert--delete ">
        <h5>Lưu ý</h5>
        <p>Bạn có muốn xóa thể loại này không?</p>
        <div>
          <button className="post__delAlert--button post__delAlert--cancel"
            onClick={() => setIsAlertDel(false)}
          >
            Hủy
          </button>
          <button className="post__delAlert--button post__delAlert--delete"
            onClick={onDelete}
          >
            Xóa 
          </button>
        </div>
      </div>
        )
    }

    var tmpMaxPage = cateList.length / pagination.size;
    if ((cateList.length) % (pagination.size) !== 0) {
        tmpMaxPage = tmpMaxPage + 1
    }
    const maxPage = parseInt(tmpMaxPage);


    const elmCate = cateList.slice(pagination.size * (pagination.page - 1), pagination.size * (pagination.page - 1) + pagination.size).map((cate, index) => {
        var to = "/admin/categoriesUpdate/" + String(cate.categoryId) + "/" + cate.categoryName;
        return (
            <tr key={cate.categoryId}>
                <th scope="row">{index + 1 + (pagination.page - 1) * pagination.size}</th>
                <td>{cate.categoryName}</td>
                <td className="text-center">{cate.postCount}</td>
                <td className="text-center">
                    <Link to={to} className="btn btn-warning">
                        <i className="fal fa-edit mr-5"></i>
                        Sửa
                    </Link>
                </td>
                <td className="text-center">
                    <button className="btn btn-danger" onClick={() => handleShowAlertDel(true,cate.categoryId)}>
                        <i className="far fa-trash-alt mr-5"></i>
                        Xóa
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <div className="">
            {isAlertDel && showAlertDel()}
            <div className="right-panel">

                <div className="post-list">
                <div className="admin__favoriteposts--title">
                    <h2 className="list-name">Danh sách thể loại</h2>
                    <h5 className="web-name">LangThang.com</h5>
                    </div>
                    <div className="post-table">
                        <Link to="/admin/categoriesAdd" className="btn btn-primary right-align mb-10">
                            <i className="far fa-plus mr-5"></i>
                            Thêm mới
                        </Link>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên thể loại</th>
                                    <th scope="col" className="text-center">Số lượng bài viết</th>
                                    <th scope="col" className="text-center">Sửa</th>
                                    <th scope="col" className="text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elmCate}
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className="admin__pagination">
                    <button className="btn btn-secondary mr-10" disabled={pagination.page === 1} onClick={onClickPrev}>
                        <i className="far fa-chevron-double-left mr-5"></i>
                        Prev
                    </button>
                    <button className="btn btn-secondary " disabled={true}>{pagination.page}</button>
                    <button className="btn btn-secondary ml-10" disabled={pagination.page === maxPage} onClick={onClickNext}>
                        Next
                        <i className="far fa-chevron-double-right ml-5"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminCategory;