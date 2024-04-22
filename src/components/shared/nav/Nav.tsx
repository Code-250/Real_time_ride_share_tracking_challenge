import React from 'react'
import { IoMenu } from "react-icons/io5";

export default function Nav() {
  return (
    <div className='flex items-center justify-between px-6 bg-gradient-to-r from-cyan-400 to-lime-400 py-4'>
      <div>
        <IoMenu className='text-3xl text-white' />
      </div>
      <div className='text-2xl text-[#0f172a] font-semibold'>Startup</div>
    </div>
  )
}
