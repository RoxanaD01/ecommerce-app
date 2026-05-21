import { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Reviews = ({ onReviewAdded }) => {
  const { token, backendUrl } = useContext(ShopContext)
  const { productId } = useParams()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Please log in to leave a review.')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${backendUrl}/api/review`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        toast.success('Review submitted!')
        setComment('')
        setRating(5)
        if (onReviewAdded) onReviewAdded()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      if (error.response?.status === 409) {
        toast.error('You have already reviewed this product.')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mt-8 flex flex-col gap-5 pt-8'
      style={{ borderTop: '1px solid var(--text-faint)' }}
    >
      <p
        className='text-xs tracking-widest'
        style={{ color: 'var(--text-dark)', letterSpacing: '0.2em', fontWeight: 500 }}
      >
        ADD A REVIEW
      </p>

      {/* Rating */}
      <div className='flex flex-col gap-2'>
        <label className='text-xs tracking-wide' style={{ color: 'var(--text-soft)', letterSpacing: '0.1em' }}>
          RATING
        </label>
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className='text-sm py-2.5 px-4 w-44 outline-none cursor-pointer font-light font-sans'
          style={{
            border: '1px solid var(--text-faint)',
            background: 'var(--cream)',
            color: 'var(--text-dark)',
          }}
        >
          
          {[5, 4, 3, 2, 1].map(num => (
            <option key={num} value={num}>
              {'★'.repeat(num)} {'☆'.repeat(5 - num)} — {num} star{num !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div className='flex flex-col gap-2'>
        <label className='text-xs tracking-wide' style={{ color: 'var(--text-soft)', letterSpacing: '0.1em' }}>
          YOUR REVIEW
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
          rows={4}
          placeholder='Share your thoughts about this piece...'
          className='text-sm px-4 py-3 resize-none outline-none max-w-lg'
          style={{
            border: '1px solid var(--text-faint)',
            background: 'var(--cream)',
            color: 'var(--text-dark)',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 300,
          }}
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='btn-blush w-fit disabled:opacity-50'
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default Reviews

