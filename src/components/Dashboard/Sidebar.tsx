import React, { useState } from 'react'
import { ChevronFirst, ChevronLast } from 'lucide-react'

const Sidebar = ({ children }: any) => {
    const [expanded, setExpanded] = useState(true);
    return (
        <aside className='h-screen w-fit border rounded-2xl'>
            <nav className='h-full flex flex-col shadow-sm'>
                <div className='p-4 pb-2 flex justify-between items-center '>
                    <img src='https://logoblox.com/logos/logo4/light.svg' className={`overflow-hidden transition-all ${expanded ? 'w-8' : 'w-0'}`} alt='logo' />
                    <button onClick={() => { setExpanded(!expanded) }} className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100'>
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

            </nav>
        </aside>
    )
}

export default Sidebar
