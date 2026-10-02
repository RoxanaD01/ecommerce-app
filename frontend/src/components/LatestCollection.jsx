import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className="my-16">
      <div className="text-center py-10">
        <Title text1={"SEASON"} text2={"HIGHLIGHTS"} />
        <p
          className='mt-4 text-sm leading-loose mx-auto max-w-lg'
          style={{ color: 'var(--text-soft)', fontWeight: 300 }}
        >
          Fresh styles, just landed. From relaxed weekend looks to polished office-ready pieces —
          discover what's new this season and find your next favourite outfit.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item) => {
    return (
        <ProductItem 
            key={item._id} 
            id={item._id} 
            image={item.image} 
            name={item.name} 
            price={item.price}
        />
    )
})}
      </div>
    </section>
  );
};

export default LatestCollection;
