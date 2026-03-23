import React from 'react'
import Sidebar from './components/Common/Sidebar'
import ScheduledCallsPage from './components/ScheduledCalls/ScheduledCallsPage'

const ScheduledCalls = () => {
    return (
        <div className="bg-[#0a0a0a] min-h-screen px-2 flex">
            {/* <Sidebar /> */}
            <ScheduledCallsPage />
        </div>
    )
}

export default ScheduledCalls
