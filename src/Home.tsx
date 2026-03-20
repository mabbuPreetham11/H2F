import React from 'react'
import Sidebar from './components/Home/Sidebar'
import { SidebarItem } from './components/Home/Sidebar'
import {
    MessageSquareWarning,
    CirclePlus,
    History,
    Users,
    ChartPie,
    Calendar,
    LayoutDashboard,
    Settings
} from "lucide-react";
import Body from './components/Home/Body';

const Home = () => {
    return (<>
        <div className='bg-[#0a0a0a] min-h-screen px-2 flex'>
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" alert />
                <SidebarItem icon={<CirclePlus size={20} />} text="New Session" />
                <SidebarItem icon={<History size={20} />} text="Sessions" />
                <SidebarItem icon={<Users size={20} />} text="Patients/Customers" />
                <SidebarItem icon={<ChartPie size={20} />} text="Analytics" />
                <SidebarItem icon={<Calendar size={20} />} text="Schedule Calls" />
                <SidebarItem icon={<MessageSquareWarning size={20} />} text="Alerts" />
                <SidebarItem icon={<Settings size={20} />} text="Settings" />
            </Sidebar>
            <Body />
        </div>
    </>
    )
}

export default Home
