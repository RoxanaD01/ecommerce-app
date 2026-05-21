import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) return null
      const response = await axios.post(backendUrl + '/api/order/userOrders', {}, {headers:{ Authorization: `Bearer ${token}` }})

      if (response.data.success) {
        let allItems = []
        
        response.data.orders.forEach(order => {
          order.items.forEach(item => {
            allItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            })
          })
        })
        setOrderData(allItems.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { loadOrderData() }, [token])

  const statusColor = (status) => {
    if (status === 'Delivered') return 'var(--sage)'
    if (status === 'Cancelled') return 'var(--rose)'
    return 'var(--blush-dim)'
  }

  return (
    <div className='pt-16' style={{ borderTop: '1px solid var(--text-faint)' }}>

      <div className='mb-8'>
        <Title text1='MY' text2='ORDERS' />
      </div>

      <div className='flex flex-col gap-4'>
        {orderData.map((item, index) => (
          <div
            key={index}
            className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-5 px-1'
            style={{ borderBottom: '1px solid var(--text-faint)' }}
          >
            {/* Left: product */}
            <div className='flex items-start gap-5'>
              <img
                className='w-16 sm:w-20 object-cover'
                style={{ background: 'var(--cream-deep)' }}
                src={item.image[0]}
                alt={item.name}
              />
              <div>
                <p className='text-sm font-medium mb-2' style={{ color: 'var(--text-dark)' }}>
                  {item.name}
                </p>
                <div className='flex flex-wrap items-center gap-4 text-sm' style={{ color: 'var(--text-mid)' }}>
                  <span className='playfair'>{item.price} {currency}</span>
                  <span className='text-xs' style={{ color: 'var(--text-soft)' }}>Qty: {item.quantity}</span>
                  <span
                    className='text-xs px-2 py-0.5'
                    style={{ border: '1px solid var(--text-faint)', background: 'var(--cream-deep)', letterSpacing: '0.05em' }}
                  >
                    {item.size}
                  </span>
                </div>
                <p className='text-xs mt-2' style={{ color: 'var(--text-soft)' }}>
                  {new Date(item.date).toDateString()} · {item.paymentMethod}
                </p>
              </div>
            </div>

            {/* Right: status + track */}
            <div className='flex items-center justify-between md:justify-end gap-6 md:w-auto'>
              <div className='flex items-center gap-2'>
                <span
                  className='w-2 h-2 rounded-full'
                  style={{ background: statusColor(item.status) }}
                />
                <span className='text-xs tracking-wide' style={{ color: 'var(--text-mid)', letterSpacing: '0.08em' }}>
                  {item.status}
                </span>
              </div>
              <button
                onClick={loadOrderData}
                className='btn-outline-blush text-xs'
                style={{ padding: '8px 20px' }}
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders