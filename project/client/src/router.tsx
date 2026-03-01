import { Routes, Route, useLocation} from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "./layouts/components/Sidebar";
import Display from "./components/Display";
import Player from "./layouts/components/Player";
import BottomNavigation from "./components/BottomNavigation";

import LogIn from "./components/Auth/LogIn";
import SignUp from "./components/Auth/SignUp";
import OtpVerification from "./components/Auth/OtpVerification";
import GoogleCallback from "./components/Auth/GoogleCallback";

import Search from "./components/Search/Search";
import Library from "./components/Playlist/Library";


import ProfileLayout from "./components/Profile/ProfileLayout";
import SecuritySection from "./components/Profile/Sections/SecuritySection";

import { usePlayer } from "./context/PlayerContext";
import PlaylistDetails from "./components/Playlist/PlaylistDetails";
import AllGenres from "./components/Search/AllGenres";
import IdentitySection from "./components/Profile/Sections/IdentitySection";
import GeneralSettings from "./components/Settings/GeneralSettings";
import SettingsSection from "./components/Profile/Sections/SettingsSection";
import AccountSection from "./components/Profile/Sections/AccountSection";
import GenreSongs from "./components/Search/GenreSongs";
import ArtistProfile from "./components/Search/ArtistProfile";
import useIsMobile from "./hooks/useIsMobile";
import ApplyArtist from "./components/Profile/Sections/ApplyArtist";
import ApplicationStatus from "./components/Profile/Sections/ApplicationStatus";

const hiddenRoutes = [
  "/login",
  "/signup",
  "/settings",
  "/profile",
  "/profile/security",
  "/profile/account",
  "/verify-email",
];

const AppRouter = () => {
  const location = useLocation();
  const { audioRef, track } = usePlayer();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

 
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const hideGlobalUI = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith("/profile");

  return (
    <div className="h-screen bg-black overflow-hidden">
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/search" element={<Search />} />
        <Route path="/search/genres" element={<AllGenres />} />
        <Route path="/genre/:id" element={<GenreSongs />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/library" element={<Library />} />
        
        <Route path="/playlist/:id" element={<PlaylistDetails />} />

        <Route path="/verify-email" element={<OtpVerification />} />
        <Route path="/auth/google" element={<GoogleCallback />} />
        <Route path="/settings" element={<GeneralSettings />} />
        <Route path="/profile" element={<ProfileLayout />}>
        <Route path="identity" element={<IdentitySection />} />
        <Route path="security" element={<SecuritySection />} />
        <Route path="account" element={<AccountSection />} />
        <Route path="settings" element={<SettingsSection />} />
        <Route path="apply" element={<ApplyArtist />} />
        <Route path="artist-status" element={<ApplicationStatus />} />

        </Route>
        <Route
          path="/*"
          element={
            <div className="h-[90%] flex relative">
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              />
              <Display isSidebarOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen(true)} />
            </div>
          }
        />
      </Routes>

      {!hideGlobalUI && (
        <>
          <div className="md:hidden">
            <BottomNavigation />
          </div>
          <Player />
          {track && (
            <audio
              ref={audioRef}
              src={track.audioUrl}
              key={track.id}
              preload="auto"
            />
          )}
        </>
      )}
    </div>
  );
};

export default AppRouter;
