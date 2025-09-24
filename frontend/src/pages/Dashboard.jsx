import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MainContent from "../components/MainContent";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "User";

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <MainContent userName={userName} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;