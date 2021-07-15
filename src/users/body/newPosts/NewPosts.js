import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import axios from 'axios';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import ReactHtmlParser from 'react-html-parser'
import newpostApis from './enum/newpost-apis';
import { errorNotification, successNotification } from '../../utils/notification/ToastNotification';


function NewPosts() {
  const params = useParams()
  const history = useHistory()
  const initialState = {
    title: '',
    content: EditorState.createEmpty(),
    postThumbnail: '',
    categories: [],
  }
  const [data, setData] = useState(initialState)
  const [post, setPost] = useState({})
  const [category, setCategory] = useState([])

  useEffect(() => {
    const getCate = async () => {
      const res = await axios.get(newpostApis.getCategories)
      if (res) {
        setCategory(res.data)
      }
    }
    getCate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (params.slug) {
      const getPost = async () => {
        
          const res = await axios.get(newpostApis.loadPost(params.slug))
          if (res) {
            var _thumbnail = ReactHtmlParser(res.data.postThumbnail)[0]
            var _content = ReactHtmlParser(res.data.content)[0]
            setData({
              ...data, content: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(_content))),
              title: res.data.title,
              postThumbnail: _thumbnail,
              categories: [...data.categories, res.data.categories[0].categoryId]
            })
            setPost(res.data)
          }
      }
      getPost()
    }
    else {
      setData(
        initialState
      )
    }
  }, [params.slug])

  useEffect(() => {
    return () => {
      setData(initialState)
    }
  }, [])

  const handleChange = (e) => {
    const target = e.target
    const { name, value } = target
    setData({
      ...data,
      [name]: value
    })
  }

  const handleChangeCate = e => {
    // var id = e.target.selectedIndex
    if (e.target.value !== 'nothing') {
      var id = e.target.value
      var cate = []
      cate.push(parseInt(id))
      setData({ ...data, categories: cate })
    }
  }

  const handleChangeAvatar = async (e) => {
    e.preventDefault()
    try {
      const file = e.target.files[0]
      if (!file) {
        return
      }

      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return errorNotification("Sai định dạng")
      }
      var formImage = new FormData()
      formImage.append('upload', file)

      const res = await axios.post(newpostApis.uploadImg, formImage)

      if (res) {
        setData({ ...data, postThumbnail: res.data.url})
      }
    } catch (error) {
      errorNotification("Đã xảy ra lỗi")
    }
  }

  const onEditorChange = (editorState) => {
    setData({ ...data, content: editorState })
  }

  function uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', newpostApis.uploadImg);
        const token = Cookies.get("token")
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        const data = new FormData();
        data.append('upload', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve({
            data: {
              link: response.url
            }
          });
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  const checkError = () => {
    if (!data.title) {
      return errorNotification('Hãy nhập tiêu đề bài viết')
    }
    if (!data.postThumbnail) {
      return errorNotification('Hãy thêm ảnh bìa bài viết')
    }

    if (!data.content.getCurrentContent().getPlainText().trim()) {
      return errorNotification('Hãy nhập nội dung bài viết')
    }

    if (data.categories.length === 0) {
      return errorNotification('Hãy chọn thể loại bài viết')
    }
    return true
  }

  const handleSubmitPost = (e) => {
    e.preventDefault()
    const _checkError = checkError()

    if(_checkError === true) {
      console.log("submit")
      var formPost = new FormData()
      formPost.append("title", data.title)
      formPost.append("content", stateToHTML(data.content.getCurrentContent()))
      formPost.append("postThumbnail", data.postThumbnail)
      formPost.append("categories", data.categories)

      const postPost = async () => {
        try {
          const res = await axios.post(newpostApis.savePost, formPost)
          if (res) {
            successNotification('Đăng bài thành công 🎉')
            history.push(`/posts/${res.data.slug}`)
          }
        } catch (error) {
          errorNotification("Không thể đăng bài viết")
        }
      }
      postPost()
    }

    
  }

  const handleEditPost = (e) => {
    e.preventDefault()
    const _checkError = checkError()
    if(_checkError === true) {
      const editPost = async () => {
        var formPost = new FormData()
        formPost.append("title", data.title)
        formPost.append("content", stateToHTML(data.content.getCurrentContent()))
        formPost.append("postThumbnail", data.postThumbnail)
        formPost.append("categories", data.categories)
        try {
          const res = await axios.put(newpostApis.updatePost(post.postId), formPost)
          if (res) {
            successNotification('Sửa bài viết thành công 🎉')
            history.push(`/posts/${res.data.slug}`)
          }
        } catch (error) {
          errorNotification("Không thể chỉnh sửa bài viết")
        }
      }
      editPost()
    } 
  }

  const handleSubmitDraft = (e) => {
    e.preventDefault()
    const _checkError = checkError()
    if(_checkError === true) {
      var formDraft = new FormData()
      formDraft.append("title", data.title)
      formDraft.append("content", stateToHTML(data.content.getCurrentContent()))
      formDraft.append("postThumbnail", data.postThumbnail)
      formDraft.append("categories", data.categories)
  
      const postDraft = async () => {
        try {
          const res = await axios.post(newpostApis.saveDraft, formDraft)
          if (res) {
            successNotification('Đã lưu lại bản nháp ✔')
            history.push('/myprofile')
  
          }
        } catch (error) {
          errorNotification("Không thể lưu bản nháp")
        }
      }
      postDraft()
    }
  }
  //Chuyen bai viet thanh ban nhap hoac sua ban nhap
  const handleEditDraft = async (e) => {
    e.preventDefault()
    var formDraft = new FormData()
    formDraft.append("title", data.title)
    formDraft.append("content", stateToHTML(data.content.getCurrentContent()))
    formDraft.append("postThumbnail", data.postThumbnail)
    formDraft.append("categories", data.categories)
    try {
      const res = await axios.put(newpostApis.updateDraft(post.postId), formDraft)
      if (res) {
        successNotification('Đã lưu thành bản nháp')
        history.push('/myprofile')
      }
    } catch (error) {
      errorNotification("Không thể lưu bản nháp")
    }
  }

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
                onChange={(e) => handleChangeAvatar(e)} 
              />

              {
                data.postThumbnail ? data.postThumbnail : 'Chọn ảnh bìa cho bài viết của bạn'
              }
            </label>

            <Editor
              editorState={data.content}
              onEditorStateChange={onEditorChange}
              toolbar={{
                options: ['inline', 'link', 'list', 'image'],
                inline: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
                image: {
                  uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true },
                  inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                  defaultSize: {
                    height: 300,
                    width: 300,
                  },
                },
              }}

            />
            <p className="mt-10">Bài viết của bạn thuộc thể loại: </p>

            <select className="mt-10 mb-15 newpost__option" onChange={handleChangeCate} id="categories" value={data.categories[0]} defaultValue="Chọn thể loại">
              <option value="nothing">Chọn thể loại</option>
              {
                category.map((item) => {
                  return (
                    <option key={item.categoryId} id={item.categoryId} value={item.categoryId}>{item.categoryName}</option>
                  )
                })
              }

            </select>

            <div className="d-flex justify-content-end mb-50">
              {params.slug ?
                <>
                  <form className="mr-10" onSubmit={handleEditDraft}>
                    <button className="newpost__submitBtn newpost__draftBtn mb-15" type="submit">Lưu nháp</button>
                  </form>

                  <form onSubmit={handleEditPost}>
                    <button className="newpost__submitBtn mb-15" type="submit">Đăng bài</button>
                  </form>
                </>
                :
                <>
                  <form className="mr-10" onSubmit={handleSubmitDraft}>
                    <button className="newpost__submitBtn newpost__draftBtn mb-15" type="submit">Lưu nháp</button>
                  </form>

                  <form onSubmit={handleSubmitPost} >
                    <button className="newpost__submitBtn mb-15" type="submit">Đăng bài</button>
                  </form>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </main>

  )
}

export default NewPosts;

