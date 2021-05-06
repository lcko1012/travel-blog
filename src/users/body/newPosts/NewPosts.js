import React, { Component, useState } from 'react'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ReactHtmlParser from 'react-html-parser'
import HtmlParser from 'react-html-parser';

function NewPosts() {

    const [data, setData] = useState({
        title: '',
        content: ''
    })

    const handleChange = (e) => {
        const target = e.target
        const {name, value} = target
        setData({
            ...data,
            [name]: value
        })
        console.log(data)
    }

    const handleEditorChange = (e, editor) => {
        const dataEditor = editor.getData()
        setData({
            ...data,
            content: dataEditor
        })
        console.log(data)
    }

    return (
        <div className="container newpost">
            <input type="text" placeholder="Tựa đề hay gây ấn tượng cho người đọc" onChange={handleChange} value={data.title} name="title"/>
            <CKEditor
                editor={ClassicEditor}
                
                // onReady={editor => {
                //     // You can store the "editor" and use when it is needed.
                //     console.log('Hay viet gi do', editor);
                // }}
                onChange={handleEditorChange}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
                config={{
                    removePlugins: ['MediaEmbed', 'BlockQuote', 'Table'],
                }
                }
            />
            <div style={{textAlign: 'right'}}>
                <button type="submit">Đăng bài</button>
            </div>
            {
                HtmlParser(data.content)
            }
        </div>
    )
}

export default NewPosts;

