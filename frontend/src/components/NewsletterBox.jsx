const NewsletterBox = () => {
  const onSubmitHandler = (e) => e.preventDefault()

  return (
    <section className='py-20 text-center'>

      <div className='flex items-center justify-center gap-6 mb-8'>
        <span className='h-px w-16' style={{ background: 'linear-gradient(to right, transparent, var(--blush-dim))' }} />
        <span className='text-xs tracking-widest' style={{ color: 'var(--rose)', letterSpacing: '0.3em' }}>
          EXCLUSIVE OFFER
        </span>
        <span className='h-px w-16' style={{ background: 'linear-gradient(to left, transparent, var(--blush-dim))' }} />
      </div>

      <h2
        className='playfair mb-4'
        style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--text-dark)', fontWeight: 400 }}
      >
        Subscribe &amp; Get <em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>10% Off</em>
      </h2>

      <p
        className='text-sm leading-loose mx-auto mb-8 max-w-md'
        style={{ color: 'var(--text-soft)', fontWeight: 300 }}
      >
        Join our style community and be the first to know about new arrivals, exclusive offers,
        and seasonal lookbooks. No spam — just great fashion, straight to your inbox.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className='flex flex-col sm:flex-row mx-auto max-w-md'
        style={{ border: '1px solid var(--text-faint)' }}
      >
        <input
          type='email'
          placeholder='Enter your email'
          required
          className='flex-1 px-5 py-3.5 text-sm outline-none'
          style={{
            background: 'var(--white)',
            border: 'none',
            color: 'var(--text-dark)',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 300,
          }}
        />
        <button
          type='submit'
          className='btn-blush'
          style={{ borderTop: '1px solid var(--text-faint)' }}
        >
          Subscribe
        </button>
      </form>

      <p className='text-xs mt-5' style={{ color: 'var(--text-faint)', letterSpacing: '0.12em' }}>
        UNSUBSCRIBE ANYTIME · NO SPAM · PRIVACY PROTECTED
      </p>
    </section>
  )
}

export default NewsletterBox