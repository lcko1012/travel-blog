import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from 'draft-js-import-html';
import axios from 'axios';
import { useEffect } from 'react';
import { showErrMsg } from '../../utils/notification/Notification';
import { useHistory, useParams } from 'react-router';
import ReactHtmlParser from 'react-html-parser'



function NewPosts() {
  const params = useParams()
  const history = useHistory()
  const initialState = {
    title: '',
    content: EditorState.createEmpty(),
    postThumbnail: '',
    categories: [],
    err: '',
    success: ''
  }
  const [data, setData] = useState(initialState)

  const [post, setPost] = useState({})
  const [category, setCategory] = useState([])
  const [selectedCate, setSelectedCate] = useState([])

  useEffect(() => {
    const getCate = async () => {
      const res = await axios.get('/category')
      if (res) {
        setCategory(res.data)
      }
    }
    getCate()
  }, [])

  useEffect(() => {
    if (params.slug) {
      console.log(params.slug)
      const getPost = async () => {
        try {
          const token = Cookies.get('token')

          const res = await axios.get(`/post`, {
            params: {
              slug: params.slug
            },
            headers: { Authorization: `Bearer ${token}` }
          })

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
        } catch (err) {
          console.log(err)
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


console.log(data)

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
    var id = e.target.value
    var cate = []
    cate.push(parseInt(id))
    setData({ ...data, categories: cate })
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
        setData({ ...data, postThumbnail: res.data.url })
      }
    } catch (error) {
      console.log(error)
      setData({ ...data, err: "Đã xảy ra lỗi", success: '' })

    }
  }

  const onEditorChange = (editorState) => {
    setData({ ...data, content: editorState })
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

  const handleSubmitPost = (e) => {
    e.preventDefault()
    if (!data.title) {
      return setData({ ...data, err: 'Hãy nhập tiêu đề bài viết', success: '' })
    }
    if (!data.postThumbnail) {
      return setData({ ...data, err: 'Hãy thêm ảnh bìa bài viết', success: '' })
    }

    if (data.categories.length === 0) {
      return setData({ ...data, err: 'Hãy chọn thể loại bài viết', success: '' })
    }

    if (!data.content.getCurrentContent().getPlainText().trim()) {
      return setData({ ...data, err: 'Hãy nhập nội dung bài viết', success: '' })
    }

    var formPost = new FormData()
    formPost.append("title", data.title)
    formPost.append("content", stateToHTML(data.content.getCurrentContent()))
    formPost.append("postThumbnail", data.postThumbnail)
    formPost.append("categories", data.categories)
    const token = Cookies.get('token')

    const postPost = async () => {
      const res = await axios.post('/post', formPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res) {
        console.log(res.data)
        // window.location.href = `/posts/${res.data.slug}`
        history.push(`/posts/${res.data.slug}`)
        
      }
    }
    postPost()
  }

  const handleEditPost = (e) => {
    e.preventDefault()
    const editPost = async () => {
      const token = Cookies.get("token")
      var formPost = new FormData()
      formPost.append("title", data.title)
      formPost.append("content", stateToHTML(data.content.getCurrentContent()))
      formPost.append("postThumbnail", data.postThumbnail)
      formPost.append("categories", data.categories)
      try {
        const res = await axios.put(`/post/${post.postId}`, formPost, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if(res) {
          // window.location.href = `/posts/${params.slug}`
          history.push('/')
        }
      } catch (error) {
        console.log(error)
      }
    }
    editPost()
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
                onChange={(e) => handleChangeAvatar(e)} />
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
                // list: { inDropdown: true },
                // textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },

                image: {
                  uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true },
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
                return (
                  <div style={{ display: 'inline-block' }} className="currentPost__cata" key={index}>{item}</div>
                )
              })}
            </div>

            <select className="mt-15 mb-15" onChange={handleChangeCate} id="categories" value={data.categories[0]}>
              {
                category.map((item, index) => {
                  return (
                    <option key={item.categoryId} id={item.categoryId} value={item.categoryId}>{item.categoryName}</option>
                  )
                })
              }

            </select>
            {data.err && showErrMsg(data.err)}
            {params.slug ?
              <form onSubmit={handleEditPost} style={{ textAlign: 'right' }}>
                <button className="newpost__submitBtn mb-15" type="submit">Sửa bài</button>
              </form>
              :
              <form onSubmit={handleSubmitPost} style={{ textAlign: 'right' }}>
                <button className="newpost__submitBtn mb-15" type="submit">Đăng bài</button>
              </form>
            }


            {/* {stateToHTML(data.content.getCurrentContent())} */}
          </div>
        </div>

      </div>
    </main>

  )
}

export default NewPosts;

