import React from 'react'
import main_logo from '../assets/logo.svg'

function Navbar() {
  return (
    <>
      {/* Navbar left part image and title transprent background fixed*/}
      <header className='sticky top-0 z-50 w-full backdrop-blur-md bg-white/80'>
        <div className='flex items-center text-center max-w-[1200px] mx-auto py-5 justify-center'>
          <div className='flex items-center text-center gap-2'>
            <img className='w-11 h-11' src={main_logo} alt="Logo" />
            <p className='text-[#0da5a3] font-bold text-2xl tracking-tight'>Arogya</p>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
