import { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/collection', label: 'COLLECTION' },
    { to: '/about', label: 'ABOUT' },
    { to: '/contact', label: 'CONTACT' },
  ]

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (!e.target.closest('.profile-dropdown')) {
            setShowDropdown(false)
        }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
}, [])

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <nav
        className='flex items-center justify-between px-6 sm:px-12 py-5'
        style={{ borderBottom: '1px solid var(--text-faint)', background: 'var(--cream)' }}
      >
        <Link to='/'>
          <img src={assets.logo} className='w-32 sm:w-36' alt='Demure' />
        </Link>

        <ul className='hidden sm:flex gap-10'>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className='flex flex-col items-center gap-1.5 group'
              style={{ color: 'var(--text-mid)' }}
            >
              <span
                className='text-xs tracking-widest transition-colors group-hover:text-[var(--rose)]'
                style={{ letterSpacing: '0.22em' }}
              >
                {label}
              </span>
              <span
                className='w-full h-px scale-x-0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100 nav-underline'
                style={{ background: 'var(--blush-dim)', transformOrigin: 'left' }}
              />
            </NavLink>
          ))}
        </ul>

        <div className='flex items-center gap-5'>
          {/* Search */}
          <button onClick={() => { setShowSearch(true); navigate('/collection') }} className='opacity-50 hover:opacity-100 transition-opacity'>
            <img src={assets.search_icon} className='w-4' alt='Search' />
          </button>

          {/* Profile */}
          <div className='relative profile-dropdown'>
            <div className='relative'>
    <button
        onClick={() => token ? setShowDropdown(prev => !prev) : navigate('/login')}
        className='opacity-50 hover:opacity-100 transition-opacity'
    >
        <img src={assets.profile_icon} className='w-4' alt='Profile' />
    </button>
    {token && showDropdown && (
        <div className='absolute right-0 pt-4 z-50'>
            <div
                className='flex flex-col gap-3 w-40 py-4 px-5 text-xs border border-faint shadow-soft tracking-[0.08em]'
                style={{ background: 'var(--white)', color: 'var(--text-mid)' }}
            >
                <p onClick={() => { navigate('/profile'); setShowDropdown(false) }} className='cursor-pointer hover:text-[var(--rose)] transition-colors'>My Profile</p>
                <p onClick={() => { navigate('/orders'); setShowDropdown(false) }} className='cursor-pointer hover:text-[var(--rose)] transition-colors'>Orders</p>
                <p onClick={() => { logout(); setShowDropdown(false) }} className='cursor-pointer hover:text-[var(--rose)] transition-colors'>Logout</p>
            </div>
        </div>
    )}
</div>
          </div>

          {/* Cart */}
          <Link to='/cart' className='relative opacity-50 hover:opacity-100 transition-opacity'>
            <img src={assets.cart_icon} className='w-4' alt='Cart' />
            {getCartCount() > 0 && (
              <span
                className='absolute -right-2 -bottom-2 w-4 h-4 flex items-center justify-center text-[8px] font-medium rounded-full'
                style={{ background: 'var(--blush-dim)', color: 'var(--white)' }}
              >
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <button onClick={() => setVisible(true)} className='sm:hidden opacity-50 hover:opacity-100 transition-opacity'>
            <img src={assets.menu_icon} className='w-4' alt='Menu' />
          </button>
        </div>
      </nav>

      {/* ── Mobile Sidebar ── */}
      <div
        className={`fixed top-0 right-0 h-full z-50 transition-all duration-500 ${visible ? 'w-72' : 'w-0'} overflow-hidden`}
        style={{ background: 'var(--cream)', borderLeft: '1px solid var(--text-faint)' }}
      >
        <div className='flex flex-col h-full'>
          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-3 px-6 py-5 cursor-pointer'
            style={{ borderBottom: '1px solid var(--text-faint)', color: 'var(--text-soft)' }}
          >
            <img src={assets.dropdown_icon} className='h-3 rotate-180 opacity-40' alt='' />
            <span className='text-xs tracking-widest' style={{ letterSpacing: '0.25em' }}>CLOSE</span>
          </div>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setVisible(false)}
              className='py-4 px-8 text-xs transition-colors hover:text-[var(--rose)]'
              style={{
                borderBottom: '1px solid var(--text-faint)',
                color: 'var(--text-mid)',
                letterSpacing: '0.25em',
              }}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {visible && (
        <div
          className='fixed inset-0 z-40 sm:hidden'
          style={{ background: 'rgba(61,53,48,0.3)', backdropFilter: 'blur(2px)' }}
          onClick={() => setVisible(false)}
        />
      )}
    </>
  )
}

export default Navbar