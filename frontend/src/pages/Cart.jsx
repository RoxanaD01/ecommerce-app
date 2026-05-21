import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            tempData.push({ _id: productId, size, quantity: cartItems[productId][size] })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  return (
    <div className='pt-14' style={{ borderTop: '1px solid var(--text-faint)' }}>

      <div className='mb-8'>
        <Title text1='YOUR' text2='CART' />
      </div>

      {/* Cart items */}
      <div>
        {cartData.map((item) => {
          const productData = products.find(p => p._id === item._id)
          if (!productData) return null
          return (
            <div
              key={item._id}
              className='py-5 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
              style={{ borderBottom: '1px solid var(--text-faint)' }}
            >
              {/* Product info */}
              <div className='flex items-start gap-5'>
                <img
                  className='w-16 sm:w-20 object-cover'
                  style={{ background: 'var(--cream-deep)' }}
                  src={productData.image[0]}
                  alt={productData.name}
                />
                <div>
                  <p className='text-sm sm:text-base font-medium mb-2' style={{ color: 'var(--text-dark)' }}>
                    {productData.name}
                  </p>
                  <div className='flex items-center gap-4'>
                    <p className='playfair text-base' style={{ color: 'var(--text-mid)' }}>
                      {productData.price} {currency}
                    </p>
                    <span
                      className='text-xs px-3 py-1 tracking-wide'
                      style={{
                        border: '1px solid var(--text-faint)',
                        color: 'var(--text-mid)',
                        background: 'var(--cream-deep)'
                      }}
                    >
                      {item.size}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <input
                type='number'
                min={1}
                value={item.quantity}
                onChange={e => {
                  const val = Number(e.target.value)
                  if (e.target.value === '' || val <= 0) {
                    updateQuantity(item._id, item.size, 0)
                  } else {
                    updateQuantity(item._id, item.size, val)
                  }
                }
              }
                className='max-w-14 sm:max-w-20 px-2 py-1.5 text-center text-sm font-dm'
                style={{
                  border: '1px solid var(--text-faint)',
                  background: 'var(--cream)',
                  color: 'var(--text-dark)',
                }}
              />

              {/* Delete */}
              <button
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='justify-self-end opacity-40 hover:opacity-80 transition-opacity'
              >
                <img src={assets.bin_icon} className='w-4' alt='Remove' />
              </button>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className='flex justify-end mt-20 mb-10'>
        <div className='w-full sm:w-[420px]'>
          <CartTotal />
          <div className='flex justify-end mt-6'>
            <button
              onClick={() => navigate('/place-order')}
              className='btn-blush w-full sm:w-auto'
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart