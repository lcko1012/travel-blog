import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrMsg80, showSuccessMsg80 } from '../../utils/notification/Notification'
import ReactHtmlParser from 'react-html-parser'
import PassPage from './components/PassPage'


const EditProfile = () => {
    const initialState = {
        name: '',
        avatarLink: '',
        fbLink: '',
        instagramLink: '',
        about: '',
        err: '',
        success: '',
    }
    const auth = useSelector(state => state.auth)
    const userInfor = auth.user
    const [newInfor, setNewInfor] = useState(initialState)
    const [newAvatar, setNewAvatar] = useState(false)
    //Display false: hien thi trang sua thong tin
    //Display true: hien thi trang sua mat khau
    const [display, setDisplay] = useState(false)
    useEffect(() => {
        setNewInfor({
            ...newInfor,
            name: userInfor.name,
            avatarLink: userInfor.avatarLink,
            about: userInfor.about ? userInfor.about : '',
            instagramLink: userInfor.instagramLink ? userInfor.instagramLink : '',
            fbLink: userInfor.fbLink ? userInfor.fbLink : ''
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfor])

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setNewInfor({ ...newInfor, [name]: value })
        console.log(newAvatar)
    }

    const handleChangeAvatar = async (e) => {
        e.preventDefault()
        try {
            const token = Cookies.get('token')
            const file = e.target.files[0]

            if (!file) {
                return setNewInfor
            }

            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                // return setData({ ...data, err: "File format is incorrect", success: '' })
                console.log("sai dinh dang")
            }
            console.log(e.target.files[0])

            var formImage = new FormData()
            formImage.append('upload', file)

            const res = await axios.post('/upload', formImage, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res) {
                console.log(res)
                setNewAvatar(res.data.url)
            }
        } catch (error) {
            setNewInfor({ ...newInfor, err: "Đã xảy ra lỗi", success: '' })
        }
    }

    const handleSubmitInfor = async (e) => {
        e.preventDefault()
        console.log("submit")
        try {
            const token = Cookies.get('token')
            var formInfor = new FormData()
            formInfor.append('name', newInfor.name)
            formInfor.append('avatarLink', newAvatar ? newAvatar : newInfor.avatarLink)
            formInfor.append('fbLink', newInfor.fbLink)
            formInfor.append('instagramLink', newInfor.instagramLink)
            formInfor.append('about', newInfor.about)
            const res = await axios.put('/user/update/info', formInfor, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res) {
                setNewInfor({ ...newInfor, success: 'Cập nhật thành công', err: '' })
            }
        } catch (error) {
            console.log(error)
            setNewInfor({ ...newInfor, err: "Không thể cập nhật thông tin, xin hãy thử lại sau", success: '' })
        }
    }

    const handleClickDisplay = (value) => {
        setDisplay(value)
        setNewInfor({...newInfor, err: '', success:''})
    }


    return (
        <div className="main__home">
            <div className="container">
                <div className="row pd-50">
                    <div className="col-lg-4 mt-50">
                        <div className="editProfile__choice">
                            <button type="button" className={!display ? 'active' : null}
                            onClick={() => handleClickDisplay(false)}>Thông tin</button>
                            <button type="button" className={display ? 'active' : null}
                            onClick={() => handleClickDisplay(true)}>Mật khẩu</button>
                        </div>
                    </div>
                    <div className="col-lg-8 mt-50 mb-50">
                        {newInfor.err && showErrMsg80(newInfor.err)}
                        {newInfor.success && showSuccessMsg80(newInfor.success)}
                        {display ? <PassPage />
                        :
                            <form style={{ display: 'flex', flexDirection: 'column' }}
                                onSubmit={handleSubmitInfor}>
                                
                                <div className="editProfile__field" >
                                    <p>Ảnh đại diện</p>
                                    <div className="editProfile__avatar">
                                        <img src={newAvatar ? newAvatar : userInfor.avatarLink} />
                                        <span>
                                            <i className="fas fa-camera"></i>
                                            <input type="file" name="file" id="file_up" onChange={(e) => handleChangeAvatar(e)} />
                                        </span>
                                    </div>

                                </div>
                                <div className="editProfile__field">
                                    <p>Tên</p>
                                    <div >
                                        <i className="fas fa-user"></i>
                                        <input type="text"
                                            value={newInfor.name}
                                            name="name"
                                            onChange={handleChangeInput}
                                        ></input>
                                    </div>
                                </div>
                                <div className="editProfile__field">
                                    <p>Link Facebook</p>
                                    <div>
                                        <i className="fab fa-facebook-f "></i>
                                        <input type="text"
                                            value={newInfor.fbLink}
                                            name="fbLink"
                                            onChange={handleChangeInput}
                                        ></input>
                                    </div>

                                </div>
                                <div className="editProfile__field">
                                    <p>Link Instagram</p>
                                    <div>
                                        <i className="fab fa-instagram"></i>
                                        <input type="text"
                                            value={newInfor.instagramLink}
                                            name="instagramLink"
                                            onChange={handleChangeInput}
                                        ></input>
                                    </div>

                                </div>

                                <div className="editProfile__field">
                                    <p>Mô tả về bạn</p>
                                    <textarea
                                        name="about"
                                        onChange={handleChangeInput}
                                        value={ReactHtmlParser(newInfor.about)}
                                    ></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="editProfile__submitBtn" > 
                                    <i className="fal fa-save" style={{marginRight: '5px'}}></i>
                                    Lưu</button>
                                </div>
                            </form>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
