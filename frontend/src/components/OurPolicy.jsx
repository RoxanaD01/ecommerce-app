import { assets } from '../assets/assets'

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Free & Easy Exchange",
    desc: "Changed your mind? Swap sizes or styles hassle-free within 30 days"
  },
  {
    icon: assets.quality_icon,
    title: '7-Day Free Returns',
    desc: 'Not in love with it? Return any unworn item for a full refund, no questions asked.',
  },
  {
    icon: assets.support_img,
    title: '24/7 Support',
    desc: 'Our dedicated team is always here to help — any timezone, any question.',
  }
]

const OurPolicy = () => {
  return (
    <section
      className='py-16 px-6 sm:px-12 my-16'
      style={{ background: 'var(--cream-deep)', borderTop: '1px solid var(--text-faint)', borderBottom: '1px solid var(--text-faint)' }}
    >
      <div className='max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12'>
        {policies.map(({ icon, title, desc }) => (
          <div key={title} className='flex flex-col items-center text-center group'>
            <div
              className='w-14 h-14 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105'
              style={{ background: 'var(--blush-light)', borderRadius: '50%' }}
            >
              <img src={icon} className='w-6' alt={title} style={{ opacity: 0.7 }} />
            </div>
            <div className='w-5 h-px mb-4' style={{ background: 'var(--blush-dim)' }} />
            <p
              className='text-xs mb-3 tracking-widest'
              style={{ color: 'var(--text-dark)', letterSpacing: '0.18em', fontWeight: 500 }}
            >
              {title.toUpperCase()}
            </p>
            <p className='text-sm leading-loose' style={{ color: 'var(--text-soft)', fontWeight: 300 }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OurPolicy
