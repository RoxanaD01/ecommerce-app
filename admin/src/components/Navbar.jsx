import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <nav
      className='flex items-center justify-between px-6 sm:px-10 py-4'
      style={{ background: 'var(--white)', borderBottom: '1px solid var(--text-faint)' }}
    >
      <div className='flex items-center gap-3'>
        <img src={assets.logo} className='w-28' alt='Demure' />
        <span
          className='text-xs px-2 py-0.5 hidden sm:inline tracking-[0.15em] font-medium'
          style={{background: 'var(--blush-light)', color: 'var(--rose)'}}>
          ADMIN
        </span>
      </div>
 
      <button
        onClick={() => setToken('')}
        className='text-xs px-5 py-2 transition-colors hover:text-[var(--rose)] font-normal bg-transparent font-[DM_Sans] cursor-pointer'
        style={{ border: '1px solid var(--text-faint)', color: 'var(--text-mid)'}}>
        LOGOUT
      </button>
    </nav>
  )
}

export default Navbar
