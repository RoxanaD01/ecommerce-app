import { toast } from "react-toastify";
import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "RON ";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
  localStorage.removeItem("token");
  setToken("");
  setCartItems({});
}, []);

  const addToCart = useCallback(async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          {headers:{ Authorization: `Bearer ${token}` }},
        );
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          toast.info("Session expired. Please log in again.");
          return;
        }
        console.log(error);
        toast.error(error.message);
      }
    }
  },[cartItems, token, backendUrl, logout]);

   const updateQuantity = useCallback(async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          {headers:{ Authorization: `Bearer ${token}` } },
        );
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          toast.info("Session expired. Please log in again.");
          return;
        }
        console.log(error);
        toast.error(error.message);
      }
    }
  },[cartItems, token, backendUrl,logout]);

  const cartCount = useMemo(() => {
    let totalCount = 0;
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          totalCount += cartItems[productId][size]; 
        }
      }
    }
    return totalCount;
  },[cartItems]);


  const cartAmount = useMemo(() => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      let itemInfo = products.find((product) => product._id === productId);

      for (const size in cartItems[productId]) {
        if (itemInfo && cartItems[productId][size] > 0) {
          totalAmount += itemInfo.price * cartItems[productId][size];
        }
      }
    }
    return totalAmount;
  },[cartItems, products]);

  const getProductsData = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  },[backendUrl]);

  const getUserCart = useCallback(async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        {headers:{ Authorization: `Bearer ${token}` }},
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      if (error.response?.status === 401) {
      logout();
      toast.info("Session expired. Please log in again.");
      return;
    }
      console.log(error);
      toast.error(error.message);
    }
  },[backendUrl, logout]);

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
    setTokenLoaded(true);
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    cartCount,
    getCartCount: () => cartCount,   
    getCartAmount: () => cartAmount, 
    updateQuantity,
    cartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    setCartItems,
    tokenLoaded
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;


 