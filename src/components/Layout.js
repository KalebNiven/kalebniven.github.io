import React from 'react'

function Layout({ children }) {
    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">Content Generator</span>
                </div >
            </nav >
            <div className='p-5'>{children}</div>
        </div >
    )
}

export default Layout