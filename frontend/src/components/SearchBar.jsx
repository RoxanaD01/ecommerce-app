import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    // The search bar shows only when we are on the '/collection' page
    useEffect(() => {
        if(location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location])

  if (!showSearch || !visible) return null;

  return (
     <div
      className='py-5 px-6 flex items-center justify-center gap-4'
      style={{ background: 'var(--cream-deep)', borderBottom: '1px solid var(--text-faint)' }}
    >
      <div
        className='flex items-center gap-3 px-5 py-2.5 w-full sm:w-1/2'
        style={{ border: '1px solid var(--blush-dim)', background: 'var(--white)' }}
      >
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          type='text'
          placeholder='Search pieces...'
          className='flex-1 text-sm outline-none'
          style={{
            background: 'transparent',
            color: 'var(--text-dark)',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 300,
          }}
        />
        <img src={assets.search_icon} className='w-3.5 opacity-40' alt='Search' />
      </div>
 
      <button
        onClick={() => setShowSearch(false)}
        className='opacity-40 hover:opacity-80 transition-opacity'
      >
        <img src={assets.cross_icon} className='w-3' alt='Close' />
      </button>
    </div>
  ) 
}

export default SearchBar
