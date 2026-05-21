import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    if (token) navigate('/')
  }, [token])

  return (
    <div className='flex items-center justify-center min-h-[75vh]'>
      <div
        className='w-full max-w-sm px-10 py-12'
        style={{ background: 'var(--white)', boxShadow: '0 8px 40px rgba(196,135,125,0.1)' }}
      >
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='playfair text-3xl mb-2' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
            {currentState === 'Login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <div className='flex items-center justify-center gap-3 mt-3'>
            <span className='h-px w-8' style={{ background: 'var(--blush-dim)' }} />
            <span className='text-xs tracking-widest' style={{ color: 'var(--text-soft)', letterSpacing: '0.2em' }}>
              {currentState === 'Login' ? 'SIGN IN TO CONTINUE' : 'JOIN DEMURE'}
            </span>
            <span className='h-px w-8' style={{ background: 'var(--blush-dim)' }} />
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          {currentState === 'Sign Up' && (
            <input
              type='text'
              placeholder='Full Name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className='w-full px-4 py-3 text-sm'
              style={{
                border: '1px solid var(--text-faint)',
                background: 'var(--cream)',
                color: 'var(--text-dark)',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
          )}

          <input
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className='w-full px-4 py-3 text-sm'
            style={{
              border: '1px solid var(--text-faint)',
              background: 'var(--cream)',
              color: 'var(--text-dark)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />

        <div className='relative'>
            <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className='w-full px-4 py-3 text-sm'
            style={{
              border: '1px solid var(--text-faint)',
              background: 'var(--cream)',
              color: 'var(--text-dark)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />

          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer'
            style={{ color: 'var(--text-soft)'}}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5M6.357 6.357A9.953 9.953 0 003 12c1.564 3.453 5.139 6 9 6a9.95 9.95 0 004.643-1.143M9.879 9.879A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .447-.097.872-.268 1.254M17.76 17.76A9.953 9.953 0 0121 12c-1.564-3.453-5.139-6-9-6a9.95 9.95 0 00-2.878.426" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
          
          <div className='flex justify-between text-xs mt-1' style={{ color: 'var(--text-soft)' }}>
            {currentState === 'Login' ? (
              <span
                onClick={() => navigate('/forgot-password')}
                className='cursor-pointer hover:text-[var(--rose)] transition-colors'
              >
                Forgot password?
              </span>
            ) : <span />}
            {currentState === 'Login' ? (
              <span
                onClick={() => setCurrentState('Sign Up')}
                className='cursor-pointer hover:text-[var(--rose)] transition-colors'
              >
                Create account
              </span>
            ) : (
              <span
                onClick={() => setCurrentState('Login')}
                className='cursor-pointer hover:text-[var(--rose)] transition-colors'
              >
                Login here
              </span>
            )}
          </div>

          <button type='submit' className='btn-blush w-full mt-3'>
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login