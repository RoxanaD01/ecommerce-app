import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='pt-10' style={{ borderTop: '1px solid var(--text-faint)' }}>

      <div className='text-center mb-14'>
        <Title text1='ABOUT' text2='US' />
        <p className='mt-4 text-sm max-w-md mx-auto leading-loose' style={{ color: 'var(--text-soft)' }}>
          A fashion shop built on the belief that great style and real comfort can coexist.
        </p>
      </div>

      {/* Image + Story */}
      <div className='flex flex-col md:flex-row gap-16 mb-20'>
        <img
          className='w-full md:max-w-[420px] object-cover'
          style={{ filter: 'saturate(0.9) brightness(0.97)' }}
          src={assets.about_img}
          alt='About Demure'
        />
        <div className='flex flex-col justify-center gap-6 md:w-1/2'>
          <p className='leading-loose text-sm' style={{ color: 'var(--text-mid)' }}>
            Demure was born from a simple belief: that great style shouldn't come at the cost
            of comfort or your conscience. Founded in 2019, we set out to create a fashion
            brand that speaks to real people living real lives — whether that's a morning
            commute, a weekend getaway, or a night out with friends.
          </p>
          <div>
            <p className='playfair text-lg mb-3' style={{ color: 'var(--text-dark)' }}>Our Mission</p>
            <div className='w-8 h-px mb-4' style={{ background: 'var(--blush-dim)' }} />
            <p className='leading-loose text-sm' style={{ color: 'var(--text-mid)' }}>
              Every piece in our collection is thoughtfully designed and carefully crafted using
              sustainable fabrics and ethical production practices. We work directly with certified
              manufacturers who share our values — fair wages, safe working conditions, and
              minimal environmental impact.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className='mb-6'>
        <Title text1='WHY' text2='CHOOSE US' />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-px mb-20' style={{ background: 'var(--text-faint)' }}>
        {[
          {
            title: 'Uncompromising Quality',
            desc: 'We source only premium, sustainably-certified fabrics. Every garment passes our 47-point quality check before it ever reaches your door — because you deserve clothing that lasts.',
          },
          {
            title: 'Effortless Shopping',
            desc: "From discovery to doorstep, we've made shopping as seamless as possible. Free returns, fast delivery, and a size guide that actually works — so you can shop with confidence every time.",
          },
          {
            title: 'Real Style Experts',
            desc: "Our team of dedicated stylists is here seven days a week to help you find pieces you'll love. Whether you need a full outfit idea or just the right size, we've got you covered.",
          },
        ].map(({ title, desc }) => (
          <div
            key={title}
            className='flex flex-col gap-5 px-10 py-12'
            style={{ background: 'var(--cream)' }}
          >
            <div className='w-6 h-px' style={{ background: 'var(--blush-dim)' }} />
            <p className='text-sm font-medium tracking-wide' style={{ color: 'var(--text-dark)' }}>
              {title}
            </p>
            <p className='text-sm leading-loose' style={{ color: 'var(--text-mid)' }}>
              {desc}
            </p>
          </div>
        ))}
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About