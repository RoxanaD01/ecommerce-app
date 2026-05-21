import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import Reviews from "../components/Reviews";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/${productId}`);
      if (response.data.success) setReviews(response.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const avgRating =
    reviews.length > 0
      ? Math.round(
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
        )
      : 0;

  const filledStars = avgRating;
  const dullStars = 5 - filledStars;

  useEffect(() => {
    const fetchProductData = () => {
      const item = products.find((p) => p._id === productId);
      if (item) {
        setProductData(item);
        setImage(item.image[0]);
      }
    };
    fetchProductData()
  }, [productId, products]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/review/${productId}`,
        );
        if (response.data.success) setReviews(response.data.reviews);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews()
  }, [productId]);

  useEffect(() => {
    window.scrollTo(0, 0)
}, [productId])

  if (!productData) return <div className="opacity-0 min-h-screen" />;

  return (
    <div
      className="pt-10 transition-opacity duration-500 opacity-100"
      style={{ borderTop: "1px solid var(--text-faint)" }}
    >
      {/* ── Product layout ── */}
      <div className="flex flex-col sm:flex-row gap-10 sm:gap-14">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-[18%]">
            {productData.image.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setImage(img)}
                className="w-[22%] sm:w-full flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  border:
                    image === img
                      ? "1px solid var(--blush-dim)"
                      : "1px solid transparent",
                  filter: "saturate(0.92)",
                }}
                alt=""
              />
            ))}
          </div>
          {/* Main image */}
          <div className="w-full sm:w-[80%] overflow-hidden">
            <img
              src={image}
              className="w-full h-auto"
              style={{ filter: "saturate(0.92) brightness(0.98)" }}
              alt={productData.name}
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1">
          <h1
            className="playfair text-2xl sm:text-3xl mb-3"
            style={{ color: "var(--text-dark)", fontWeight: 400 }}
          >
            {productData.name}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(filledStars)].map((_, i) => (
              <img
                key={`filled-${i}`}
                src={assets.star_icon}
                className="w-3.5"
                alt=""
              />
            ))}
            {[...Array(dullStars)].map((_, i) => (
              <img
                key={`dull-${i}`}
                src={assets.star_dull_icon}
                className="w-3.5"
                alt=""
              />
            ))}
            <span
              className="ml-2 text-xs"
              style={{ color: "var(--text-soft)" }}
            >
              {reviews.length > 0
                ? `${avgRating}/5 (${reviews.length} review${reviews.length !== 1 ? "s" : ""})`
                : "No reviews yet"}
            </span>
          </div>

          {/* Price */}
          <p
            className="playfair text-3xl mb-5 font-light"
            style={{ color: "var(--text-dark)"}}
          >
            {productData.price} {currency}
          </p>

          {/* Description */}
          <p
            className="text-sm leading-loose mb-8 max-w-md font-light"
            style={{ color: "var(--text-mid)"}}
          >
            {productData.description}
          </p>

          {/* Size selector */}
          <div className="mb-8">
            <p
              className="text-xs tracking-widest mb-3"
              style={{ color: "var(--text-soft)", letterSpacing: "0.2em" }}
            >
              SELECT SIZE
            </p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSize(s)}
                  className="px-4 py-2 text-sm transition-all"
                  style={{
                    border:
                      s === size
                        ? "1px solid var(--rose)"
                        : "1px solid var(--text-faint)",
                    background:
                      s === size ? "var(--blush-light)" : "var(--cream)",
                    color: s === size ? "var(--rose)" : "var(--text-mid)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={() => addToCart(productData._id, size)}
            className="btn-blush mb-8"
          >
            Add to Cart
          </button>

          {/* Trust badges */}
          <div
            className="flex flex-col gap-2 pt-6 text-xs"
            style={{
              borderTop: "1px solid var(--text-faint)",
              color: "var(--text-soft)",
            }}
          >
            {[
              "100% authentic product, guaranteed",
              "Cash on delivery available",
              "Free exchange & returns within 7 days",
              "Sustainably sourced materials",
            ].map((item) => (
              <p key={item} className="flex items-center gap-2">
                <span style={{ color: "var(--sage)" }}>✓</span> {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Reviews ── */}
      <div className="mt-20">
        <div className="flex">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-3 text-xs tracking-widest transition-all capitalize"
              style={{
                letterSpacing: "0.18em",
                border: "1px solid var(--text-faint)",
                borderBottom:
                  activeTab === tab
                    ? "1px solid var(--cream)"
                    : "1px solid var(--text-faint)",
                background:
                  activeTab === tab ? "var(--cream)" : "var(--cream-deep)",
                color:
                  activeTab === tab ? "var(--text-dark)" : "var(--text-soft)",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 400,
                marginRight: "2px",
              }}
            >
              {tab === "reviews"
                ? `Reviews (${reviews.length})`
                : "Description"}
            </button>
          ))}
        </div>

        <div
          className="px-6 py-8"
          style={{ border: "1px solid var(--text-faint)", borderTop: "none" }}
        >
          {activeTab === "description" && (
            <div
              className="flex flex-col gap-4 text-sm leading-loose max-w-2xl"
              style={{ color: "var(--text-mid)", fontWeight: 300 }}
            >
              <p>{productData.description}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex flex-col gap-6">
              {reviews.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-soft)" }}>
                  No reviews yet. Be the first!
                </p>
              ) : (
                reviews.map((review, i) => (
                  <div
                    key={i}
                    className="pb-5"
                    style={{ borderBottom: "1px solid var(--text-faint)" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-dark)" }}
                      >
                        {review.userId?.name || "Anonymous"}
                      </span>
                      <span
                        style={{
                          color: "var(--blush-dim)",
                          letterSpacing: "2px",
                        }}
                      >
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-loose"
                      style={{ color: "var(--text-mid)", fontWeight: 300 }}
                    >
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Reviews productId={productId} onReviewAdded={fetchReviews} />
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
