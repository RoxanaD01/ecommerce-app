import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext.jsx'

const inputStyle = {
  border: '1px solid var(--text-faint)',
  background: 'var(--cream)',
  color: 'var(--text-dark)',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 300,
}

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (response.data.success) {
        setSubmitted(true)
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

        {submitted ? (
          /* ── Success state ── */
          <div className='flex flex-col items-center text-center gap-5'>
            <div
              className='w-14 h-14 rounded-full flex items-center justify-center mb-2'
              style={{ background: 'var(--blush-light)' }}
            >
              <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='var(--rose)' strokeWidth='1.8'>
                <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/>
                <polyline points='22,6 12,13 2,6'/>
              </svg>
            </div>

            <h2 className='playfair text-2xl' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
              Check your email
            </h2>
            <div className='w-8 h-px' style={{ background: 'var(--blush-dim)' }} />

            <p className='text-sm leading-loose' style={{ color: 'var(--text-mid)', fontWeight: 300 }}>
              If an account exists for <span style={{ color: 'var(--text-dark)', fontWeight: 400 }}>{email}</span>,
              we've sent a password reset link. It expires in <span style={{ color: 'var(--text-dark)', fontWeight: 400 }}>1 hour</span>.
            </p>
            <p className='text-xs' style={{ color: 'var(--text-soft)' }}>
              Didn't receive it? Check your spam folder, or{' '}
              <span
                onClick={() => setSubmitted(false)}
                className='underline cursor-pointer hover:text-[var(--rose)] transition-colors'
              >
                try again
              </span>.
            </p>

            <button onClick={() => navigate('/login')} className='btn-blush w-full mt-2'>
              Back to Login
            </button>
          </div>

        ) : (
          /* ── Form state ── */
          <>
            <div className='text-center mb-8'>
              <h2 className='playfair text-3xl mb-2' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
                Forgot Password
              </h2>
              <div className='flex items-center justify-center gap-3 mt-3'>
                <span className='h-px w-8' style={{ background: 'var(--blush-dim)' }} />
                <span className='text-xs tracking-widest' style={{ color: 'var(--text-soft)', letterSpacing: '0.2em' }}>
                  RESET YOUR PASSWORD
                </span>
                <span className='h-px w-8' style={{ background: 'var(--blush-dim)' }} />
              </div>
              <p className='text-sm mt-4 leading-loose' style={{ color: 'var(--text-soft)', fontWeight: 300 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Your email address'
                required
                className='w-full px-4 py-3 text-sm outline-none'
                style={inputStyle}
              />

              <button
                type='submit'
                disabled={loading}
                className='btn-blush w-full disabled:opacity-50'
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type='button'
                onClick={() => navigate('/login')}
                className='text-xs text-center transition-colors hover:text-[var(--rose)]'
                style={{ color: 'var(--text-soft)' }}
              >
                Back to Login
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword