import Sidebar from "./components/Common/Sidebar"
import UserProfilePage from "./components/UserProfile/UserProfilePage"
import VoiceRecordingPage from "./components/VoiceRecording/VoiceRecordingPage"

const UserProfile = () => {
    return (
        <div className="bg-[#0a0a0a] min-h-screen px-2 flex">
            <Sidebar />
            <UserProfilePage />
        </div>
    )
}

export default UserProfile
