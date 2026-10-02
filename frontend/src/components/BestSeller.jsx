import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from "./ProductItem";

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0,5));
    },[products]) 

  return (
     <section className='my-16'>
      <div className='text-center py-10'>   
        <Title text1={'BEST'} text2={'SELLERS'}></Title>
        <p
          className='mt-4 text-sm leading-loose mx-auto max-w-lg'
          style={{ color: 'var(--text-soft)', fontWeight: 300 }}
        >
          Our most-loved pieces, chosen by thousands of happy customers.
          Timeless, comfortable, and always on-trend.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
            bestSeller.map((item) => (
                <ProductItem key={item._id} id={item._id} name={item.name} image={item.image} price={item.price} />
            ))
        }
      </div>
    </section>
  )
}

export default BestSeller;
