import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Edit from './pages/Edit'
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

// Take this backend address from env variable
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'RON'

const App = () => {
  // If the token is aviable (= the user is authenticated) the admin component will be displayed, if NOT, will be displayed the Login component

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
   const interceptor = axios.interceptors.response.use (
    res => res, 
    err => {
        if (err.response?.status === 401) {
          setToken('')                            // șterge tokenul → userul e redirecționat la login
        } 
        return Promise.reject(err)
      }
    )
    // cleanup — important să elimini interceptorul când se schimbă token-ul
    return () => axios.interceptors.response.eject(interceptor)
  },[token])

  // Whenever this token will be updated, then this function will be executed and will store that token in the localStorage
  useEffect(() => {
    token ? localStorage.setItem('token', token) : localStorage.removeItem('token')
  }, [token])

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken}/>
      ) : (
        <>
          <Navbar setToken={setToken}/>
          <div className="flex w-full" style={{ borderTop: '1px solid var(--text-faint)' }}>
            <Sidebar />
             <div className="flex-1 px-6 sm:px-10 py-8" style={{ color: 'var(--text-dark)' }}>
              <Routes>
                <Route path="/add" element={<Add token={token}/>} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token}/>} />
                <Route path="/edit/:id" element={<Edit token={token}/>} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
