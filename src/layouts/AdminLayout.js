import React from 'react'
import Footer from '../users/footer/Footer'
import Menu from '../admin/Menu/Menu'
import Header from '../users/header/Header'

const AdminLayout = ({children}) => {
    return (
        <>
        
            <div className="row">
                <div className="col-lg-2">
                    <Menu />
                </div>
                <div className="col-lg-10">
                    {children}
                </div>
                
            </div>
            
            {/* <Footer /> */}
        </>
    )
}

export default AdminLayout
