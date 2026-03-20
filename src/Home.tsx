import React from 'react'
import Sidebar from './components/Home/Sidebar'
import {SidebarItem} from './components/Home/Sidebar'
import {
    LifeBuoy,
    Receipt,
    Boxes,
    Package,
    UserCircle,
    BarChart3,
    LayoutDashboard,
    Settings
} from "lucide-react";

const Home = () => {
    return (<>
        <div className='bg-[#121212] min-h-screen px-2'>
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" alert/>
                <SidebarItem icon={<Receipt size={20}/>} text="Orders" alert/>
                <SidebarItem icon={<Boxes size={20}/>} text="Products" />
                <SidebarItem icon={<Package size={20}/>} text="Inventory" />
                <SidebarItem icon={<UserCircle size={20}/>} text="Customers" />
                <SidebarItem icon={<BarChart3 size={20}/>} text="Statistics" active />
                <hr className='my-3'/>
                <SidebarItem icon={<LifeBuoy size={20}/>} text="Support" />
                <SidebarItem icon={<Settings size={20}/>} text="Settings" />
            </Sidebar>
        </div>
    </>
    )
}

export default Home
