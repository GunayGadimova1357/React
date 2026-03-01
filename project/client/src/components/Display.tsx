import React, { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import { usePlayer } from "../context/PlayerContext";
import Navbar from '../layouts/components/Navbar';

interface DisplayProps {
  isSidebarOpen?: boolean;
  onMenuClick?: () => void;
}

const Display = ({ isSidebarOpen = true, onMenuClick }: DisplayProps) => {

  const displayRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  // const albumId = isAlbum ? location.pathname.slice(-1) : "";
  // const bgColor = albumsData [Number(albumId)].bgColor;
  const { track } = usePlayer();

  useEffect(() => {
    if (!displayRef.current) return;
    displayRef.current.style.background = "#121212";
  }, [location.pathname]);

  return (
    <div
      ref={displayRef}
      className={`
      flex-1 m-2 rounded bg-[#121212] text-white 
      flex flex-col h-[calc(100vh-1rem)] 
      overflow-hidden 
      transition-all duration-300 ease-out
    `}
    >
      <Navbar onMenuClick={onMenuClick} />

      <div className={`flex-1 overflow-y-auto ${track ? "pb-[100px]" : "pb-0"}`}>
        <Routes>
          <Route path='/' element={<DisplayHome />} />
          <Route path='/album/:id' element={<DisplayAlbum />} />
        </Routes>
      </div>
    </div>
  )
}

export default Display
