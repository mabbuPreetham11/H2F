import { useState } from "react"
import Visualizer from "./Visualizer"
import { Search, Bell, HatGlasses } from 'lucide-react'
import Navbar from "../Common/Navbar";

const VoiceRecordingPage = () => {
    const [done, setDone] = useState(false);
    return (
        <div className=" w-full bg-[#080708] min-h-screen flex flex-col">
            <Navbar />
            <div className='w-full h-full flex gap-4'>
                <div className={`h-full ${done ? "w-2/4" : "w-1/4"} bg-[#0f0e10] rounded-t-2xl`}>
                    <h1 className='font-bold text-white text-4xl p-4' style={{ fontFamily: 'syne' }}>LIVE TRANSCRIPT</h1>
                    {/* This has to be automated when the call ends , button is only for testing */}
                    <button className="bg-white text-2xl w-fit h-fit p-4 m-4 rounded-2xl font-semibold" style={{ fontFamily: 'Inter' }} onClick={() => { setDone(!done) }}>COLLAPSE</button>
                </div>
                <div className={`relative h-full w-2/4 bg-[#070807] rounded-2xl flex flex-col items-center justify-center p-4 ${done ? "hidden" : ""}`}>
                    {/* AUDIO VISUALIZER HERE */}
                    <div className=' w-full h-1/3 rounded-2xl'>
                        {/* <h1 className='font-bold text-white text-4xl p-4 flex items-center justify-center' style={{ fontFamily: 'syne' }}>AUDIO VISUALIZER</h1> */}
                        <Visualizer />
                    </div>
                    <div className='absolute bg-[#0f0e10] w-full h-2/12 bottom-0'>
                        <h1 className='font-bold text-white text-4xl p-4 flex items-center justify-center' style={{ fontFamily: 'syne' }}>CONTROLS</h1>
                    </div>
                </div>
                <div className={`h-full ${done ? "w-2/4" : "w-1/4"} bg-[#0f0e10] rounded-t-2xl`}>
                    <h1 className='font-bold text-white text-4xl p-4' style={{ fontFamily: 'syne' }}>LIVE EXTRACTION</h1>
                </div>
            </div>
        </div>
    )
}

export default VoiceRecordingPage
