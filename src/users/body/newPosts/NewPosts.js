import React, { useState } from 'react'
import Cookies from 'js-cookie'
import {EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios';
import { useEffect } from 'react';
import { showErrMsg } from '../../utils/notification/Notification';


function NewPosts() {
    // console.log(ClassicEditor.builtinPlugins.map(plugin => plugin.pluginName));
    const [data, setData] = useState({
        title: '',
        content: EditorState.createEmpty(),
        postThumbnail : '',
        categories: [],
        err: '',
        success: ''
    })

    const [category, setCategory] = useState([]) 
    const [selectedCate, setSelectedCate] = useState([])

    useEffect(() => {
        const getCate = async () => {
            const res = await axios.get('/category')
            if(res){
                console.log(res)
                setCategory(res.data)
            }
        }
        getCate()
    }, [])

    const handleChange = (e) => {
        const target = e.target
        const { name, value } = target
        setData({
            ...data,
            [name]: value
        })
        // console.log(data)
    }

    const handleChangeCate = e => {
        // var id = e.target.selectedIndex
        var id = e.target.value
        var cate = []
        cate.push(parseInt(id))
        setData({...data,categories: cate})
        
        // setSelectedCate([...selectedCate, value])
        // console.log(category)
    }

    const handleChangeAvatar = async (e) => {
        e.preventDefault()
        try {
            const token = Cookies.get('token')
            const file = e.target.files[0]
            if (!file) {
                return
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
                setData({...data, postThumbnail: res.data.url})
            }
        } catch (error) {
            console.log(error)
            setData({ ...data, err: "Đã xảy ra lỗi", success: '' })
            
        }
    }

    const onEditorChange = (editorState) => {
        setData({...data, content: editorState})
    }

    function uploadImageCallBack(file) {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload');
                const token = Cookies.get("token")
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                const data = new FormData();
                data.append('upload', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    console.log(response.url)
                    resolve({
                        data: {
                            link: response.url
                        }
                    });
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    console.log(error)
                    reject(error);
                });
            }
        );
    }

    const handleSubmitPost =  (e) => {
        e.preventDefault()
        if(!data.title) {
            return setData({...data, err: 'Hãy nhập tiêu đề bài viết', success: ''})
        }
        if(!data.postThumbnail) {
            return setData({...data, err: 'Hãy thêm ảnh bìa bài viết', success: ''})
        }

        if(data.categories.length === 0) {
            return setData({...data, err: 'Hãy chọn thể loại bài viết', success: ''})
        }

        if(!data.content.getCurrentContent().getPlainText().trim()) {
            return setData({...data, err: 'Hãy nhập nội dung bài viết', success: ''})
        }

        var formPost = new FormData()
        formPost.append("title", data.title)
        formPost.append("content", stateToHTML(data.content.getCurrentContent()))
        formPost.append("postThumbnail", data.postThumbnail)
        formPost.append("categories", data.categories)
        const token = Cookies.get('token')

        const postPost = async () => {
            const res = await axios.post('/post', formPost, {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })
            if(res) {
                console.log(res.data)
                
            }
        }
        postPost()
    }

    console.log(data)
    return (
        <main className="main__home">
            <div className="container">

                <div className="row">
                    <div className="offset-lg-2 col-lg-8">
                    
                        <input className="newpost__input mt-30"
                            type="text"
                            placeholder="Tựa đề hay gây ấn tượng cho người đọc"
                            onChange={handleChange} value={data.title} name="title" />

                        <label className="newpost__thumnailBtn">
                            <i className="fa fa-image"></i>
                            <input type="file" style={{ display: 'none' }} name="postThumbnail" 
                            onChange={(e) => handleChangeAvatar(e)}/>
                            {
                               data.postThumbnail ? data.postThumbnail : 'Chọn ảnh bìa cho bài viết của bạn'
                            }
                        </label>
                        
                        <Editor 
                        editorState={data.content}
                        onEditorStateChange={onEditorChange}
                        toolbar={{
                            options:['inline', 'link', 'list', 'image' ],
                            inline: {inDropdown: true},
                            // list: { inDropdown: true },
                            // textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },

                            image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true }, 
                                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                defaultSize: {
                                height: 100,
                                width: 100,
                                }, 
                            },
                        }}

                        />
                        <p>Bài viết của bạn thuộc thể loại: (Chỉ được chon 5 thể loại) </p>
                        <div className="mt-15">
                        {selectedCate.map((item, index) => {
                            return(
                                <div style={{display:'inline-block'}} className="currentPost__cata" key={index}>{item}</div>
                            )
                        })}
                        </div>
                        
                        <select className="mt-15 mb-15" onChange={handleChangeCate} id="categories">
                            {
                                category.map((item, index) => {
                                    return(
                                        <option key={item.categoryId} id={item.categoryId} value={item.categoryId}>{item.categoryName}</option>
                                    )
                                })
                            }

                        </select>
                        {data.err && showErrMsg(data.err)}
                        <form onSubmit={handleSubmitPost} style={{ textAlign: 'right' }}>
                            <button className="newpost__submitBtn mb-15" type="submit">Đăng bài</button>
                        </form>
                        
                        
                    </div>
                </div>

            </div>
        </main>

    )
}

export default NewPosts;

