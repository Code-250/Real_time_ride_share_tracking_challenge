"use client"

import React, { useState, useEffect } from 'react';
interface BusMapProps {

}

const Indicator: React.FC<BusMapProps> = () => {

  return (
    <div className='p-4 w-full md:w-[350px] border-2 absolute top-0 md:top-4 right-0 md:right-6 z-50 bg-white h-fit'>
      <div className='font-bold text-2xl py-2 px-4'>Nyabugogo - Kimironko</div>
      <div className='text-md px-4 py-2'>Next Stop: Kacyiru Bus Park</div>
      <div className='flex text-md justify-between px-4'>
        <div>Distance: 23 km</div>
        <div>Time: 23 minutes</div>
      </div>
    </div>
  );
};

export default Indicator;
