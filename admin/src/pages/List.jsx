import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({token}) => {
  // GET data from the API
  const [list, setList] = useState([])
  const navigate = useNavigate()

  // We'll run this function whenever this page will be loaded (using useEffect)
  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + "/api/product/list")
      if(response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
  
    } catch (error) {
      console.log(error);
      toast.error(error.message)    
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post( backendUrl + '/api/product/remove', {id}, {headers:{ Authorization: `Bearer ${token}` }})

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList() // display again the list after changes (removing items)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)    
      
    }
  }

  useEffect(() => {
    fetchList()
  },[])

  return (
    <div className='flex flex-col gap-5'>
 
      {/* Page title */}
      <div>
        <h2 className='playfair text-2xl mb-1' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
          All Products
        </h2>
        <div className='w-8 h-px' style={{ background: 'var(--blush-dim)' }} />
      </div>
 
      {/* Table */}
      <div>
        {/* Header row */}
        <div
          className='hidden md:grid grid-cols-[80px_1fr_120px_100px_100px] items-center px-4 py-3 text-xs'
          style={{
            background: 'var(--cream-deep)',
            borderBottom: '1px solid var(--text-faint)',
            letterSpacing: '0.15em',
            color: 'var(--text-soft)',
            fontWeight: 500,
          }}
        >
          <span>IMAGE</span>
          <span>NAME</span>
          <span>CATEGORY</span>
          <span>PRICE</span>
          <span className='text-center'>EDIT</span>
          <span className='text-center'>DEL</span>
        </div>
 
        {/* Product rows */}
        {list.map((item) => (
          <div
            key={item._id}
            className='grid-cols-[80px_1fr_120px_100px_100px] md:grid-cols-[80px_1fr_120px_100px_60px] items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--blush-light)]'
            style={{ borderBottom: '1px solid var(--text-faint)' }}
          >
            <img
              src={item.image[0]}
              className='w-12 h-12 object-cover'
              style={{ background: 'var(--cream-deep)' }}
              alt={item.name}
            />
            <p className='text-sm' style={{ color: 'var(--text-dark)', fontWeight: 300 }}>
              {item.name}
            </p>
            <p className='text-xs hidden md:block' style={{ color: 'var(--text-soft)', letterSpacing: '0.05em' }}>
              {item.category}
            </p>
            <p className='text-sm hidden md:block' style={{ color: 'var(--text-mid)', fontFamily: 'Playfair Display, serif' }}>
              {item.price} {currency}
            </p>
            <div className='flex items-center justify-center gap-3'>
              <button
                onClick={() => navigate(`/edit/${item._id}`)}
                style={{ opacity: 0.45, cursor: 'pointer', background: 'none', border: 'none' }}
                className='hover:opacity-100 transition-opacity'
              >
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='var(--text-mid)' strokeWidth='1.8'>
                  <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/>
                  <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/>
                </svg>
              </button>
            </div>
            <button
              onClick={() => removeProduct(item._id)}
              className='flex items-center justify-center transition-opacity hover:opacity-100 md:justify-center'
              style={{ opacity: 0.35, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='var(--rose)' strokeWidth='1.8'>
                <polyline points='3 6 5 6 21 6'/><path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'/><path d='M10 11v6M14 11v6'/><path d='M9 6V4h6v2'/>
              </svg>
            </button>
          </div>
        ))}
 
        {list.length === 0 && (
          <p className='py-10 text-center text-sm' style={{ color: 'var(--text-soft)' }}>
            No products yet. Add your first product.
          </p>
        )}
      </div>
 
    </div>
  )
}

export default List
