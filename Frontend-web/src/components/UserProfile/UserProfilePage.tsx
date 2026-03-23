import React from 'react'
import Navbar from '../Common/Navbar'

const UserProfilePage = () => {
    const alerts = true;
    return (
        <div className='min-h-screen w-full flex flex-col'>
            <Navbar />
            <div className='w-full h-16'></div>
            <div className='h-full w-full flex flex-col items-center justify-center'>
                {/* Basic Info */}
                <div className='w-full h-2/8  flex gap-4 p-4'>
                    <div className='h-full w-1/6 bg-[#0f0e10] rounded-2xl'>
                        <h1 className='text-2xl font-semibold text-white m-4'>PROFILE IMAGE</h1>
                    </div>
                    <div className='h-full w-2/6 bg-[#0f0e10] rounded-2xl'>
                        <h1 className='text-2xl font-semibold text-white m-4'>USER INFOMARTION</h1>
                    </div>
                    <div className='h-full w-1/6'></div>
                    <div className='h-full w-1/6 rounded-2xl flex items-end justify-end'>
                        <div className='w-full h-1/3 bg-[#0f0e10] rounded-2xl'>
                            <h1 className='text-2xl font-semibold text-white m-4 text-center'>MODIFY PROFILE</h1>
                        </div>
                    </div>
                    <div className='h-full w-1/6 rounded-2xl flex items-end justify-end'>
                        <div className='w-full h-1/3 bg-[#0f0e10] rounded-2xl'>
                            <h1 className='text-2xl font-semibold text-white m-4 text-center'>INITIATE CALL</h1>
                        </div>
                    </div>
                </div>
                {/* Actual Stuff */}
                <div className='w-full h-5/8  p-4 flex flex-col gap-4'>
                    {/* Menu */}
                    <div className='w-full h-16 rounded-2xl flex items-center justify-start gap-4'>
                        <div className="h-full w-fit p-4 text-xl font-semibold text-white"><span className="border-b-4 border-white p-2">OVERVIEW</span></div>
                        <div className="h-full w-fit p-4 text-xl font-semibold text-white"><span >VISIT HISTORY</span></div>
                        <div className="h-full w-fit p-4 text-xl font-semibold text-white"><span>REPORTS</span></div>
                        <div className="relative h-full w-fit p-4 text-xl font-semibold text-white"><span>ALERTS</span>
                            {alerts && <div className='absolute h-2 w-2 rounded-full bg-teal-500 top-2 right-2'></div>}
                        </div>
                        <div className="h-full w-fit p-4 text-xl font-semibold text-white"><span>MONITERING</span></div>

                    </div>
                    {/* DETAILS SECTION */}
                    <div className='w-full h-full flex gap-4'>
                        <div className='h-full w-2/3 bg-[#0f0e10] rounded-2xl'>
                            <h1 className='text-2xl font-semibold text-white m-4'>MEDICAL SUMMARY</h1>
                        </div>
                        <div className='h-full w-1/3 bg-[#0f0e10] rounded-2xl'>
                            <h1 className='text-2xl font-semibold text-white m-4'>BILLING $ CLAIMS</h1>
                        </div>
                    </div>
                </div>
                <div className='w-full h-1/8 p-4'>
                    <div className='h-full w-full bg-[#0f0e10] rounded-2xl p-2'>
                        <h1 className='text-2xl font-semibold text-white m-4'>TIMELINE</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage
