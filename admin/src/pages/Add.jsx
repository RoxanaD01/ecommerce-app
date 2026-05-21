import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import {backendUrl } from '../App'
import { toast } from 'react-toastify'

const labelStyle = {
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  color: 'var(--text-soft)',
  fontWeight: 500,
  marginBottom: '6px',
  display: 'block',
}
 
const inputStyle = {
  border: '1px solid var(--text-faint)',
  background: 'var(--white)',
  color: 'var(--text-dark)',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 300,
  padding: '10px 14px',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
}

const Add = ({token}) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubcategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const toggleSize = (s) =>
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
     
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      const parsedPrice = parseFloat(price);
      if(!parsedPrice || parsedPrice <= 0) {
        toast.error("Price must be greater than zero")
        return
      }
      formData.append('price', parsedPrice);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));  

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, {headers:{ Authorization: `Bearer ${token}` }})
      
      if (response.data.success) {
        toast.success("Product Added")
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }
    
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  const getSizes = (category, subCategory) => {
  if (subCategory === 'Shoes') {
    return ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  }
  if (category === 'Boys' || category === 'Girls') {
    return ['1Y', '2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9Y','10Y', '11Y','12Y', '13Y','14Y']
  }
  if (subCategory === "Accessories") {
    return ['One Size']
  }
  return ['XS', 'S', 'M', 'L', 'XL', 'XXL']
}

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setSizes([])  
  }

  const handleSubCategoryChange = (e) => {
    setSubcategory(e.target.value)
    setSizes([])  
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col gap-7 max-w-2xl'>
 
      {/* Page title */}
      <div>
        <h2 className='playfair text-2xl mb-1' style={{ color: 'var(--text-dark)', fontWeight: 400 }}>
          Add Product
        </h2>
        <div className='w-8 h-px' style={{ background: 'var(--blush-dim)' }} />
      </div>
 
      {/* Image upload */}
      <div>
        <span style={labelStyle}>PRODUCT IMAGES</span>
        <div className='flex gap-3'>
          {[
            [image1, setImage1, 'image1'],
            [image2, setImage2, 'image2'],
            [image3, setImage3, 'image3'],
            [image4, setImage4, 'image4'],
          ].map(([img, setImg, id]) => (
            <label
              key={id}
              htmlFor={id}
              className='cursor-pointer overflow-hidden flex items-center justify-center transition-all'
              style={{
                width: '80px', height: '80px',
                border: `1px dashed ${img ? 'var(--blush-dim)' : 'var(--text-faint)'}`,
                background: img ? 'var(--blush-light)' : 'var(--cream-deep)',
              }}
            >
              <img
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                className='w-full h-full object-cover'
                style={{ opacity: img ? 1 : 0.4 }}
                alt=''
              />
              <input onChange={e => setImg(e.target.files[0])} type='file' id={id} hidden />
            </label>
          ))}
        </div>
      </div>
 
      {/* Name */}
      <div>
        <label style={labelStyle}>PRODUCT NAME</label>
        <input
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='e.g. Blush Linen Dress'
          required
          style={{ ...inputStyle, maxWidth: '500px' }}
        />
      </div>
 
      {/* Description */}
      <div>
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Write a short product description...'
          required
          rows={4}
          style={{ ...inputStyle, maxWidth: '500px', resize: 'vertical' }}
        />
      </div>
 
      {/* Category / SubCategory / Price */}
      <div className='flex flex-wrap gap-6'>
        <div className='flex flex-col gap-1.5'>
          <label style={labelStyle}>CATEGORY</label>
          <select
            onChange={handleCategoryChange}
            style={{ ...inputStyle, width: 'auto', paddingRight: '32px' }}
          >
            <option value='Men'>Men</option>
            <option value='Women'>Women</option>
            <option value='Boys'>Boys</option>
            <option value='Girls'>Girls</option>
          </select>
        </div>
 
        <div className='flex flex-col gap-1.5'>
          <label style={labelStyle}>SUBCATEGORY</label>
          <select
            onChange={handleSubCategoryChange}
            style={{ ...inputStyle, width: 'auto', paddingRight: '32px' }}
          >
            <option value='Topwear'>Topwear</option>
            <option value='Bottomwear'>Bottomwear</option>
            <option value='Dress'>Dress</option>
            <option value='Winterwear'>Winterwear</option>
            <option value='Accessories'>Accessories</option>
            <option value='Shoes'>Shoes</option>
          </select>
        </div>
 
        <div className='flex flex-col gap-1.5'>
          <label style={labelStyle}>PRICE (RON)</label>
          <input
            type='number'
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder='0'
            style={{ ...inputStyle, width: '100px' }}
          />
        </div>
      </div>
 
      {/* Sizes */}
      <div>
        <label style={labelStyle}>SIZES</label>
        <div className='flex gap-2'>
          {getSizes(category, subCategory).map(s => (
            <button
              key={s}
              type='button'
              onClick={() => toggleSize(s)}
              className='px-4 py-1.5 text-xs transition-all font-[DM_Sans] cursor-pointer tracking-[0.08em]'
              style={{
                border: `1px solid ${sizes.includes(s) ? 'var(--blush-dim)' : 'var(--text-faint)'}`,
                background: sizes.includes(s) ? 'var(--blush-light)' : 'var(--white)',
                color: sizes.includes(s) ? 'var(--rose)' : 'var(--text-mid)',
                fontWeight: sizes.includes(s) ? 500 : 300
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
 
      {/* Bestseller */}
      <label className='flex items-center gap-3 cursor-pointer w-fit'>
        <input
          type='checkbox'
          checked={bestseller}
          onChange={() => setBestseller(prev => !prev)}
          style={{ width: '14px', height: '14px', accentColor: 'var(--rose)', cursor: 'pointer' }}
        />
        <span className='text-xs tracking-wide' style={{ color: 'var(--text-mid)', letterSpacing: '0.1em' }}>
          ADD TO BESTSELLERS
        </span>
      </label>
 
      {/* Submit */}
      <button
        type='submit'
        className='w-fit px-10 py-3 text-xs tracking-widest transition-colors'
        style={{
          background: 'var(--blush)',
          color: 'var(--text-dark)',
          border: 'none',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          letterSpacing: '0.15em',
          cursor: 'pointer',
        }}
        onMouseEnter={e => e.target.style.background = 'var(--blush-dim)'}
        onMouseLeave={e => e.target.style.background = 'var(--blush)'}
      >
        ADD PRODUCT
      </button>
 
    </form>
  )
}

export default Add
