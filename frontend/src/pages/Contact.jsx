import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='pt-10' style={{ borderTop: '1px solid var(--text-faint)' }}>

      <div className='text-center mb-14'>
        <Title text1='CONTACT' text2='US' />
      </div>

      <div className='flex flex-col md:flex-row gap-16 mb-28'>
        <img
          className='w-full md:max-w-[460px] object-cover'
          style={{ filter: 'saturate(0.88) brightness(0.97)' }}
          src={assets.contact_img}
          alt='Contact'
        />

        <div className='flex flex-col justify-center gap-7'>

          <div>
            <p className='playfair text-xl mb-1' style={{ color: 'var(--text-dark)' }}>Visit Our Store</p>
            <div className='w-6 h-px mb-4' style={{ background: 'var(--blush-dim)' }} />
            <p className='text-sm leading-loose' style={{ color: 'var(--text-mid)' }}>
              247 Fifth Avenue, Suite 1200<br />
              New York, NY 10001, USA
            </p>
          </div>

          <div>
            <p className='text-sm leading-loose' style={{ color: 'var(--text-mid)' }}>
              Tel: +1 (212) 456-7890<br />
              Email: contact@demure.com
            </p>
            <p className='text-xs mt-1' style={{ color: 'var(--text-soft)', letterSpacing: '0.05em' }}>
              Monday – Friday, 9am – 6pm EST
            </p>
          </div>

          <div>
            <p className='playfair text-xl mb-1' style={{ color: 'var(--text-dark)' }}>Work With Us</p>
            <div className='w-6 h-px mb-4' style={{ background: 'var(--blush-dim)' }} />
            <p className='text-sm leading-loose mb-5' style={{ color: 'var(--text-mid)' }}>
              We're always looking for passionate, creative minds to join the Demure team.
              Check out our open roles in design, marketing, and retail.
            </p>
            <button className='btn-outline-blush'>Explore Careers</button>
          </div>

        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact