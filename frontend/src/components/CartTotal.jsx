import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)

  const rows = [
    { label: 'Subtotal', value: `${getCartAmount()}.00 ${currency}` },
    { label: 'Shipping Fee', value: `${delivery_fee}.00 ${currency}` },
  ]

  return (
    <div className='w-full'>
      <div className='mb-5'>
        <Title text1='CART' text2='TOTALS' />
      </div>

      <div className='flex flex-col gap-4 text-sm'>
        {rows.map(({ label, value }) => (
          <div key={label}>
            <div className='flex justify-between py-1'>
              <p style={{ color: 'var(--text-mid)', fontWeight: 300 }}>{label}</p>
              <p style={{ color: 'var(--text-mid)', fontWeight: 300 }}>{value}</p>
            </div>
            <div className='mt-2' style={{ borderBottom: '1px solid var(--text-faint)' }} />
          </div>
        ))}

        <div className='flex justify-between pt-1'>
          <p className='playfair text-base' style={{ color: 'var(--text-dark)' }}>Total</p>
          <p className='playfair text-base' style={{ color: 'var(--text-dark)' }}>
             {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00 {currency}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal