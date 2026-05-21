// const fs = require('fs'); // Just to satisfy standard linters, but we use standard React imports
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to original page or home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign In
        if (!email || !password) {
          throw new Error('Please fill in all fields');
        }
        const data = await api.post('/auth/login', { email, password });
        onLoginSuccess(data);
        
        // Redirect based on role
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      } else {
        // Sign Up (First user becomes Admin)
        if (!name || !email || !password) {
          throw new Error('Please fill in all fields');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        const data = await api.post('/auth/signup', { name, email, password });
        onLoginSuccess(data);

        // Redirect based on role
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] flex items-center justify-center pt-24 pb-12 px-6 font-sans antialiased text-[#362720]">
      <div className="w-full max-w-md">
        
        {/* Logo and Greeting Header */}
        <div className="text-center mb-8">
          <p className="text-[#b38f44] text-[10px] tracking-[0.4em] mb-2 uppercase font-bold">
            Orvélia Parfums
          </p>
          <h2 className="text-3xl font-light tracking-tight text-[#261c16]">
            {isLogin ? 'Welcome Back' : 'Create Atelier Account'}
          </h2>
          <div className="w-12 h-[1px] bg-[#d4af37] mx-auto mt-4" />
        </div>

        {/* Card Body Panel */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-stone-200/80 p-8 rounded-sm shadow-xl flex flex-col justify-between"
        >
          {/* Error Message Box */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border-l-2 border-red-500 text-red-800 text-xs font-medium rounded-sm flex items-center gap-2"
            >
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input field (Sign Up Mode) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  Atelier Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-sm py-3 pl-12 pr-4 text-sm text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address Input field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-sm py-3 pl-12 pr-4 text-sm text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Input field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  Password
                </label>
                {isLogin && (
                  <span className="text-[10px] tracking-wider text-stone-400 hover:text-[#b38f44] cursor-pointer font-medium transition-colors">
                    Forgot Key?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder={isLogin ? "Enter your security password" : "Create password (min 6 chars)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-sm py-3 pl-12 pr-4 text-sm text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Helper Notice for Sign Up */}
            {!isLogin && (
              <p className="text-[10px] text-stone-400 leading-normal flex items-start gap-1.5 mt-1 bg-stone-50 p-2.5 rounded-sm border border-stone-100">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b38f44] shrink-0" />
                <span>Note: To facilitate quick setup, the first user registered in this system is automatically configured as the **Store Administrator**.</span>
              </p>
            )}

            {/* Submission Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-[#26201c] hover:bg-black text-white text-xs font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-all duration-300 rounded-sm disabled:bg-stone-400 disabled:cursor-not-allowed group shadow-md"
            >
              {loading ? 'Validating credentials...' : (isLogin ? 'SIGN IN' : 'REGISTER')}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Toggle form button option */}
          <div className="mt-8 border-t border-stone-100 pt-6 text-center">
            <p className="text-xs text-stone-500 font-light">
              {isLogin ? "New to the atelier?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-[#b38f44] hover:text-[#8d6f31] font-bold tracking-wider ml-1.5 hover:underline focus:outline-none"
              >
                {isLogin ? 'Create Account' : 'Sign In Here'}
              </button>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Login;
