import React, { useContext, useEffect, useState } from 'react'
import {ShopContext} from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {

  const {backendUrl, token, setToken, navigate} = useContext(ShopContext)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [passwordSection, setPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setshowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/user/profile', {headers: { Authorization: `Bearer ${token}` }})

        if (response.data.success) {
          const userData = response.data.user
          setUser(userData)
          setName(userData.name)
          setPhone(userData.phone || '')
          setEmail(userData.email)
        } else {
          toast.error(response.data.message)
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchProfile()
  },[token])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await axios.post(backendUrl + '/api/user/profile', {name, phone}, { headers: { Authorization: `Bearer ${token}` }})

      if (response.data.success) {
        setUser(response.data.user)
        toast.success('Profile updated!')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

const handleChangePassword = async (e) => {
  e.preventDefault()
  if(newPassword !== confirmPassword) {
    toast.error('Passwords do not match')
    return
  }
  setChangePassword(true)

  try {
    const response = await axios.post(backendUrl + '/api/user/change-password', { currentPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } })

    if (response.data.success) {
      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSection(false)
    } else {
      toast.error(response.data.message)
    }

  } catch (error) {
     toast.error(error.response?.data?.message || 'Something went wrong')
  } finally {
    setChangePassword(false)
  }
}

  if (loading) {
    return (
      <div className='pt-16 min-h-[50vh] flex items-center justify-center ' style={{ borderTop: '1px solid var(--text-faint)' }}>
        <p className='text-xs tracking-widest' style={{ color: 'var(--text-soft)', letterSpacing: '0.2em' }}>LOADING...</p>
      </div>      
    )
  }


  return (
    <div className='pt-16' style={{ borderTop: '1px solid var(--text-faint)' }}>
      
      <div>
        <Title text1='MY' text2='PROFILE'/>
      </div>

      <div className='max-w-xl'>

        {/*  Avatar + name display */}
        <div className='flex items-center gap-5 mb-10' style={{ borderBottom: '1px solid var(--text-faint)' }}>
          <div className='w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium' style={{ background: 'var(--blush-light)', color: 'var(--rose)' }}>
            {
              user?.name.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <p className='text-lg playfair' style={{ color: 'var(--text-dark)' }}>
              {user?.name}
            </p>
            <p className='text-xs mt-0.5' style={{ color: 'var(--text-soft)' }}>
              {user?.email}
            </p>
          </div>
        </div>
        
        {/*  Edit Profile Form  */}
        <form onSubmit={handleSave}>
          <p className='text-xs tracking-widest mb-6 tracking-widest' style={{ color: 'var(--text-soft)', }}>
            PERSONAL INFORMATION
          </p>

          {/* Name */}
          <div className='mb-5'>
            <label className='block text-xs mb-2 tracking-widest'  style={{ color: 'var(--text-mid)' }}>FULL NAME</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className='w-full px-4 py-3 text-sm outline-none transition-colors' 
              style={{ 
                  border: '1px solid var(--text-faint)',
                  background: 'var(--cream)',
                  color: 'var(--text-dark)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--blush-dim)'}
              onBlur={e => e.target.style.borderColor = 'var(--text-faint)'}/>
          </div>

          {/* Email — read only */}
          <div className='mb-5'>
              <label className='block text-xs mb-2 tracking-widest' style={{ color: 'var(--text-mid)'}}>EMAIL ADDRESS</label>
              <input
                type='email'
                value={email}
                disabled
                className='w-full px-4 py-3 text-sm'
                style={{
                  border: '1px solid var(--text-faint)',
                  background: 'var(--cream-deep)',
                  color: 'var(--text-soft)',
                  cursor: 'not-allowed',
              }}
            />
            <p className='text-xs mt-1' style={{ color: 'var(--text-soft)' }}>Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div className='mb-8'>
              <label className='block text-xs mb-2 tracking-widest' style={{ color: 'var(--text-mid)' }}>
              PHONE NUMBER <span style={{ color: 'var(--text-soft)' }}>(optional)</span>
            </label>
            <input
              type='tel'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder='+40 700 000 000'
              className='w-full px-4 py-3 text-sm outline-none transition-colors'
              style={{
                border: '1px solid var(--text-faint)',
                background: 'var(--cream)',
                color: 'var(--text-dark)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--blush-dim)'}
              onBlur={e => e.target.style.borderColor = 'var(--text-faint)'}
            />
          </div>

          <button type='submit' disabled={saving} className='btn-blush text-xs tracking-widest px-8 py-3 transition-opacity' style={{ opacity: saving ? 0.6 : 1 }} >
              {saving ? 'SAVING...' : "SAVE CHANGES"}
          </button>

        </form>

        {/*  Change Password Section  */}      
        <div className='mt-12 pt-8' style={{ borderTop: '1px solid var(--text-faint)' }}> 
          <div onClick={() => setPasswordSection(!(passwordSection))} className='flex items-center justify-between cursor-pointer mb-6'>
            <p className='text-xs tracking-widest' style={{ color: 'var(--text-soft)'}}>
              CHANGE PASSWORD
            </p>
            <span className='text-xs transition-transform duration-300' style={{
                color: 'var(--text-soft)',
                display: 'inline-block',
                transform: passwordSection ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
              ⌄
            </span>
          </div>

          {
            passwordSection && (
              <form onSubmit={handleChangePassword} className='flex flex-col gap-5'>

                <div>
                  <label className='block text-xs mb-2' style={{ color: 'var(--text-mid)'}}>CURRENT PASSWORD</label>
                  <div className='relative'>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                      className='w-full px-4 py-3 text-sm outline-none'
                      style={{ border: '1px solid var(--text-faint)', background: 'var(--cream)', color: 'var(--text-dark)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--blush-dim)'}
                      onBlur={e => e.target.style.borderColor = 'var(--text-faint)'}
                    />
                    <button
                      type='button'
                      onClick={() => setshowCurrentPassword(!showCurrentPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2'
                      style={{ color: 'var(--text-soft)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showCurrentPassword ? (
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
                </div>

                <div>
                  <label className='block text-xs mb-2' style={{ color: 'var(--text-mid)', letterSpacing: '0.1em' }}>
                  NEW PASSWORD
                </label>
                <div className='relative'>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className='w-full px-4 py-3 text-sm outline-none'
                      style={{ border: '1px solid var(--text-faint)', background: 'var(--cream)', color: 'var(--text-dark)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--blush-dim)'}
                      onBlur={e => e.target.style.borderColor = 'var(--text-faint)'}
                    />
                    <button
                      type='button'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2'
                      style={{ color: 'var(--text-soft)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showNewPassword ? (
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
                <p className='text-xs mt-1' style={{ color: 'var(--text-soft)' }}>
                  Min 8 characters, uppercase, lowercase, number and symbol
                </p>
                </div>

                <div>
                  <label className='block text-xs mb-2' style={{ color: 'var(--text-mid)', letterSpacing: '0.1em' }}>
                  CONFIRM NEW PASSWORD
                </label>
                <div className='relative'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className='w-full px-4 py-3 text-sm outline-none'
                      style={{ border: '1px solid var(--text-faint)', background: 'var(--cream)', color: 'var(--text-dark)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--blush-dim)'}
                      onBlur={e => e.target.style.borderColor = 'var(--text-faint)'}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2'
                      style={{ color: 'var(--text-soft)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? (
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
                </div>

                <button type='submit' disabled={changePassword} 
                  className='btn-outline-blush text-xs tracking-widest px-8 py-3'
                  style={{ letterSpacing: '0.18em', opacity: changePassword? 0.6 : 1 }}>
                  {changePassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
                </button>

              </form>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Profile
