import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';


function AdminCategoryForm(props) {
    const { isAdd } = props;
    const { id, name } = useParams();

    var initialState = ""
    if (!isAdd) {
        initialState = name
    }
    const history = useHistory()
    const [category, setCategory] = useState(initialState);
    const [redirect, setRedirect] = useState(false);

    const postNewCate = async (data) => {
        try {
            const res = await axios.post("/category", data)
            if (res) {
                toast.success('Thêm mới thành công', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setCategory("")

            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi thêm mới', {
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

    const updateCate = async (data) => {
        try {
            const res = await axios.put(`/category/${id}`, data)
            if (res) {
                toast.success('Cập nhật thành công', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setCategory("")
                history.push("/admin/categories")
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật', {
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

    const onChange = (event) => {
        setCategory(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("name", category)
        if (isAdd) {
            if (category === "") {
                toast.warn('Bạn chưa nhập tên thể loại', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                postNewCate(data)
            }

        }
        else {
            if (category === "") {
                toast.warn('Bạn chưa nhập tên thể loại', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                updateCate(data)
                setRedirect(true)
            }
        }
    }

    return (
        <div className="right-panel-100vh">
        <div className="cate-form">
            
            <h1 className="form-title">{isAdd ? "Thêm mới" : "Sửa"}</h1>
            <form onSubmit={onSubmit} >
                <div className="mb-3">
                    <label className="form-label">Tên thể loại</label>
                    <input type="text" className="form-control" name="category" value={category} onChange={onChange} />
                </div>

                <div className="cate-group-button">
                    <button className="btn btn-primary mr-5" type="submit">OK</button>
                    <Link to="/admin/categories" className="btn btn-danger">Hủy</Link>
                </div>
            </form>
            </div>
        </div>
    )


}

export default AdminCategoryForm;