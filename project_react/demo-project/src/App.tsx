import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import LogIn from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Sidebar from "./components/Sidebar";
import Display from "./components/Display";
import BottomNavigation from "./components/BottomNavigation";
import { useAuth } from "./hooks/useAuth";
import Loading from "./components/Loading";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Tasks from "./pages/Tasks";
import useIsMobile from "./hooks/useIsMobile";
import Schedule from "./pages/Schedule";

const App = () => {
  const location = useLocation();
  const { loading } = useAuth(); 
  const isMobile = useIsMobile();

  const hiddenGlobalUIRoutes = ["/login", "/signup"];
  const shouldHideGlobalUI = hiddenGlobalUIRoutes.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen bg-[#212121] overflow-hidden">
      <Routes>
        <Route
          path="/*"
          element={
            <div className="h-[90%] flex">
              {!isMobile && (
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              )}
              <div className={!isMobile ? "flex-1 ml-[20%]" : "flex-1"}>
                <Display />
              </div>
            </div>
          }
        />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/schedule" element = {<Schedule/>}/>
      </Routes>

      {!shouldHideGlobalUI && isMobile && <BottomNavigation />}
    </div>
  );
};

export default App;