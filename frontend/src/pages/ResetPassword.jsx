import { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const inputStyle = {
  border: '1px solid var(--text-faint)',
  background: 'var(--cream)',
  color: 'var(--text-dark)',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 300,
}

const ResetPassword = () => {
  const { token } = useParams()
  const { backendUrl, navigate } = useContext(ShopContext)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter')
      return
    }
    if (!/[a-z]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter')
      return
    }
    if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number')
      return
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error('Password must contain at least one special character')
      return
    }
    if (password !== confirm) {
      toast.error("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password/${token}`, { password })
      if (response.data.success) {
        setDone(true)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-[75vh]'>
      <div
        className='w-full max-w-sm px-10 py-12'
        style={{ background: 'var(--white)', boxShadow: '0 8px 40px rgba(196,135,125,0.1)' }}
      >

        {done ? (
          /* ── Success state ── */
          <div className='flex flex-col items-center text-center gap-5'>
            <div
              className='w-14 h-14 rounded-full flex items-center justify-center mb-2'
              style={{ background: 'var(--blush-light)' }}
            >
              <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='var(--rose)' strokeWidth='1.8'>
                <polyline points='20 6 9 17 4 12'/>
              </svg>
            </div>

            <h2 className='playfair text-2xl' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
              Password Reset
            </h2>
            <div className='w-8 h-px' style={{ background: 'var(--blush-dim)' }} />

            <p className='text-sm leading-loose' style={{ color: 'var(--text-mid)', fontWeight: 300 }}>
              Your password has been changed successfully. You can now log in with your new password.
            </p>

            <button onClick={() => navigate('/login')} className='btn-blush w-full mt-2'>
              Go to Login
            </button>
          </div>

        ) : (
          /* ── Form state ── */
          <>
            <div className='text-center mb-8'>
              <h2 className='playfair text-3xl mb-2' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
                Reset Password
              </h2>
              <div className='flex items-center justify-center gap-3 mt-3'>
                <span className='h-px w-8' style={{ background: 'var(--blush-dim)' }} />
                <span className='text-xs' style={{ color: 'var(--text-soft)', letterSpacing: '0.2em' }}>
                  CHOOSE A NEW PASSWORD
                </span>
                <span className='h-px w-8' style={{ background: 'var(--blush-dim)' }} />
              </div>
              <p className='text-sm mt-4 leading-loose' style={{ color: 'var(--text-soft)', fontWeight: 300 }}>
                Min. 8 characters, with uppercase, lowercase, number and special character (!@#$...).
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
              <input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='New password'
                required
                className='w-full px-4 py-3 text-sm outline-none'
                style={inputStyle}
              />
              <input
                type='password'
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder='Confirm new password'
                required
                className='w-full px-4 py-3 text-sm outline-none'
                style={inputStyle}
              />

              {/* Live match indicator */}
              {confirm && (
                <p
                  className='text-xs -mt-1'
                  style={{ color: password === confirm ? 'var(--sage)' : 'var(--rose)' }}
                >
                  {password === confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}

              <button
                type='submit'
                disabled={loading}
                className='btn-blush w-full mt-2 disabled:opacity-50'
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  )
}

export default ResetPassword