import React from 'react'
import { Link } from 'react-router-dom'

function Categories({ categories }) {
    return (
        <div className='post__category-area'>
            {
                categories.map((item) => {
                    return (
                        <Link to={{ pathname: `/category/${item.categoryId}` }} key={item.categoryId}>
                            <div className="post__category"
                                key={item.categoryId}>
                                    #{item.categoryName}
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default Categories
