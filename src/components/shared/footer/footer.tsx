import React from 'react'
import { GoHeart } from "react-icons/go";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function Footer() {
  return (
    <div className='flex items-center justify-between px-6 bg-gradient-to-r from-cyan-500 to-lime-400 py-6'>
      <div>
        <GoHeart className='text-3xl text-white' />
      </div>
      <div>
        <AiOutlineExclamationCircle className='text-3xl text-white' />
      </div>
      <div>
        <IoIosNotificationsOutline className='text-3xl text-white' />
      </div>
    </div>
  )
}
