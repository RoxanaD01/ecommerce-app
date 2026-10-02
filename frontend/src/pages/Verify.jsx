import React from 'react'
import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

    const {navigate, token, setCartItems, backendUrl, tokenLoaded} = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading')

    const orderId = searchParams.get('orderId')
    const sessionId = searchParams.get('sessionId')

    const verifyPayment = async () => {
        try {
            if (!token) return

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', {orderId, sessionId}, {headers:{ Authorization: `Bearer ${token}` }})
            if (response.data.success) {
                setStatus('success')
                setCartItems({})
                setTimeout(() => navigate('/orders'), 2500)
            } else {
                setStatus('failed')
                setTimeout(() => navigate('/cart'), 2500)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            setStatus('failed')
            setTimeout(() => navigate('/cart'), 2500)
        }
    }

    useEffect(() => {
        if(tokenLoaded) {
            verifyPayment()
        }
    },[tokenLoaded])

  return (
    <div className='min-h-[60vh] flex items-center justify-center px-4'>
        <div className='flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl p-12 max-w-sm w-full shadow-sm text-center' >

            {/* Spinner */}
            {
                status === 'success' && (
                    <div className='w-16 h-16 rounded-full bg-green-50 flex items-center justify-center'>
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                )
            }
            {
                status === 'failed' && (
                    <div className='w-16 h-16 rounded-full bg-red-50 flex items-center justify-center'>
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </div>
                )
            }

            {/* Heading */}
            <h2 className='text-xl font-semibold text-gray-900'>
                {status === 'loading' && 'Verifying payment...'}
                {status === 'success' && 'Payment confirmed!'}
                {status === 'failed' && 'Payment not confirmed'}
            </h2>

            {/* Subtitle */}
            <p className='text-sm text-gray-500 leading-relaxed'>
                {status === 'loading' && 'Please wait a few seconds.'}
                {status === 'success' && 'Your order has been placed. You will be redirected to your orders.'}
                {status === 'failed' && 'Payment could not be processed. You will be redirected to your cart.'}
            </p>

            {/* Progress bar */}
            {status === 'loading' && (
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                    <div className={`h-full rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} style={{ animation: 'progress 2.5s linear forwards' }}>

                    </div>
                </div>
            )}
        </div>
        <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}
      </style>
    </div>
  )
}

export default Verify
