import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactHtmlParse from "react-html-parser";
import { toast } from 'react-toastify';


function AdminUsers() {

    const [userList, setUserList] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10
    })
    //Check pagination
    // const [isDefault, setIsDefault] = useState(false)
    const [userToAdm, setUserToAdm] = useState({})

    const [isShowAlertToAdm, setIsShowAlertToAdm] = useState(false)
    useEffect(() => {
        const getUserList = async () => {
            try {
                const res = await axios.get("/system/users" ,{
                    params: {
                        page: pagination.page,
                        size: pagination.size
                    }
                })
                if (res) {
                    setUserList(res.data);
                }
        } catch (error) {
                console.log(error);
            }
        }
        getUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination])

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

    const onToAdmin = () => {
        const id = String(userToAdm.accountId)
        const toAdmin = async () => {
            try {
                const res = await axios.put(`/user/${id}/admin`)
                if (res) {
                    var newUserList = userList.filter((item) =>
                        item.accountId !== userToAdm.accountId
                    )
                    setUserList(newUserList)
                    toast.success(`${userToAdm.name} đã thành admin 🎉`, {
                        position: "bottom-left",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setUserToAdm({})
                    setIsShowAlertToAdm(false)
                }
            } catch (error) {
                if (error.response.status === 422) {
                    toast.error('Tài khoản không tồn tại hoặc chưa kích hoạt 🙁', {
                        position: "bottom-left",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setUserToAdm({})
                    setIsShowAlertToAdm(false)

                }
                else {
                    toast.error('Thảo tác không thành công', {
                        position: "bottom-left",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setUserToAdm({})
                    setIsShowAlertToAdm(false)
                }
            }
        }
        toAdmin();
    }
    const handleShowAlertToAdmin = (user) => {
        setUserToAdm(user)
        setIsShowAlertToAdm(true)
    }

    const showAlertToAdmin = () => {
        return (
            <div className="post__alert post__alert--delete ">
                <h5>Lưu ý</h5>
                <p style={{ margin: '0px 5px 10px 5px' }}>Bạn có muốn nâng {userToAdm.name} làm admin?</p>
                <div>
                    <button className="post__delAlert--button post__delAlert--cancel"
                        onClick={() => setIsShowAlertToAdm(false)}
                    >
                        Hủy
                    </button>
                    <button className="post__delAlert--button post__delAlert--delete"
                        onClick={onToAdmin}
                    >
                        Đồng ý
                    </button>
                </div>
            </div>

        )
    }



    // var tmpMaxPage = userList.length / pagination.size;
    // if ((userList.length) % (pagination.size) !== 0) {
    //     tmpMaxPage = tmpMaxPage + 1
    // }
    // const maxPage = parseInt(tmpMaxPage);

    const elmUser = userList.map((user, index) => {
        return (
            <tr key={user.accountId}>
                <th scope="row">{index + 1 + (pagination.page * pagination.size)}</th>
                <td className="">
                    <div className="user-avatar" style={{ backgroundImage: `url(${ReactHtmlParse(user.avatarLink)})` }}></div>
                </td>
                <td>{ReactHtmlParse(user.name)}</td>
                <td>{user.email}</td>
                <td className="text-center">{user.postCount}</td>
                {/* <td className="text-center">{user.commentOnOwnPostCount}</td> */}
                {/* <td className="text-center">{user.bookmarkOnOwnPostCount}</td> */}
                <td className="text-center">{user.followCount}</td>
                <td className="text-center">{user.role ? "Admin" : "User"}</td>
                <td>
                    <button 
                    style={{whiteSpace: 'nowrap', margin: 'auto'}}
                    className={user.role ? "btn btn-secondary" : "btn btn-primary"}
                        disabled={user.role}
                        onClick={() => handleShowAlertToAdmin(user)} >
                        {user.role ? "Admin" : "Cấp quyền"}
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <div className="AdminUser">
            {isShowAlertToAdm && showAlertToAdmin()}
            <div className="right-panel">
                <div className="post-list">
                <div className="admin__favoriteposts--title">
                    <h2 className="list-name">Danh sách người dùng</h2>
                    <h5 className="web-name">LangThang.com</h5>
                    </div>
                    <div className="post-table">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-center">#</th>
                                    <th scope="col" className="text-center">Người dùng</th>
                                    <th scope="col">Tên</th>
                                    <th scope="col">Email</th>
                                    <th scope="col" className="text-center">Số bài viêt</th>
                                    {/* <th scope="col" className="text-center">Số comment</th> */}
                                    {/* <th scope="col" className="text-center">Số bookmark</th> */}
                                    <th scope="col" className="text-center">Số follow</th>
                                    <th scope="col" className="text-center">Quyền hạn</th>
                                    <th scope="col" className="text-center">Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elmUser}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin__pagination">
                    <button className="btn btn-secondary mr-10" disabled={pagination.page === 0} onClick={onClickPrev}>
                        <i className="far fa-chevron-double-left mr-5"></i>
                        Prev
                    </button>
                    <button className="btn btn-secondary" disabled={true}>{pagination.page + 1}</button>
                    <button className="btn btn-secondary ml-10" disabled={userList.length < pagination.size} onClick={onClickNext}>
                        Next
                        <i className="far fa-chevron-double-right ml-5"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;