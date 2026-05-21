import { useContext, useEffect, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')

  const toggleCategory = (e) => {
    setCategory(prev =>
      prev.includes(e.target.value)
        ? prev.filter(item => item !== e.target.value)
        : [...prev, e.target.value]
    )
  }

  const toggleSubCategory = (e) => {
    setSubCategory(prev =>
      prev.includes(e.target.value)
        ? prev.filter(item => item !== e.target.value)
        : [...prev, e.target.value]
    )
  }

  const filteredProducts = useMemo(() => {
    let copy = products.slice()
    
    if (showSearch && search)
      copy = copy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))

    if (category.length > 0)
      copy = copy.filter(item => category.includes(item.category))

    if (subCategory.length > 0)
      copy = copy.filter(item => subCategory.includes(item.subCategory))

    switch (sortType) {
      case 'low-high':  copy.sort((a, b) => a.price - b.price); break
      case 'high-low':  copy.sort((a, b) => b.price - a.price); break
      default: break
    }

    return copy;

  },[products, category, subCategory, sortType, search, showSearch])


  // Reusable checkbox style
  const filterCheckbox = (label, value, onChange) => (
    <label key={value} className='flex items-center gap-3 cursor-pointer group'>
      <input
        type='checkbox'
        value={value}
        onChange={onChange}
        className='w-3.5 h-3.5 cursor-pointer accent-[var(--rose)]'
      />
      <span
        className='text-sm transition-colors group-hover:text-[var(--rose)]'
        style={{ color: 'var(--text-mid)', fontWeight: 300 }}
      >
        {label}
      </span>
    </label>
  )

  return (
    <div className='flex flex-col sm:flex-row gap-8 pt-10' style={{ borderTop: '1px solid var(--text-faint)' }}>

      {/* ── Filter Sidebar ── */}
      <div className='min-w-56'>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className='flex items-center gap-2 mb-6 w-full sm:cursor-default'
          style={{ color: 'var(--text-dark)' }}
        >
          <span
            className='text-xs tracking-widest font-medium'
            style={{ letterSpacing: '0.25em' }}
          >
            FILTERS
          </span>
          <img
            src={assets.dropdown_icon}
            className={`h-2.5 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`}
            alt=''
            style={{ filter: 'opacity(0.5)' }}
          />
        </button>


        {/* Categories */}
        <div
          className={`py-5 pr-4 mb-4 ${showFilter ? '' : 'hidden'} sm:block`}
          style={{ borderTop: '1px solid var(--text-faint)', borderBottom: '1px solid var(--text-faint)' }}
        >
          <p
            className='mb-4 text-xs tracking-widest'
            style={{ color: 'var(--text-soft)', letterSpacing: '0.2em' }}
          >
            CATEGORIES
          </p>
          <div className='flex flex-col gap-3'>
            {filterCheckbox('Women', 'Women', toggleCategory)}
            {filterCheckbox('Men', 'Men', toggleCategory)}
            {filterCheckbox('Boys', 'Boys', toggleCategory)}
            {filterCheckbox('Girls', 'Girls', toggleCategory)}
          </div>
        </div>

        {/* Type */}
        <div
          className={`py-5 pr-4 ${showFilter ? '' : 'hidden'} sm:block`}
        >
          <p
            className='mb-4 text-xs tracking-widest'
            style={{ color: 'var(--text-soft)', letterSpacing: '0.2em' }}
          >
            TYPE
          </p>
          <div className='flex flex-col gap-3'>
            {filterCheckbox('Topwear', 'Topwear', toggleSubCategory)}
            {filterCheckbox('Dress', 'Dress', toggleSubCategory)}
            {filterCheckbox('Bottomwear', 'Bottomwear', toggleSubCategory)}
            {filterCheckbox('Winterwear', 'Winterwear', toggleSubCategory)}
            {filterCheckbox('Accessories', 'Accessories', toggleSubCategory)}
            {filterCheckbox('Shoes', 'Shoes', toggleSubCategory)}
          </div>
        </div>
      </div>

      {/* ── Products Area ── */}
      <div className='flex-1'>

        <div className='flex justify-between items-center mb-8'>
          <Title text1='ALL' text2='COLLECTIONS' />

          <select
            onChange={e => setSortType(e.target.value)}
            className='text-xs py-2.5 px-4 cursor-pointer'
            style={{
              border: '1px solid var(--text-faint)',
              background: 'var(--cream)',
              color: 'var(--text-mid)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            <option value='relevant'>Sort: Relevance</option>
            <option value='low-high'>Price: Low → High</option>
            <option value='high-low'>Price: High → Low</option>
          </select>
        </div>

        {products.length === 0 ? (

          // Loading skeleton 
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-8'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='w-full mb-3 h-[280px] rounded-[2px]' style={{background:'var(--text-faint)' }}></div>
                <div className='mb-2 h-[14px] w-[70%] rounded-[2px]' style={{background:'var(--text-faint)' }}></div>
                <div className='h-[14px] w-[40%] rounded-[2px]' style={{background:'var(--text-faint)' }}></div>
              </div>
              ))}
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <p className='text-sm tracking-widest mb-3 tracking-[0.15em]' style={{ color: 'var(--text-soft)'}}>NO PRODUCTS FOUND</p>
            <p className='text-cs' style={{ color: 'var(--text-faint)' }}>Try adjusting your filters or search term</p>
            <button onClick={() => {setCategory([]); setSubCategory([])}} className='mt-6 text-xs tracking-[0.15em] px-6 py-2.5 bg-transparent ' style={{border: '1px solid var(--text-faint)', color: 'var(--text-mid)' }}>CLEAR FILTERS</button>
          </div>
          
        ) : (

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-8'>
            {filteredProducts.map((item, index) => (
              <ProductItem
                key={item._id} id={item._id} name={item.name} price={item.price} image={item.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection


