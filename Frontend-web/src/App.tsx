import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Home from './Home'
import VoiceRecording from './VoiceRecording'
import UserProfile from './UserProfile'
import ScheduledCalls from './ScheduledCalls'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/home' element={<Home />} />
                <Route path='/voice' element={<VoiceRecording />} />
                <Route path='/userprofile' element={<UserProfile />} />
                <Route path='/scheduledcalls' element={<ScheduledCalls />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
