import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const statusOptions = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']

const statusColor = (status) => {
  if (status === 'Delivered')        return { bg: 'var(--sage)', color: '#fff' }
  if (status === 'Shipped')          return { bg: 'var(--blush)', color: 'var(--text-dark)' }
  if (status === 'Out for delivery') return { bg: 'var(--blush-dim)', color: '#fff' }
  return { bg: 'var(--cream-deep)', color: 'var(--text-mid)' }
}

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        {headers:{ Authorization: `Bearer ${token}` }},
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {   // event of the selected option 
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value}, {headers:{ Authorization: `Bearer ${token}` }})

      if(response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className='flex flex-col gap-5'>
 
      {/* Page title */}
      <div>
        <h2 className='playfair text-2xl mb-1' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
          Orders
        </h2>
        <div className='w-8 h-px' style={{ background: 'var(--blush-dim)' }} />
      </div>
 
      {/* Order cards */}
      <div className='flex flex-col gap-3'>
        {orders.map((order) => {
          const sc = statusColor(order.status)
          return (
            <div
              key={order._id}
              className='grid grid-cols-1 sm:grid-cols-[40px_1fr] lg:grid-cols-[40px_1fr_160px_100px_180px] gap-4 items-start p-5'
              style={{
                background: 'var(--white)',
                border: '1px solid var(--text-faint)',
              }}
            >
              {/* Parcel icon */}
              <img
                src={assets.parcel_icon}
                className='w-8 mt-1 opacity-40'
                alt=''
              />
 
              {/* Items + address */}
              <div className='flex flex-col gap-1'>
                <div className='mb-1'>
                  {order.items.map((item, i) => (
                    <span key={i} className='text-xs' style={{ color: 'var(--text-mid)', fontWeight: 300 }}>
                      {item.name} × {item.quantity} <span style={{ color: 'var(--text-soft)' }}>{item.size}</span>
                      {i < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <p className='text-sm font-medium' style={{ color: 'var(--text-dark)' }}>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className='text-xs' style={{ color: 'var(--text-soft)', fontWeight: 300 }}>
                  {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} {order.address.zipcode}
                </p>
                <p className='text-xs' style={{ color: 'var(--text-soft)' }}>{order.address.phone}</p>
              </div>
 
              {/* Meta */}
              <div className='flex flex-col gap-1 text-xs' style={{ color: 'var(--text-mid)', fontWeight: 300 }}>
                <p>Items: {order.items.length}</p>
                <p>{order.paymentMethod}</p>
                <p style={{ color: order.payment ? 'var(--sage)' : 'var(--rose)' }}>
                  {order.payment ? '✓ Paid' : '○ Pending'}
                </p>
                <p style={{ color: 'var(--text-soft)' }}>{new Date(order.date).toLocaleDateString()}</p>
              </div>
 
              {/* Amount */}
              <p
                className='playfair-display text-base font-light'
                style={{ color: 'var(--text-dark)'}}
              >
                {order.amount} {currency} 
              </p>
 
              {/* Status select */}
              <select
                onChange={e => statusHandler(e, order._id)}
                value={order.status}
                className='text-xs px-3 py-2 w-full cursor-pointer outline-none font-medium tracking-wide'
                style={{
                    background: sc.bg,
                    color: sc.color,
                    fontFamily: 'DM Sans, sans-serif',
                    border: '1px solid var(--text-faint)',
                }}
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
 
            </div>
          )
        })}
 
        {orders.length === 0 && (
          <p className='py-10 text-center text-sm' style={{ color: 'var(--text-soft)' }}>
            No orders yet.
          </p>
        )}
      </div>
 
    </div>
  )
};

export default Orders;
