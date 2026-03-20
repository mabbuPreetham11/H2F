import React from 'react'
import Sidebar from "./Sidebar"
import Tempnav from './Tempnav'

const Body = () => {
    return (
        <div className='flex'>
            <Sidebar />
            <Tempnav />
        </div>
    )
}

export default Body
