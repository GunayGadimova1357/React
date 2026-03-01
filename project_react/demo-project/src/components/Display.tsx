import React, { useRef } from 'react'
import { Route, Routes } from 'react-router-dom'
import DisplayHome from './DisplayHome'

const Display = () => {

    const displayRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded  text-white overflow-auto lg:w-[75%] lg:ml-0'>
        <Routes>
            <Route path='/' element={<DisplayHome/>} />
        </Routes>
    </div>
  )
}

export default Display