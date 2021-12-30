import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import GridCustom from '../../../core/components/GridCustom'
import { EditorState, RichUtils } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import image from '../../../asset/editor-imgs/image.svg'
import "./newposts.scss"
import { isImgFormat, isImgSize } from '../../utils/validation/Validation';
import { errorNotification, successNotification } from '../../utils/notification/ToastNotification';
import axios from 'axios';
import newpostApis from './enum/newpost-apis';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from 'react-html-parser'
import { useSelector } from 'react-redux';
import NewPostPreview from './NewPostPreview';


const initialPost = {
    postId: null,
    title: '',
    postThumbnail: '',
    categories: [],
}

function NewPost_v1() {
    const history = useHistory()
    const params = useParams()
    const [content, setContent] = useState(EditorState.createEmpty())
    const [post, setPost] = useState(initialPost)
    const [categoryList, setCategoryList] = useState([])
    const [isOpenCateList, setIsOpenCateList] = useState(false)
    //is open edit page
    const [isOpenEditor, setIsOpenEditor] = useState(true)

    const auth = useSelector(state => state.auth)

    useEffect(() => {
        if (params.slug) {
            const getPost = async () => {
                const res = await axios.get(newpostApis.loadPost(params.slug))
                var _thumbnail = ReactHtmlParser(res.data.postThumbnail)[0]
                var text = stateFromHTML(ReactHtmlParser(res.data.content)[0])
                var _content = EditorState.createWithContent(text)
                console.log(res.data)
                setContent(_content)
                setPost({
                    postId: res.data.postId,
                    title: res.data.title,
                    postThumbnail: _thumbnail,
                    categories: [...res.data.categories]
                })
            }
            getPost()
        }
    }, [])

    useEffect(() => {
        const getCategories = async () => {
            const res = await axios.get(newpostApis.getCategories)
            if (res) setCategoryList(res.data)
        }
        getCategories()
    }, [])

    const handleClickCancel = () => {
        history.push("/")
    }

    const handleChangeEditorPage = (value) => {
        setIsOpenEditor(value)
    }

    const onEditorChange = (editorState) => {
        setContent(editorState)
    }

    const uploadImageCallBack = (file) => {
        return new Promise(async (resolve, reject) => {
            if (!isImgFormat(file)) return reject(errorNotification("Sai định dạng"))

            if (!isImgSize(file)) return reject(errorNotification("Dung lượng ảnh phải nhỏ hơn 2MB"))

            const data = new FormData();
            data.append('upload', file);
            try {
                const res = await axios.post(newpostApis.uploadImg, data)
                resolve({
                    data: {
                        link: res.data.url
                    }
                });
            } catch (e) {
                if (e.response.status === 413) {
                    reject(errorNotification("Dung lượng ảnh phải nhỏ hơn 2MB"))
                }
                reject(e)
            }
        })
    }

    const handleChangeThumbnail = async (e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]
            if (!file) return
            if (!isImgFormat(file)) return errorNotification("Sai định dạng")
            if (!isImgSize(file)) return errorNotification("Dung lượng ảnh phải nhỏ hơn 2MB")

            var formImage = new FormData()
            formImage.append('upload', file)

            const res = await axios.post(newpostApis.uploadImg, formImage)
            if (res) {
                setPost({ ...post, postThumbnail: res.data.url })
            }
        } catch (error) {
            if (error.response.status === 413) {
                errorNotification("Dung lượng ảnh phải nhỏ hơn 2MB")
            }
            else errorNotification("Đã xảy ra lỗi")
        }
    }

    const handleChange = (e) => {
        const target = e.target
        const { name, value } = target
        setPost({
            ...post,
            [name]: value
        })
    }

    const toggleOpen = () => setIsOpenCateList(!isOpenCateList)
    const toggleCategoryClass = {
        display: isOpenCateList ? 'block' : 'none'
    }

    const handleAddToCategory = (category) => {
        //check if category is exist in categories
        const indexOfCategory = post.categories.findIndex(item => item.categoryId === category.categoryId)
        // if not exist, add to categories
        if (indexOfCategory === -1) setPost({ ...post, categories: [...post.categories, category] })

        if (post.categories.length === 5) return

        // else remove from categories
        if (indexOfCategory !== -1) setPost({ ...post, categories: post.categories.filter(item => item.categoryId !== category.categoryId) })
    }

    const checkError = () => {
        if (!post.title) {
            return errorNotification('Hãy nhập tiêu đề bài viết')
        }

        if (post.title.length > 200) {
            return errorNotification('Hãy nhập tiêu đề có độ dài ít hơn 200 ký tự')
        }

        if (!post.postThumbnail) {
            return errorNotification('Hãy thêm ảnh bìa bài viết')
        }

        if (!content.getCurrentContent().getPlainText().trim()) {
            return errorNotification('Hãy nhập nội dung bài viết')
        }

        if (post.categories.length === 0) {
            return errorNotification('Hãy chọn thể loại bài viết')
        }
        return true
    }

    const handleSubmitPost = async (e) => {
        e.preventDefault()
        const _checkError = checkError()

        if (_checkError === true) {
            console.log("submit")
            var formPost = new FormData()
            formPost.append("title", post.title)
            formPost.append("content", stateToHTML(content.getCurrentContent()))
            formPost.append("postThumbnail", post.postThumbnail)
            // Send Id of categories
            const _categories = post.categories.map(item => item.categoryId)
            formPost.append("categories", _categories)

            try {
                const res = params.slug
                    ? await axios.put(newpostApis.updatePost(post.postId), formPost)
                    : await axios.post(newpostApis.savePost, formPost)

                if (res) {
                    successNotification('Đăng bài thành công 🎉')
                    history.push(`/posts/${res.data.slug}`)
                }
            } catch (error) {
                errorNotification("Không thể đăng bài viết")
            }

        }
    }

    const handleSubmitDraft = async (e) => {
        e.preventDefault()
        const _checkError = checkError()
        if (_checkError === true) {
            var formDraft = new FormData()
            formDraft.append("title", post.title)
            formDraft.append("content", stateToHTML(content.getCurrentContent()))
            formDraft.append("postThumbnail", post.postThumbnail)
            const _categories = post.categories.map(item => item.categoryId)
            formDraft.append("categories", _categories)

            try {
                const res = params.slug
                    ? await axios.put(newpostApis.updateDraft(post.postId), formDraft)
                    : await axios.post(newpostApis.saveDraft, formDraft)

                if (res) {
                    successNotification('Đã lưu lại bản nháp ✔')
                    history.push(`/profile/${auth.user.accountId}`)
                }
            } catch (error) {
                errorNotification("Không thể lưu bản nháp")
            }
        }
    }

    const EditorPage = () => {
        return (
            <div className='new-post__center-main'>
                <div className='new-post__center-main--infor'>
                    <div className='new-post__center-main--thumbnail'>
                        {post.postThumbnail ? <img src={post.postThumbnail} alt="thumbnail" /> : null}

                        <div className='d-flex justify-content-center align-items-center'>
                            <label
                                className='btn btn-light cursor-pointer'
                            >
                                <i className="fa fa-image"></i> {post.postThumbnail ? 'Change' : 'Add a cover image'}
                                <input type="file" className='d-none' name="postThumbnail"
                                    onChange={(e) => handleChangeThumbnail(e)}
                                />
                            </label>

                            {post.postThumbnail ?
                                <button
                                    className='btn btn-light new-post__center-main--thumbnail-remove'
                                    onClick={() => setPost({ ...post, postThumbnail: '' })}
                                >Remove</button>
                                : null}
                        </div>
                    </div>

                    <input
                        className="new-post__center-main--title"
                        type="text"
                        placeholder="New post title..."
                        onChange={handleChange} value={post.title} name="title"
                    />

                    <div className='new-post__center-main--category'>
                        <label className="btn btn-light" onClick={toggleOpen}>
                            {post.categories.length > 0
                                ? post.categories.map(category => category.categoryName).join(', ')
                                : "Add up to 5 tags..."}
                        </label>

                        <ul style={toggleCategoryClass}>
                            <input placeholder='Searching tags...' />
                            {categoryList.map((category) => {
                                return (
                                    <li key={category.categoryId}
                                        className={`dropdown-item d-flex  justify-content-between align-items-center ${post.categories.find(item => item.categoryId === category.categoryId) ? 'active' : ''}`}
                                        onClick={() => handleAddToCategory(category)}
                                    >
                                        <span>
                                            {category.categoryName}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <Editor
                    editorState={content}
                    onEditorStateChange={onEditorChange}
                    handleKeyCommand={(command) => {
                        let newState = RichUtils.handleKeyCommand(content, command)
                        if (newState) {
                            onEditorChange(newState)
                            return "handled"
                        }
                        return "not-handled"
                    }}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    toolbar={{
                        options: ['inline', 'link', 'list', 'image', 'history'],
                        inline: {
                            options: ['bold', 'italic', 'underline', 'strikethrough'],
                        },
                        list: { options: ['ordered'] },
                        image: {
                            icon: image,
                            className: "new-post__eidtor--img-custom",
                            previewImage: true,
                            alignmentEnabled: false,
                            uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: false },
                            inputAccept: 'image/jpeg,image/jpg,image/png',
                            defaultSize: {
                                height: '100%',
                                width: '100%',
                            },
                        },
                    }}
                />
            </div>
        )
    }


    return (
        <div className='new-post'>
            <GridCustom mdGridTemplateColumns="10rem 1fr 10rem" mdGridColumnGap="1rem">
                <div>
                    <Link to="/">
                        <i className="fal fa-map-marker-edit mr-2" />
                        <span>Lang Thang</span>
                    </Link>
                </div>


                <div className='new-post__center'>
                    <div className='new-post__center-header'>
                        <label></label>
                        <div className='new-post__center-header--button-container'>
                            <div
                                className={isOpenEditor ? 'new-post__center-header--button-choosen' : null}
                                onClick={() => handleChangeEditorPage(true)}
                            >
                                Edit
                            </div>

                            <div
                                className={!isOpenEditor ? 'new-post__center-header--button-choosen' : null}
                                onClick={() => handleChangeEditorPage(false)}
                            >
                                Preview
                            </div>
                        </div>
                    </div>

                    {
                        isOpenEditor
                            ? EditorPage()
                            : <NewPostPreview post={post} content={content} />
                    }

                    <div className='new-post__center-btn-container'>
                        <button className='btn' onClick={handleSubmitPost}>Publish</button>
                        <button className='btn' onClick={handleSubmitDraft}>Save draft</button>
                    </div>
                </div>


                <div className='new-post__sidebar--right'>
                    <div
                        className='new-post__sidebar--right-cancel'
                        onClick={handleClickCancel}
                    >
                        <i className="fal fa-times"></i>
                    </div>
                </div>
            </GridCustom>
        </div>
    )
}

export default NewPost_v1
