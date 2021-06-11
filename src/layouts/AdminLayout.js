import React from 'react'
import Footer from '../users/footer/Footer'

const AdminLayout = ({children}) => {
    return (
        <>
        {children}
        <Footer />
        </>
    )
}

export default AdminLayout
