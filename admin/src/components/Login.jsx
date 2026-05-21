import axios from "axios";
import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "0.875rem",
  border: "1px solid var(--text-faint)",
  background: "var(--cream)",
  color: "var(--text-dark)",
  fontFamily: "DM Sans, sans-serif",
  fontWeight: 300,
  outline: "none",
  transition: "border-color 0.25s",
};

const Login = ({ setToken }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--cream)" }}
    >
      <div
        className="w-full max-w-sm px-10 py-12"
        style={{
          background: "var(--white)",
          boxShadow: "0 8px 40px rgba(196,135,125,0.1)",
        }}
      >
        <div className="text-center mb-8">
          <p
            className="text-xs mb-4 tracking-widest tracking-[0.3em]"
            style={{ color: "var(--text-soft)" }}
          >
            DEMURE
          </p>
          <h1
            className="playfair text-2xl mb-2 font-normal"
            style={{ color: "var(--text-dark)" }}
          >
            Admin Panel
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span
              className="h-px w-8 tracking-[0.2em]"
              style={{ background: "var(--blush-dim)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-soft)" }}>
              SIGN IN TO CONTINUE
            </span>
            <span
              className="h-px w-8"
              style={{ background: "var(--blush-dim)" }}
            />
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 tracking-[0.12em]">
            <label
              className="text-xs tracking-wide"
              style={{ color: "var(--text-soft)" }}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demure.com"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--blush-dim)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--text-faint)")}
            />
          </div>

          <div className="flex flex-col gap-1.5 tracking-[0.12em]">
            <label
              className="text-xs tracking-wide"
              style={{ color: "var(--text-soft)" }}
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--blush-dim)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--text-faint)")
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-soft)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5M6.357 6.357A9.953 9.953 0 003 12c1.564 3.453 5.139 6 9 6a9.95 9.95 0 004.643-1.143M9.879 9.879A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .447-.097.872-.268 1.254M17.76 17.76A9.953 9.953 0 0121 12c-1.564-3.453-5.139-6-9-6a9.95 9.95 0 00-2.878.426" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 text-xs tracking-widest transition-colors border-0 font-[DM_Sans] font-medium tracking-[0.15em] cursor-pointer"
            style={{ background: "var(--blush)", color: "var(--text-dark)" }}
            onMouseEnter={(e) =>
              (e.target.style.background = "var(--blush-dim)")
            }
            onMouseLeave={(e) => (e.target.style.background = "var(--blush)")}
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
