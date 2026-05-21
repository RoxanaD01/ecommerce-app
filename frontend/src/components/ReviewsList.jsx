const ReviewsList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <p className='text-sm py-4' style={{ color: 'var(--text-soft)' }}>
        No reviews yet. Be the first to share your thoughts!
      </p>
    )
  }

  return (
    <div className='flex flex-col gap-5'>
      {reviews.map((review) => (
        <div
          key={review._id}
          className='pb-5'
          style={{ borderBottom: '1px solid var(--text-faint)' }}
        >
          <div className='flex items-center gap-3 mb-2'>
            <span className='text-sm font-medium' style={{ color: 'var(--text-dark)' }}>
              {review.user?.name || 'Anonymous'}
            </span>
            <span style={{ color: 'var(--blush-dim)', letterSpacing: '2px', fontSize: '0.85rem' }}>
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </span>
          </div>
          <p className='text-sm leading-loose' style={{ color: 'var(--text-mid)', fontWeight: 300 }}>
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ReviewsList