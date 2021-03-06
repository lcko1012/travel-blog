import React, { useRef, useState } from 'react'
import { EditorState, RichUtils } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from 'draft-js-import-html';
import axios from 'axios';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import ReactHtmlParser from 'react-html-parser'
import newpostApis from './enum/newpost-apis';
import { errorNotification, successNotification } from '../../utils/notification/ToastNotification';
import image from '../../../asset/editor-imgs/image.svg'
import { isImgFormat, isImgSize } from '../../utils/validation/Validation';
import { useSelector } from 'react-redux';


function NewPosts() {
  const params = useParams()
  const history = useHistory()
  const initialState = {
    title: '',
    postThumbnail: '',
    categories: [],
  }
  const [content, setContent] = useState(EditorState.createEmpty())
  const [data, setData] = useState(initialState)
  const [post, setPost] = useState({})
  const [category, setCategory] = useState([])
  const unmounted = useRef(false)
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    const getCate = async () => {
      const res = await axios.get(newpostApis.getCategories)
      if (!unmounted.current) {
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
        var _thumbnail = ReactHtmlParser(res.data.postThumbnail)[0]
        var text = stateFromHTML(ReactHtmlParser(res.data.content)[0])
        var _content = EditorState.createWithContent(text)
        if (!unmounted.current) {
          setData({
            title: res.data.title,
            postThumbnail: _thumbnail,
            categories: [...data.categories, res.data.categories[0].categoryId]
          })
          setPost(res.data)
          setContent(_content)
        }
      }
      getPost()
    }
    else {
      if (!unmounted.current) {
        setData(initialState)
        setContent(EditorState.createEmpty())
      }
    }
  }, [params.slug])

  useEffect(() => {
    return () => {
      unmounted.current = true
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
      // if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      //   return errorNotification("Sai ?????nh d???ng")
      // }
      if(!isImgFormat(file)) return errorNotification("Sai ?????nh d???ng")

      // if(file.size >= 1024*1024*2){
      //   return errorNotification("Dung l?????ng ???nh ph???i nh??? h??n 2MB")
      // } // 2mb

      if(!isImgSize(file)) return errorNotification("Dung l?????ng ???nh ph???i nh??? h??n 2MB")


      var formImage = new FormData()
      formImage.append('upload', file)

      const res = await axios.post(newpostApis.uploadImg, formImage)

      if (res) {
        setData({ ...data, postThumbnail: res.data.url })
      }
    } catch (error) {
      if(error.response.status === 413) {
        errorNotification("Dung l?????ng ???nh ph???i nh??? h??n 2MB")
      }
      else errorNotification("???? x???y ra l???i")
    }
  }

  const onEditorChange = (editorState) => {
    setContent(editorState)
  }

  function uploadImageCallBack(file) {
    return new Promise(async (resolve, reject) => {
      if(!isImgFormat(file)) return reject(errorNotification("Sai ?????nh d???ng"))
      
      if(!isImgSize(file)) return reject(errorNotification("Dung l?????ng ???nh ph???i nh??? h??n 2MB"))
      
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
        if(e.response.status === 413) {
          reject(errorNotification("Dung l?????ng ???nh ph???i nh??? h??n 2MB"))
        }
        reject(e)
      }
    })
  }

  const checkError = () => {
    if (!data.title) {
      return errorNotification('H??y nh???p ti??u ????? b??i vi???t')
    }
    
    if(data.title.length > 200) {
      return errorNotification('H??y nh???p ti??u ????? c?? ????? d??i ??t h??n 200 k?? t???')
    }

    if (!data.postThumbnail) {
      return errorNotification('H??y th??m ???nh b??a b??i vi???t')
    }

    if (!content.getCurrentContent().getPlainText().trim()) {
      return errorNotification('H??y nh???p n???i dung b??i vi???t')
    }

    if (data.categories.length === 0) {
      return errorNotification('H??y ch???n th??? lo???i b??i vi???t')
    }
    return true
  }

  const handleSubmitPost = (e) => {
    e.preventDefault()
    const _checkError = checkError()

    if (_checkError === true) {
      console.log("submit")
      var formPost = new FormData()
      formPost.append("title", data.title)
      formPost.append("content", stateToHTML(content.getCurrentContent()))
      formPost.append("postThumbnail", data.postThumbnail)
      formPost.append("categories", data.categories)

      const postPost = async () => {
        try {
          const res = await axios.post(newpostApis.savePost, formPost)
          if (res) {
            successNotification('????ng b??i th??nh c??ng ????')
            history.push(`/posts/${res.data.slug}`)
          }
        } catch (error) {
          errorNotification("Kh??ng th??? ????ng b??i vi???t")
        }
      }
      postPost()
    }


  }

  const handleEditPost = (e) => {
    e.preventDefault()
    const _checkError = checkError()
    if (_checkError === true) {
      const editPost = async () => {
        var formPost = new FormData()
        formPost.append("title", data.title)
        formPost.append("content", stateToHTML(content.getCurrentContent()))

        formPost.append("postThumbnail", data.postThumbnail)
        formPost.append("categories", data.categories)
        try {
          const res = await axios.put(newpostApis.updatePost(post.postId), formPost)
          if (res) {
            successNotification('S???a b??i vi???t th??nh c??ng ????')
            history.push(`/posts/${res.data.slug}`)
          }
        } catch (error) {
          errorNotification("Kh??ng th??? ch???nh s???a b??i vi???t")
        }
      }
      editPost()
    }
  }

  const handleSubmitDraft = (e) => {
    e.preventDefault()
    const _checkError = checkError()
    if (_checkError === true) {
      var formDraft = new FormData()
      formDraft.append("title", data.title)
      formDraft.append("content", stateToHTML(content.getCurrentContent()))
      formDraft.append("postThumbnail", data.postThumbnail)
      formDraft.append("categories", data.categories)

      const postDraft = async () => {
        try {
          const res = await axios.post(newpostApis.saveDraft, formDraft)
          if (res) {
            successNotification('???? l??u l???i b???n nh??p ???')
            history.push(`/profile/${auth.user.accountId}`)
          }
        } catch (error) {
          errorNotification("Kh??ng th??? l??u b???n nh??p")
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
    formDraft.append("content", stateToHTML(content.getCurrentContent()))

    formDraft.append("postThumbnail", data.postThumbnail)
    formDraft.append("categories", data.categories)

    try {
      const res = await axios.put(newpostApis.updateDraft(post.postId), formDraft)
      if (res) {
        successNotification('???? l??u th??nh b???n nh??p')
        history.push(`/profile/${auth.user.accountId}`)
      }
    } catch (error) {
      errorNotification("Kh??ng th??? l??u b???n nh??p")
    }
  }

  return (
    <main className="main__home">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <input className="newpost__input mt-30"
              type="text"
              placeholder="T???a ????? hay g??y ???n t?????ng cho ng?????i ?????c"
              onChange={handleChange} value={data.title} name="title"
            />

            <label className="newpost__thumnail-btn">
              <i className="fa fa-image"></i>
              <input type="file" style={{ display: 'none' }} name="postThumbnail"
                onChange={(e) => handleChangeAvatar(e)}
              />

              {data.postThumbnail ? data.postThumbnail : 'Ch???n ???nh b??a cho b??i vi???t c???a b???n'}
            </label>

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
                list: { options: ['ordered']},
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
            <p className="mt-10">B??i vi???t c???a b???n thu???c th??? lo???i: </p>

            <select className="mt-10 mb-15 newpost__option" onChange={handleChangeCate} id="categories" value={data.categories[0]} defaultValue="Ch???n th??? lo???i">
              <option value="nothing">Ch???n th??? lo???i</option>
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
                    <button className="button button-primary-no-hover mb-15" type="submit">L??u nh??p</button>
                  </form>

                  <form onSubmit={handleEditPost}>
                    <button className="button button-primary mb-15" type="submit">????ng b??i</button>
                  </form>
                </>
                :
                <>
                  <form className="mr-10" onSubmit={handleSubmitDraft}>
                    <button className="button button-primary-no-hover mb-15" type="submit">L??u nh??p</button>
                  </form>

                  <form onSubmit={handleSubmitPost} >
                    <button className="button button-primary mb-15" type="submit">????ng b??i</button>
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

