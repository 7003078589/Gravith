'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Building2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login process
    setTimeout(() => {
      // Demo credentials
      if ((username === 'admin' && password === 'admin123') ||
          (username === 'manager' && password === 'manager123') ||
          (username === 'engineer' && password === 'engineer123')) {
        // Store user session
        localStorage.setItem('user', JSON.stringify({
          username,
          role: username === 'admin' ? 'Admin' : username === 'manager' ? 'Manager' : 'Engineer',
          name: username === 'admin' ? 'Admin User' : username === 'manager' ? 'Manager User' : 'Engineer User'
        }));
        
        // Redirect to main dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="/sing in.jpg"
          alt="Background"
          fill
          className="object-cover"
          fallback={<div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-cyan-50" />}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Left Side - Welcome Content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex-1 flex flex-col justify-center px-12 lg:px-16"
      >
        <div className="max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
          >
            Welcome
            <span className="block">Back</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/90 mb-12 leading-relaxed"
          >
            Streamline your construction projects with our comprehensive management platform. Track materials, manage sites, monitor expenses, and optimize your operations with real-time insights and powerful analytics.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex space-x-6"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Facebook className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Twitter className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Instagram className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Youtube className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center px-8 lg:px-12"
      >
        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-white mb-2">Sign in</h2>
          </motion.div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-4 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-500 border-0"
                placeholder="Enter your username"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-500 border-0"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-white">Remember Me</span>
              </label>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign in now'}
            </motion.button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-6 text-center space-y-3"
          >
            <button className="text-white hover:text-orange-300 text-sm font-medium transition-colors">
              Lost your password?
            </button>
            <div className="text-white/80 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => window.location.href = '/signup'}
                className="text-orange-300 hover:text-orange-200 font-medium transition-colors"
              >
                Sign up for free
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-white/80">
              By clicking on 'Sign in now' you agree to{' '}
              <a href="#" className="text-orange-300 hover:text-orange-200 underline">Terms of Service</a>
              {' '}|{' '}
              <a href="#" className="text-orange-300 hover:text-orange-200 underline">Privacy Policy</a>
            </p>
          </motion.div>

          {/* Demo Credentials - Hidden on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hidden lg:block"
          >
            <h3 className="text-sm font-medium text-white mb-2">Demo Credentials:</h3>
            <div className="text-xs text-white/80 space-y-1">
              <div>Admin: admin / admin123</div>
              <div>Manager: manager / manager123</div>
              <div>Engineer: engineer / engineer123</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}