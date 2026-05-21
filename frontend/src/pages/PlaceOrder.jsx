import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const inputClass = 'w-full px-4 py-3 text-sm'
const inputStyle = {
  border: '1px solid var(--text-faint)',
  background: 'var(--cream)',
  color: 'var(--text-dark)',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 300,
}

const PlaceOrder = () => {
  const { navigate, backendUrl, token, cartItems, setCartItems, cartAmount, delivery_fee, products } = useContext(ShopContext)
  const [method, setMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    street: '', city: '', state: '',
    zipcode: '', country: '', phone: '',
  })

  const onChangeHandler = (e) => {
    setFormData(data => ({ ...data, [e.target.name]: e.target.value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (loading) return  // ← protecție extra
    setLoading(true)     // ← dezactivează butonul
    try {
      let orderItems = []
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const itemInfo = structuredClone(products.find(p => p._id === productId))
            if (itemInfo) {
              itemInfo.size = size
              itemInfo.quantity = cartItems[productId][size]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      const orderData = { address: formData, items: orderItems, amount: cartAmount + delivery_fee }

      switch (method) {
        case 'cod': {
          const res = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{ Authorization: `Bearer ${token}` }})
          if (res.data.success) { setCartItems({}); navigate('/orders') }
          else toast.error(res.data.message)
          break
        }
        case 'stripe': {
          const res = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{ Authorization: `Bearer ${token}` }})
          if (res.data.success) window.location.replace(res.data.session_url)
          else toast.error(res.data.message)
          break
        }
        default: break
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
        setLoading(false)  // ← reactivează doar dacă ceva a mers prost
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col sm:flex-row justify-between gap-12 pt-10 min-h-[80vh]'
      style={{ borderTop: '1px solid var(--text-faint)' }}
    >

      {/* ── Left: Delivery Info ── */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='mb-4'>
          <Title text1='DELIVERY' text2='INFORMATION' />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName}
            className={inputClass} style={inputStyle} type='text' placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName}
            className={inputClass} style={inputStyle} type='text' placeholder='Last Name' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={formData.email}
          className={inputClass} style={inputStyle} type='email' placeholder='Email Address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street}
          className={inputClass} style={inputStyle} type='text' placeholder='Street' />

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city}
            className={inputClass} style={inputStyle} type='text' placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state}
            className={inputClass} style={inputStyle} type='text' placeholder='State / County' />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode}
            className={inputClass} style={inputStyle} type='number' placeholder='Zip Code' />
          <input required onChange={onChangeHandler} name='country' value={formData.country}
            className={inputClass} style={inputStyle} type='text' placeholder='Country' />
        </div>

        <input required onChange={onChangeHandler} name='phone' value={formData.phone}
          className={inputClass} style={inputStyle} type='number' placeholder='Phone' />
      </div>

      {/* ── Right: Summary + Payment ── */}
      <div className='w-full sm:min-w-72'>

        <CartTotal />

        <div className='mt-10'>
          <div className='mb-5'>
            <Title text1='PAYMENT' text2='METHOD' />
          </div>

          <div className='flex flex-col gap-3'>
            {/* Stripe */}
            <div
              onClick={() => setMethod('stripe')}
              className='flex items-center gap-3 cursor-pointer px-4 py-3 transition-colors'
              style={{
                border: `1px solid ${method === 'stripe' ? 'var(--blush-dim)' : 'var(--text-faint)'}`,
                background: method === 'stripe' ? 'var(--blush-light)' : 'var(--cream)',
              }}
            >
              <div
                className='w-3.5 h-3.5 rounded-full border flex items-center justify-center'
                style={{ borderColor: 'var(--blush-dim)' }}
              >
                {method === 'stripe' && (
                  <div className='w-2 h-2 rounded-full' style={{ background: 'var(--rose)' }} />
                )}
              </div>
              <img className='h-5' src={assets.stripe_logo} alt='Stripe' />
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod('cod')}
              className='flex items-center gap-3 cursor-pointer px-4 py-3 transition-colors'
              style={{
                border: `1px solid ${method === 'cod' ? 'var(--blush-dim)' : 'var(--text-faint)'}`,
                background: method === 'cod' ? 'var(--blush-light)' : 'var(--cream)',
              }}
            >
              <div
                className='w-3.5 h-3.5 rounded-full border flex items-center justify-center'
                style={{ borderColor: 'var(--blush-dim)' }}
              >
                {method === 'cod' && (
                  <div className='w-2 h-2 rounded-full' style={{ background: 'var(--rose)' }} />
                )}
              </div>
              <span className='text-xs tracking-widest' style={{ color: 'var(--text-mid)', letterSpacing: '0.15em' }}>
                CASH ON DELIVERY
              </span>
            </div>
          </div>

          <button type='submit' className='btn-blush w-full mt-8' disabled={loading} style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder