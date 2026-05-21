import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='mt-32' style={{ borderTop: '1px solid var(--text-faint)' }}>
      <div className='grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-12 py-16 px-6 sm:px-12'>

        {/* Brand */}
        <div>
          <img src={assets.logo} className='w-28 mb-5' alt='Demure' />
          <p
            className='text-sm leading-loose max-w-xs'
            style={{ color: 'var(--text-soft)', fontWeight: 300 }}
          >
            Demure is a contemporary fashion brand dedicated to crafting timeless pieces
            that blend quality, comfort, and style. Great fashion should be accessible to everyone.
          </p>
        </div>

        {/* Company */}
        <div>
          <p
            className='mb-5 text-xs tracking-widest'
            style={{ color: 'var(--text-dark)', letterSpacing: '0.25em', fontWeight: 500 }}
          >
            COMPANY
          </p>
          <ul className='flex flex-col gap-3'>
            {[['/', 'Home'], ['/about', 'About us'], ['/collection', 'Collection'], ['/contact', 'Privacy policy']].map(([path, label]) => (
              <li key={path}>
                <Link
                  to={path}
                  className='text-sm transition-colors hover:text-[var(--rose)]'
                  style={{ color: 'var(--text-soft)', fontWeight: 300 }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p
            className='mb-5 text-xs tracking-widest'
            style={{ color: 'var(--text-dark)', letterSpacing: '0.25em', fontWeight: 500 }}
          >
            GET IN TOUCH
          </p>
          <ul className='flex flex-col gap-3'>
            <li className='text-sm' style={{ color: 'var(--text-soft)', fontWeight: 300 }}>+1-212-456-7890</li>
            <li className='text-sm' style={{ color: 'var(--text-soft)', fontWeight: 300 }}>contact@demure.com</li>
            <li className='text-xs mt-1' style={{ color: 'var(--text-faint)', letterSpacing: '0.05em' }}>Mon–Fri, 9am–6pm EST</li>
          </ul>
        </div>

      </div>

      <div
        className='py-5 text-center'
        style={{ borderTop: '1px solid var(--text-faint)' }}
      >
        <p className='text-xs' style={{ color: 'var(--text-soft)', letterSpacing: '0.08em' }}>
          © 2025 Demure. All Rights Reserved. Made with love for style.
        </p>
      </div>
    </footer>
  )
}

export default Footer