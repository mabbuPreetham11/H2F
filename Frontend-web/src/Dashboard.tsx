import Sidebar from "./components/Common/Sidebar"
import DashboardPage from "./components/Dashboard/DashboardPage"


const Dashboard = () => {
    return (
        <div className="bg-[#0a0a0a] min-h-screen px-2 flex">
            <Sidebar />
            <DashboardPage />
        </div>
    )
}

export default Dashboard
