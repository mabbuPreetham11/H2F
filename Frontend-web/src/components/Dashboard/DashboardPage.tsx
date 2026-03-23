import React from 'react'
import Navbar from '../Common/Navbar'

const DashboardPage = () => {
    return (
        <div className='relative h-[130vh] w-full flex flex-col'>
            <Navbar />
            {/* Hero Section */}
            <div className='w-full h-1/12 flex items-center justify-center gap-4 p-4'>\
                {/* Title */}
                <div className='h-full w-1/3 flex items-center justify-start '>
                    <h1 className='text-3xl font-semibold text-white m-4'>ANALYTICS DASHBOARD</h1>
                </div>
                {/* Range Selector */}
                <div className='h-full w-1/3 flex items-center justify-center p-2'>
                    <div className="h-8/12 w-2/3 bg-[#0f0e10] rounded-2xl border-2 border-white flex">
                        <div className='h-full w-1/3 border-r-2 border-white flex items-center justify-center'>
                            <h1 className='text-md font-semibold text-white m-4'>7 DAYS</h1>
                        </div>
                        <div className='h-full w-1/3 border-r-2 border-white flex items-center justify-center'>
                            <h1 className='text-md font-semibold text-white m-4'>30 DAYS</h1>
                        </div>
                        <div className='h-full w-1/3 flex items-center justify-center'>
                            <h1 className='text-md font-semibold text-white m-4'>90 DAYS</h1>
                        </div>
                    </div>
                </div>
                {/* Specific Range and Domain Filter */}
                <div className='h-full w-1/3 flex items-center justify-center gap-4 p-2'>
                    <div className='h-full w-1/2 bg-[#0f0e10] flex items-center justify-center rounded-xl'>
                        <h1 className='text-2xl font-semibold text-white m-4'>SPECIFIC RANGE</h1>
                    </div>
                    <div className='h-full w-1/2 bg-[#0f0e10] flex items-center justify-center rounded-xl'>
                        <h1 className='text-2xl font-semibold text-white m-4'>DOMAIN FILTER</h1>
                    </div>
                </div>
            </div>
            {/* Basic Info */}
            <div className='w-full h-2/12 flex items-center justify-center gap-4 p-4'>
                <div className='h-full w-1/4 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>TOTAL SESSIONS</h1>
                </div>
                <div className='h-full w-1/4 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>AVERAGE DURATION</h1>
                </div>
                <div className='h-full w-1/4 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>SATISFACTION SCORE</h1>
                </div>
                <div className='h-full w-1/4 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>TOTAL REVENUE / PATIENTS</h1>
                </div>
            </div>
            {/* Sessions Per Day and Language Disctribution */}
            <div className='w-full h-6/12 flex items-center justify-center gap-4 p-4'>
                <div className='h-full w-2/3 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>SESSIONS PER DAY - GRAPH</h1>
                </div>
                <div className='h-full w-1/3 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>LANGUAGE DISTRIBUTION - PIE</h1>
                </div>
            </div>
            <div className='w-full h-6/12 flex items-center justify-center gap-4 p-4'>
                <div className='h-full w-2/4 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>SENTIMENT TREND</h1>
                </div>
                <div className='h-full w-2/4 bg-[#0f0e10] rounded-2xl'>
                    <h1 className='text-3xl font-semibold text-white m-4'>PAYMENT DISTRIBUTION / PATIENTS CONDITION</h1>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
